"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const unwrap = (res) => res?.data?.data ?? res?.data;
const EMPTY_SELECT = "__none__";

const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const INCOME_BRACKET_OPTIONS = [
  { value: "under-40k", label: "Under 40k" },
  { value: "40k-60k", label: "40k - 60k" },
  { value: "60k-80k", label: "60k - 80k" },
  { value: "80k-100k", label: "80k - 100k" },
  { value: "100k-plus", label: "100k+" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const COURSE_LEVEL_OPTIONS = [
  { value: "high-school", label: "High School" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "doctoral", label: "Doctoral / PhD" },
  { value: "certificate", label: "Certificate" },
  { value: "bootcamp", label: "Bootcamp" },
];

const DELIVERY_MODE_OPTIONS = [
  { value: "online", label: "Online" },
  { value: "in-person", label: "In-person" },
  { value: "hybrid", label: "Hybrid" },
  { value: "any", label: "Any" },
];

const CURRENCY_OPTIONS = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "BDT", label: "BDT" },
];

function optionalCalendarYyyyMmDd(raw) {
  if (raw == null) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return undefined;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return undefined;
  }
  return s;
}

function optionalCalendarMmDdYyyy(raw) {
  if (raw == null) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return undefined;
  const mo = Number(m[1]);
  const d = Number(m[2]);
  const y = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return undefined;
  }
  return `${m[3]}-${m[1]}-${m[2]}`;
}

