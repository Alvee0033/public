"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR from "swr";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { instance } from "@/lib/axios";
import { MapPin, Sparkles } from "lucide-react";

const MapPinPicker = dynamic(() => import("./MapPinPicker"), { ssr: false });

const schema = z.object({
  address_line1:    z.string().min(3, "Street address is required").max(512),
  address_line2:    z.string().max(512).optional().or(z.literal("")),
  city:             z.string().max(128).optional().or(z.literal("")),
  master_country_id: z.coerce.number({ invalid_type_error: "Select a country" }).positive("Select a country"),
  master_state_id:  z.coerce.number().optional(),
  latitude:  z.coerce.number().min(-90).max(90).optional().or(z.literal("")),
  longitude: z.coerce.number().min(-180).max(180).optional().or(z.literal("")),
});

const swrFetch = (url) => instance.get(url).then((r) => r?.data?.data ?? []);

function fuzzyMatch(a = "", b = "") {
  const al = a.toLowerCase().trim();
  const bl = b.toLowerCase().trim();
  return al === bl || al.includes(bl) || bl.includes(al);
}

function deriveStreetAddress(address = {}) {
  const directStreet = address.road?.trim();
  if (directStreet) return directStreet;

  const displayParts = String(address.displayName ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return displayParts[0] ?? "";
}

function normalizeCoordinate(value, maxDecimals = 7) {
  if (value === "" || value === undefined || value === null) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "";
  return Number(parsed.toFixed(maxDecimals));
}

export default function StepHubLocation({ initialData, onNext, onBack }) {
  const [selectedCountryId, setSelectedCountryId] = useState(
    initialData?.master_country_id ?? null
  );
  const [pendingAddress, setPendingAddress] = useState(null);
  const [autoFillBadge, setAutoFillBadge] = useState(false);

  const { data: countries = [], isLoading: loadingCountries } = useSWR("/master-countries", swrFetch);
  const { data: allStates = [], isLoading: loadingStates }   = useSWR("/master-states", swrFetch);

  const statesForCountry = selectedCountryId
    ? allStates.filter((s) => s.master_country_id === selectedCountryId)
    : [];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      address_line1:     initialData?.address_line1     ?? "",
      address_line2:     initialData?.address_line2     ?? "",
      city:              initialData?.city              ?? "",
      master_country_id: initialData?.master_country_id ?? "",
      master_state_id:   initialData?.master_state_id   ?? "",
      latitude:          initialData?.latitude          ?? "",
      longitude:         initialData?.longitude         ?? "",
    },
  });

  // ── Auto-select Country from map pin ────────────────────────────────────
  useEffect(() => {
    if (!pendingAddress?.country_code || !countries.length) return;
    const cc = pendingAddress.country_code.toUpperCase();
    const match =
      countries.find((c) => (c.ticker ?? "").toUpperCase() === cc) ??
      countries.find((c) => (c.ticker ?? "").toUpperCase().startsWith(cc));
    if (!match) return;
    form.setValue("master_country_id", String(match.id), { shouldValidate: true });
    form.setValue("master_state_id", "");
    setSelectedCountryId(match.id);
  }, [pendingAddress, countries]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-select State from map pin ───────────────────────────────────────
  useEffect(() => {
    if (!pendingAddress?.state || !allStates.length || !selectedCountryId) return;
    const pool = allStates.filter((s) => s.master_country_id === selectedCountryId);
    const match = pool.find((s) => fuzzyMatch(s.name, pendingAddress.state));
    if (!match) return;
    form.setValue("master_state_id", String(match.id));
  }, [pendingAddress, allStates, selectedCountryId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle map pin confirm ───────────────────────────────────────────────
  const handleMapChange = ({ latitude, longitude, address }) => {
    form.setValue("latitude", normalizeCoordinate(latitude), { shouldValidate: true });
    form.setValue("longitude", normalizeCoordinate(longitude), { shouldValidate: true });
    if (!address) return;
    const streetAddress = deriveStreetAddress(address);
    if (streetAddress) form.setValue("address_line1", streetAddress, { shouldValidate: true });
    if (address.line2) form.setValue("address_line2", address.line2);
    // City comes as plain text from Nominatim — no FK needed
    if (address.city)  form.setValue("city", address.city);
    setPendingAddress(address);
    setAutoFillBadge(true);
    setTimeout(() => setAutoFillBadge(false), 3500);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = (values) => {
    const country = countries.find((c) => c.id === Number(values.master_country_id));
    const state   = allStates.find((s) => s.id === Number(values.master_state_id));
    onNext({
      ...values,
      latitude: normalizeCoordinate(values.latitude),
      longitude: normalizeCoordinate(values.longitude),
      country_code: country?.ticker?.length === 2 ? country.ticker : undefined,
      state_code:   state?.ticker ?? undefined,
      // city is already a plain string in values — pass it through directly
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* ── Map ── */}
        <div className="border rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                Search &amp; Pin Your Location
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                Search or click the map — address, city, country &amp; state fill automatically.
              </p>
            </div>
            {autoFillBadge && (
              <span className="inline-flex items-center gap-1 shrink-0 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                <Sparkles className="w-3 h-3" />
                Auto-filled
              </span>
            )}
          </div>
          <div className="bg-white p-3">
            <MapPinPicker
              latitude={form.watch("latitude")}
              longitude={form.watch("longitude")}
              onChange={handleMapChange}
            />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <FormField control={form.control} name="latitude" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-500">Latitude</FormLabel>
                  <FormControl><Input {...field} type="number" step="any" placeholder="Set via map" className="bg-gray-50 text-xs" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="longitude" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-500">Longitude</FormLabel>
                  <FormControl><Input {...field} type="number" step="any" placeholder="Set via map" className="bg-gray-50 text-xs" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </div>
        </div>

        {/* ── Street address ── */}
        <FormField control={form.control} name="address_line1" render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
            <FormControl><Input {...field} placeholder="123 Main Street" className="bg-gray-50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="address_line2" render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2</FormLabel>
            <FormControl><Input {...field} placeholder="Suite, Floor, Building…" className="bg-gray-50" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* ── City (plain text from map) ── */}
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Auto-filled from map, or type manually"
                className="bg-gray-50"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* ── Country ── */}
        <FormField control={form.control} name="master_country_id" render={({ field }) => (
          <FormItem>
            <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <select
                value={field.value}
                name={field.name}
                ref={field.ref}
                className="w-full border rounded-md px-3 py-2 bg-gray-50 text-sm"
                onChange={(e) => {
                  field.onChange(e.target.value);
                  const cid = Number(e.target.value) || null;
                  setSelectedCountryId(cid);
                  form.setValue("master_state_id", "");
                  setPendingAddress((p) => p ? { ...p, country_code: null, state: null } : null);
                }}
              >
                <option value="">{loadingCountries ? "Loading…" : "Select country"}</option>
                {countries.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}{c.ticker ? ` (${c.ticker})` : ""}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* ── State ── */}
        <FormField control={form.control} name="master_state_id" render={({ field }) => (
          <FormItem>
            <FormLabel>State / Province</FormLabel>
            <FormControl>
              <select
                value={field.value}
                name={field.name}
                ref={field.ref}
                className="w-full border rounded-md px-3 py-2 bg-gray-50 text-sm"
                disabled={!selectedCountryId}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setPendingAddress((p) => p ? { ...p, state: null } : null);
                }}
              >
                <option value="">
                  {loadingStates
                    ? "Loading…"
                    : statesForCountry.length === 0 && selectedCountryId
                    ? "No states found"
                    : "Select state"}
                </option>
                {statesForCountry.map((s) => (
                  <option key={s.id} value={String(s.id)}>{s.name}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack} className="px-8">← Back</Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8">Continue →</Button>
        </div>
      </form>
    </Form>
  );
}
