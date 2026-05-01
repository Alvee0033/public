"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";

const SERVICES = [
  { id: "Tutoring", label: "Tutoring" },
  { id: "STEM Lab", label: "STEM Lab" },
  { id: "Bootcamp", label: "Bootcamp" },
  { id: "Device Rental", label: "Device Rental" },
];

const schema = z.object({
  hub_name: z.string().min(2, "Hub name must be at least 2 characters").max(256),
  hub_description: z.string().min(10, "Please provide a description (min 10 chars)").max(2000).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email address"),
  phone_number: z.string().max(50).optional().or(z.literal("")),
  website_url: z.string().url("Enter a valid URL (include https://)").max(512).optional().or(z.literal("")),
  services_offered: z.array(z.string()).min(1, "Select at least one service"),
});

export default function StepHubProfile({ initialData, onNext }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      hub_name: initialData?.hub_name ?? "",
      hub_description: initialData?.hub_description ?? "",
      email: initialData?.email ?? "",
      phone_number: initialData?.phone_number ?? "",
      website_url: initialData?.website_url ?? "",
      services_offered: initialData?.services_offered ?? [],
    },
  });

  const onSubmit = (values) => {
    onNext(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="hub_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hub Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Greenfield Learning Center" className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hub_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={3}
                  placeholder="Describe what your hub offers..."
                  className="w-full border rounded-md px-3 py-2 bg-gray-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="hub@example.com" className="bg-gray-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" placeholder="+1 555 123 4567" className="bg-gray-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://yourhub.com" className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services_offered"
          render={() => (
            <FormItem>
              <FormLabel>Services Offered <span className="text-red-500">*</span></FormLabel>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {SERVICES.map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services_offered"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value ?? [];
                              field.onChange(
                                checked
                                  ? [...current, service.id]
                                  : current.filter((s) => s !== service.id)
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{service.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Continue →
          </Button>
        </div>
      </form>
    </Form>
  );
}