function dateInputValue(raw) {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  const iso = optionalCalendarYyyyMmDd(s.length >= 10 ? s.slice(0, 10) : s);
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

function normalizeSelectValue(raw) {
  const s = String(raw ?? "").trim();
  return s || EMPTY_SELECT;
}

function optionalFiniteNumber(raw) {
  if (raw === "" || raw == null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function optionalIntString(raw) {
  if (raw === "" || raw == null) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return undefined;
  return n;
}

function formatApiErrorMessage(
  e,
  fallback = "Save failed. Check values and try again.",
) {
  const m = e?.response?.data?.message;
  if (Array.isArray(m)) {
    const joined = m.filter(Boolean).join(" ");
    if (joined) return joined;
  }
  if (typeof m === "string" && m.trim()) return m;
  return fallback;
}

export default function ScholarshipMatchingProfilePage() {
  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [gender, setGender] = useState("");
  const [gpa, setGpa] = useState("");
  const [incomeBracket, setIncomeBracket] = useState("");
  const [preferredCourseLevel, setPreferredCourseLevel] = useState("");
  const [preferredDeliveryMode, setPreferredDeliveryMode] = useState("");
  const [preferredCountryId, setPreferredCountryId] = useState("");
  const [preferredStateId, setPreferredStateId] = useState("");
  const [desiredStartDate, setDesiredStartDate] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [budgetCurrencyCode, setBudgetCurrencyCode] = useState("USD");
  const [needsScholarship, setNeedsScholarship] = useState(false);
  const [preferredSubjectAreasText, setPreferredSubjectAreasText] = useState("");
  const [preferredInstituteTypesText, setPreferredInstituteTypesText] = useState("");

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const filteredStates = useMemo(() => {
    if (!preferredCountryId) return states;
    const countryIdNum = Number(preferredCountryId);
    return states.filter((state) => {
      const nestedId = state?.master_country?.id;
      const flatId = state?.master_country_id;
      return Number(nestedId ?? flatId) === countryIdNum;
    });
  }, [preferredCountryId, states]);

  useEffect(() => {
    if (!preferredStateId) return;
    const exists = filteredStates.some(
      (state) => String(state?.id) === String(preferredStateId),
    );
    if (!exists) setPreferredStateId("");
  }, [filteredStates, preferredStateId]);

  const loadLocationMeta = useCallback(async () => {
    setMetaLoading(true);
    try {
      const [countriesRes, statesRes] = await Promise.all([
        api.get("/master-countries"),
        api.get("/master-states"),
      ]);
      const nextCountries = Array.isArray(unwrap(countriesRes))
        ? unwrap(countriesRes)
        : [];
      const nextStates = Array.isArray(unwrap(statesRes)) ? unwrap(statesRes) : [];
      setCountries(nextCountries);
      setStates(nextStates);
    } catch {
      toast.error("Could not load country/state options.");
    } finally {
      setMetaLoading(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const meRes = await api.get("/student-matching-profile/me");
      const me = unwrap(meRes);

      const p = me?.profile;
      if (p) {
        setGender(p.gender ?? "");
        setGpa(p.gpa != null ? String(p.gpa) : "");
        setIncomeBracket(p.income_bracket ?? "");
        setPreferredCourseLevel(p.preferred_course_level ?? "");
        setPreferredDeliveryMode(p.preferred_delivery_mode ?? "");
        setPreferredCountryId(
          p.preferred_country_id != null ? String(p.preferred_country_id) : "",
        );
        setPreferredStateId(
          p.preferred_state_id != null ? String(p.preferred_state_id) : "",
        );
        setDesiredStartDate(dateInputValue(p.desired_start_date));
        setMinBudget(p.min_budget != null ? String(p.min_budget) : "");
        setMaxBudget(p.max_budget != null ? String(p.max_budget) : "");
        setBudgetCurrencyCode((p.budget_currency_code ?? "USD").toUpperCase());
        setNeedsScholarship(Boolean(p.needs_scholarship));
        setPreferredSubjectAreasText(p.preferred_subject_areas_text ?? "");
        setPreferredInstituteTypesText(p.preferred_institute_types_text ?? "");
      } else {
        setPreferredSubjectAreasText("");
        setPreferredInstituteTypesText("");
      }
    } catch (e) {
      console.error(e);
      toast.error(
        formatApiErrorMessage(
          e,
          "Could not load matching profile. Sign in and try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    loadLocationMeta();
  }, [loadLocationMeta]);

  const onSave = async () => {
    setSaving(true);
    try {
      const body = {
        gender: gender.trim() || undefined,
        gpa: optionalFiniteNumber(gpa),
        income_bracket: incomeBracket.trim() || undefined,
        preferred_course_level: preferredCourseLevel.trim() || undefined,
        preferred_delivery_mode: preferredDeliveryMode.trim() || undefined,
        preferred_country_id: optionalIntString(preferredCountryId),
        preferred_state_id: optionalIntString(preferredStateId),
        desired_start_date:
          optionalCalendarMmDdYyyy(desiredStartDate) ??
          optionalCalendarYyyyMmDd(desiredStartDate),
        min_budget: optionalFiniteNumber(minBudget),
        max_budget: optionalFiniteNumber(maxBudget),
        budget_currency_code: (() => {
          const s = budgetCurrencyCode.trim().toUpperCase();
          if (!s) return undefined;
          return s.slice(0, 3);
        })(),
        needs_scholarship: needsScholarship,
        preferred_subject_areas_text: preferredSubjectAreasText.trim() || undefined,
        preferred_institute_types_text:
          preferredInstituteTypesText.trim() || undefined,
      };

      await api.patch("/student-matching-profile/me", body);
      toast.success("Profile saved");
      await load();
    } catch (e) {
      console.error(e);
      toast.error(formatApiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-[#5F2DED]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-[#5F2DED]">
        Scholarship Matching Profile
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Information used to match you with relevant scholarships and programs.
        Your answers are stored on your account when you click Save profile.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About you</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={normalizeSelectValue(gender)}
              onValueChange={(value) =>
                setGender(value === EMPTY_SELECT ? "" : value)
              }
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_SELECT}>Not specified</SelectItem>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpa">GPA (0-5)</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min={0}
              max={5}
              placeholder="0.00"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="incomeBracket">Income bracket</Label>
            <Select
              value={normalizeSelectValue(incomeBracket)}
              onValueChange={(value) =>
                setIncomeBracket(value === EMPTY_SELECT ? "" : value)
              }
            >
              <SelectTrigger id="incomeBracket">
                <SelectValue placeholder="Select income bracket" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_SELECT}>Not specified</SelectItem>
                {INCOME_BRACKET_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseLevel">Preferred course level</Label>
            <Select
              value={normalizeSelectValue(preferredCourseLevel)}
              onValueChange={(value) =>
                setPreferredCourseLevel(value === EMPTY_SELECT ? "" : value)
              }
            >
              <SelectTrigger id="courseLevel">
                <SelectValue placeholder="Select course level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_SELECT}>Not specified</SelectItem>
                {COURSE_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryMode">Preferred delivery mode</Label>
            <Select
              value={normalizeSelectValue(preferredDeliveryMode)}
              onValueChange={(value) =>
                setPreferredDeliveryMode(value === EMPTY_SELECT ? "" : value)
              }
            >
              <SelectTrigger id="deliveryMode">
                <SelectValue placeholder="Select delivery mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_SELECT}>Not specified</SelectItem>
                {DELIVERY_MODE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="countryId">Preferred country ID</Label>
            <Select
              value={normalizeSelectValue(preferredCountryId)}
              onValueChange={(value) =>
                setPreferredCountryId(value === EMPTY_SELECT ? "" : value)
              }
              disabled={metaLoading}
            >
              <SelectTrigger id="countryId">
                <SelectValue
                  placeholder={
                    metaLoading ? "Loading countries..." : "Select country"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_SELECT}>Not specified</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={String(country.id)}>
                    {country.name} ({country.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stateId">Preferred state ID</Label>
            <Select
              value={normalizeSelectValue(preferredStateId)}
              onValueChange={(value) =>
                setPreferredStateId(value === EMPTY_SELECT ? "" : value)
              }
              disabled={metaLoading || filteredStates.length === 0}
            >
              <SelectTrigger id="stateId">
                <SelectValue
                  placeholder={
                    metaLoading
                      ? "Loading states..."
                      : filteredStates.length
                        ? "Select state"
                        : "No state available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EMPTY_SELECT}>Not specified</SelectItem>
                {filteredStates.map((state) => (
                  <SelectItem key={state.id} value={String(state.id)}>
                    {state.name} ({state.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Desired start date</Label>
            <Input
              id="startDate"
              type="text"
              placeholder="mm/dd/yyyy"
              maxLength={10}
              value={desiredStartDate}
              onChange={(e) => setDesiredStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minBudget">Min budget</Label>
            <Input
              id="minBudget"
              type="number"
              min={0}
              step="0.01"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxBudget">Max budget</Label>
            <Input
              id="maxBudget"
              type="number"
              min={0}
              step="0.01"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Budget currency (3 letters)</Label>
            <Select
              value={normalizeSelectValue(budgetCurrencyCode.toUpperCase())}
              onValueChange={(value) =>
                setBudgetCurrencyCode(value)
              }
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="needsScholarship">I need scholarship support</Label>
            <Select
              value={needsScholarship ? "yes" : "no"}
              onValueChange={(value) => setNeedsScholarship(value === "yes")}
            >
              <SelectTrigger id="needsScholarship">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Preferred subject areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Describe subjects or fields you care about (e.g. computer science,
            nursing, music).
          </p>
          <Textarea
            id="preferredSubjects"
            rows={4}
            placeholder="Type your preferred subjects or academic areas..."
            value={preferredSubjectAreasText}
            onChange={(e) => setPreferredSubjectAreasText(e.target.value)}
            className="min-h-[110px] resize-y"
          />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Preferred institute types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Describe the kinds of schools or programs you prefer (e.g. public
            university, community college, online bootcamp, trade school).
          </p>
          <Textarea
            id="preferredInstitutes"
            rows={4}
            placeholder="Type your preferred institute or program types..."
            value={preferredInstituteTypesText}
            onChange={(e) => setPreferredInstituteTypesText(e.target.value)}
            className="min-h-[110px] resize-y"
          />
        </CardContent>
      </Card>

      <Button
        type="button"
        className="bg-[#5F2DED] hover:bg-[#4a24c7]"
        disabled={saving}
        onClick={onSave}
      >
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save profile"
        )}
      </Button>
    </div>
  );
}
