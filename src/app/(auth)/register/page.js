"use client";

import logo from "@/assets/icons/admin_logo.png";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { instance } from "@/lib/axios";
import { generateSecurityStamp } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Building2, Eye, EyeOff, GraduationCap, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString, getExampleNumber } from "libphonenumber-js";
import { toast } from "sonner";
import useSWR from "swr";
import * as z from "zod";

// Create a dynamic schema that validates based on role selection
const createFormSchema = (isStudentSelected, isUnder13) => {
  return z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    // Email is optional for students under 13 (they use guardian's email)
    email: (isStudentSelected && isUnder13)
      ? z.string().optional()
      : z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password_hash: z.string().min(8, "Password must be at least 8 characters"),
    roles: z.array(z.number()).min(1, "Please select at least one role"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and privacy policy",
    }),
    birthMonth: isStudentSelected 
      ? z.string().min(1, "Birth month is required for students")
      : z.string().optional(),
    birthYear: isStudentSelected 
      ? z.string().min(1, "Birth year is required for students")
      : z.string().optional(),
    guardianEmail: (isStudentSelected && isUnder13)
      ? z.string().email("Guardian's email is required for students under 13")
      : z.string().optional(),
  });
};

// Initial schema for form setup
const formSchema = createFormSchema(false, false);

const roleOrder = ["student", "tutor", "guardian", "partner"];

const roleIcons = {
  guardian: {
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
    order: 0,
  },
  student: {
    icon: GraduationCap,
    gradient: "from-orange-500 to-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    order: 1,
  },
  tutor: {
    icon: BookOpen,
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    order: 2,
  },
  partner: {
    icon: Building2,
    gradient: "from-green-500 to-green-600",
    bgGradient: "from-green-50 to-green-100",
    order: 3,
  },
};

export default function RegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // default to USA so placeholder and initial flag show +1 — user can still change it
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [passwordStrength, setPasswordStrength] = useState(0);
  // store detected/expected national number length for currently selected country
  const [phoneMaxLength, setPhoneMaxLength] = useState(null);
  const [isStudentSelected, setIsStudentSelected] = useState(false);

  // months/years helpers (used for new DOB fields)
  const months = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    const arr = [];
    for (let y = now; y >= 1900; y--) arr.push(y);
    return arr;
  }, []);

  // Validate phone using libphonenumber-js and auto-detect country from input
  const ensurePhoneLength = (rawValue, country) => {
    if (!rawValue || String(rawValue).trim() === "") {
      form.clearErrors("phone");
      return;
    }

    const value = String(rawValue).trim();
    let detectedCountry = country?.countryCode || selectedCountry;

    // If user entered an international number starting with +, try to parse and detect country automatically
    if (value.startsWith("+")) {
      try {
        const parsed = parsePhoneNumberFromString(value);
        if (parsed && parsed.country) {
          detectedCountry = parsed.country.toLowerCase();
          setSelectedCountry(detectedCountry);
        }
      } catch (e) {
        // ignore parse errors
      }
    }

    const full = value.startsWith("+") ? value : `+${value}`;

    const phone = parsePhoneNumberFromString(full, detectedCountry?.toUpperCase());

    if (phone && phone.isValid && phone.isValid()) {
      form.clearErrors("phone");
      return;
    }

    const displayCountry = country?.name || (detectedCountry ? detectedCountry.toUpperCase() : "the selected country");

    let expectedLen = null;
    try {
      const exampleMobile = getExampleNumber(detectedCountry?.toUpperCase(), "mobile");
      const exampleAny = getExampleNumber(detectedCountry?.toUpperCase());
      const example = exampleMobile || exampleAny;
      if (example && example.nationalNumber) {
        expectedLen = String(example.nationalNumber).length;
      }
    } catch (e) {
      // ignore metadata lookup errors
    }

    if (expectedLen) {
      form.setError("phone", {
        type: "manual",
        message: `Enter a valid phone number for ${displayCountry} — expected ${expectedLen} digits (national number).`,
      });
    } else {
      form.setError("phone", {
        type: "manual",
        message: `Enter a valid phone number for ${displayCountry}.`,
      });
    }

    // update maxLength for the phone input based on detected country
    setPhoneMaxLength(expectedLen);
  };

  const form = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password_hash: "",
      roles: [],
      agreeToTerms: false,
      birthMonth: "",
      birthYear: "",
      guardianEmail: "",
    },
  });

  // compute password strength based on same requirement
  useEffect(() => {
    const subscription = form.watch((value) => {
      const pwd = value.password_hash || "";
      let score = 0;
      if (pwd.length >= 8) score += 34;
      if (/[A-Z]/.test(pwd)) score += 33;
      if (/[#*!]/.test(pwd)) score += 33;
      setPasswordStrength(Math.min(100, score));
    });
    return () => subscription.unsubscribe && subscription.unsubscribe();
  }, [form]);

  // compute age from birthMonth and birthYear
  const computeAge = (monthStr, yearStr) => {
    if (!monthStr || !yearStr) return null;
    const month = Number(monthStr);
    const year = Number(yearStr);
    if (!month || !year) return null;
    const today = new Date();
    const birthDay = new Date(year, month - 1, 1); // use first day of month
    let age = today.getFullYear() - birthDay.getFullYear();
    const m = today.getMonth() - birthDay.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDay.getDate())) {
      age--;
    }
    return age;
  };

  const birthMonth = form.watch("birthMonth");
  const birthYear = form.watch("birthYear");
  const age = computeAge(birthMonth, birthYear);
  const isUnder13 = age !== null && age < 13;

  // priority order and focus logic (unchanged)
  const fieldOrder = [
    "first_name",
    "last_name",
    "email",
    "phone",
    "password_hash",
    "roles",
  ];

  const handleFocus = (fieldName) => {
    // Field focus handler - validation will happen onTouched/onBlur naturally
    // No need to manually trigger validation here
  };

  const {
    data: appRoles,
    isLoading: appRulesLoading,
    error: appRolesError,
  } = useSWR("public-signup-roles", async () => {
    const response = await instance.get("/roles/public-signup");
    return Array.isArray(response?.data?.data) ? response.data.data : [];
  });

  const filteredRoles = (Array.isArray(appRoles) ? appRoles : [])
    .filter((role) => {
      const lower = String(role.name).toLowerCase();
      return (
        ["guardian", "student", "tutor"].includes(lower) ||
        lower.includes("partner")
      );
    })
    .reduce((acc, role) => {
      const lower = String(role.name).toLowerCase();
      // Map "learninghub marketplace partner" (and any future partner variant) → "partner"
      const roleName = lower.includes("partner") ? "partner" : lower;
      if (roleIcons[roleName]) {
        acc[roleName] = {
          id: Number(role.id),
          name: roleName,
          icon: roleIcons[roleName].icon,
          gradient: roleIcons[roleName].gradient,
          bgGradient: roleIcons[roleName].bgGradient,
        };
      }
      return acc;
    }, {});

  useEffect(() => {
    const roleParam = String(searchParams.get("role") || "").toLowerCase();
    const partnerId = filteredRoles?.partner?.id;
    const selectedRoles = form.getValues("roles") || [];
    if (roleParam === "partner" && partnerId && selectedRoles.length === 0) {
      form.setValue("roles", [partnerId], { shouldValidate: true });
      setIsStudentSelected(false);
    }
  }, [searchParams, filteredRoles?.partner?.id, form]);

  // Watch for role changes to determine if student is selected
useEffect(() => {
  const subscription = form.watch((value) => {
    const studentId = filteredRoles?.student?.id;
    if (!studentId) return;
    
    const currentRoles = value.roles || [];
    const isStudent = currentRoles.includes(studentId);
    setIsStudentSelected(isStudent);
  });
  return () => subscription.unsubscribe && subscription.unsubscribe();
}, [form, filteredRoles?.student?.id]);

  // Update form validation schema when student status or age changes
  // Note: We don't trigger validation here to avoid showing errors before user interaction
  useEffect(() => {
    const newSchema = createFormSchema(isStudentSelected, isUnder13);
    // Only clear errors for fields that are no longer required
    if (!isStudentSelected) {
      form.clearErrors("birthMonth");
      form.clearErrors("birthYear");
    }
    if (!isUnder13 || !isStudentSelected) {
      form.clearErrors("guardianEmail");
    }
    // Clear email for students under 13 since they don't need it
    if (isStudentSelected && isUnder13) {
      form.clearErrors("email");
      form.setValue("email", "");
    }
  }, [isStudentSelected, isUnder13, form]);

  const onSubmit = async (values) => {
    console.log("Form submitted with values:", values);
    console.log("isStudentSelected:", isStudentSelected);
    console.log("isUnder13:", isUnder13);
    
    // Manual validation for required fields
    if (!values.first_name || !values.last_name) {
      toast.error("Please enter your first and last name.");
      return;
    }

    if (!values.password_hash || values.password_hash.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (!values.agreeToTerms) {
      toast.error("You must agree to the terms and privacy policy.");
      return;
    }

    if (!values.roles || values.roles.length === 0) {
      toast.error("Please select a role.");
      return;
    }

    // Validate student-specific fields
    if (isStudentSelected) {
      if (!values.birthMonth || !values.birthYear) {
        toast.error("Please select your date of birth.");
        return;
      }

      if (isUnder13 && !values.guardianEmail) {
        toast.error("Please enter your guardian's email.");
        return;
      }
    }

    // Validate email for non-student under 13
    if (!(isStudentSelected && isUnder13)) {
      if (!values.email) {
        toast.error("Please enter your email address.");
        return;
      }
    }

    setSubmitting(true);

    // compose date_of_birth payload (YYYY-MM-01) if provided
    let date_of_birth = null;
    if (values.birthYear && values.birthMonth) {
      const mm = values.birthMonth.padStart(2, "0");
      date_of_birth = `${values.birthYear}-${mm}-01`;
    }

    // Determine if this is a student under 13
    const studentId = filteredRoles?.student?.id;
    const isStudentUnder13 = isStudentSelected && isUnder13 && values.guardianEmail;

    // For students under 13: username and email are both set to guardian's email
    const userEmail = isStudentUnder13 ? values.guardianEmail : values.email;
    
    // Build a clean payload that exactly matches EOS26Core RegisterDto:
    // { email, password, username?, first_name?, last_name?, phone_number?, primary_role_id? }
    const payload = {
      email: userEmail,
      username: userEmail,                    // derived from email — satisfies NOT NULL constraint
      password: values.password_hash,         // form field is password_hash, DTO field is password
      first_name: values.first_name || undefined,
      last_name: values.last_name || undefined,
      phone_number: values.phone || undefined,
      primary_role_id: values.roles?.[0],
    };

    try {
      const response = await instance.post("/auth/register", payload);

      // Save token + user so subsequent pages (wizard, dashboard) are authenticated
      const { access_token, user: registeredUser } = response.data?.data || {};
      if (access_token) {
        localStorage.setItem("auth-token", access_token);
      }
      if (registeredUser) {
        localStorage.setItem("user", JSON.stringify(registeredUser));
      }

      // Detect selected role key to handle partner post-registration redirect
      const selectedRoleId = values.roles?.[0];
      const isPartner = filteredRoles?.partner?.id === selectedRoleId;

      if (isPartner) {
        toast.success("Registration successful! Let's register your hub.");
        router.push('/learninghubs/register');
      } else {
        toast.success("Registration successful! Please log in.");
        router.push('/login');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Error registering user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "/auth/google";
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-lg overflow-hidden shadow-lg">
      <CardHeader className="text-center py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500">
        <div className="flex justify-center mb-4">
          <Image
            src={logo}
            alt="ScholarPASS Logo"
            width={64}
            height={64}
            className="rounded-lg"
          />
        </div>
        <CardTitle className="text-3xl font-bold text-white">
          Join ScholarPASS
        </CardTitle>
        <CardDescription className="text-white/90">
          Connect, Learn, and Grow Together
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection - Always show first */}
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold mb-4 text-gray-900">
                    Choose your role
                  </FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {appRulesLoading ? (
                      <div>Loading roles...</div>
                    ) : appRolesError ? (
                      <div className="col-span-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Unable to load signup roles right now. Please try again shortly.
                      </div>
                    ) : Object.entries(filteredRoles).length === 0 ? (
                      <div className="col-span-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Signup roles are currently unavailable.
                      </div>
                    ) : (
                      Object.entries(filteredRoles)
                        .sort(
                          ([a], [b]) =>
                            roleOrder.indexOf(a) - roleOrder.indexOf(b)
                        )
                        .map(([role, { id, icon: Icon, gradient, bgGradient }]) => {
                          return (
                            <FormField
                              key={role}
                              control={form.control}
                              name="roles"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div
                                      className={`relative rounded-xl p-4 transition-all duration-200 bg-gradient-to-b min-h-28 ${field.value?.includes(id) ? gradient : bgGradient
                                        } cursor-pointer`}
                                      onClick={() => {
                                        field.onChange([id]);
                                        setIsStudentSelected(role === "student");
                                        // Reset DOB and guardian email when changing roles
                                        if (role !== "student") {
                                          form.setValue("birthMonth", "");
                                          form.setValue("birthYear", "");
                                          form.setValue("guardianEmail", "");
                                        }
                                      }}
                                      onFocus={() => handleFocus("roles")}
                                      tabIndex={0}
                                      role="button"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          field.onChange([id]);
                                          setIsStudentSelected(role === "student");
                                          if (role !== "student") {
                                            form.setValue("birthMonth", "");
                                            form.setValue("birthYear", "");
                                            form.setValue("guardianEmail", "");
                                          }
                                        }
                                      }}
                                    >
                                      <div className="flex flex-col items-center">
                                        <Icon
                                          className={`h-8 w-8 mb-2 ${field.value?.includes(id) ? "text-white" : ""
                                            }`}
                                        />
                                        <span
                                          className={`font-medium ${field.value?.includes(id) ? "text-white" : "text-gray-700"
                                            }`}
                                        >
                                          {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </span>
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          );
                        })
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Show rest of form only after role is selected */}
            {form.watch("roles")?.length > 0 && (
              <>
                {/* DOB input for students only */}
                {isStudentSelected && (
                  <div>
                    <FormLabel className="text-gray-900">What is your date of birth?</FormLabel>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <FormField
                        control={form.control}
                        name="birthMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <select
                                {...field}
                                id="birthMonth"
                                value={field.value || ""}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                                className="border rounded-md px-3 py-2 bg-white w-full"
                                aria-invalid={!!form.formState.errors.birthMonth}
                                aria-describedby={form.formState.errors.birthMonth ? "birthMonth-error" : undefined}
                              >
                                <option value="">Month</option>
                                {months.map((m, idx) => (
                                  <option key={m} value={(idx + 1).toString()}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage id="birthMonth-error" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <select
                                {...field}
                                id="birthYear"
                                value={field.value || ""}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                                className="border rounded-md px-3 py-2 bg-white w-full"
                                aria-invalid={!!form.formState.errors.birthYear}
                                aria-describedby={form.formState.errors.birthYear ? "birthYear-error" : undefined}
                              >
                                <option value="">Year</option>
                                {years.map((y) => (
                                  <option key={y} value={y.toString()}>
                                    {y}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage id="birthYear-error" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Show age message if student */}
                    {age !== null && (
                      <p className="text-sm text-gray-600 mt-2">
                        Age: {age} years old
                      </p>
                    )}
                  </div>
                )}

                {/* Guardian Email for students under 13 - This becomes their User ID */}
                {isStudentSelected && isUnder13 && (
                  <FormField
                    control={form.control}
                    name="guardianEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Guardian&apos;s Email (Your User ID)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="guardian@example.com"
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <p className="text-sm text-blue-600 mt-1">
                          You&apos;ll use your guardian&apos;s email to sign in to your account.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onFocus={() => handleFocus("first_name")}
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onFocus={() => handleFocus("last_name")}
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email field - Only show for non-students or students 13+ */}
                {!(isStudentSelected && isUnder13) && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">Email (User ID)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onFocus={() => handleFocus("email")}
                            className="bg-gray-50"
                            placeholder="your.email@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Mobile Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          country={"us"} // Always start with US
                          value={field.value}
                          onChange={(value, country) => {
                            // Update country selection if changed
                            if (country?.countryCode) {
                              setSelectedCountry(country.countryCode);
                            }
                            
                            // Normalize the phone number for validation
                            let phoneValue = value;
                            if (!phoneValue.startsWith('+') && country?.dialCode) {
                              phoneValue = `+${country.dialCode}${value.replace(/^[0-9]+/, '')}`;
                            }
                            
                            // Create proper E.164 format for checking
                            const formatted = parsePhoneNumberFromString(phoneValue);
                            
                            // Get expected length for current country
                            let expectedLength = null;
                            try {
                              const example = getExampleNumber(
                                (country?.countryCode || 'US').toUpperCase()
                              );
                              if (example?.nationalNumber) {
                                expectedLength = String(example.nationalNumber).length;
                              }
                            } catch (e) {
                              // Fallback for countries without example
                              expectedLength = null;
                            }
                            
                            // If valid and complete, update the field
                            if (formatted && formatted.isValid()) {
                              field.onChange(value);
                              form.clearErrors("phone");
                            } 
                            // If too long, truncate
                            else if (expectedLength && formatted?.nationalNumber && 
                                    String(formatted.nationalNumber).length > expectedLength) {
                              // Let the phone input component handle formatting, just inform user
                              form.setError("phone", {
                                type: "manual",
                                message: `Phone number too long. Expected ${expectedLength} digits.`
                              });
                              
                              // We still accept the input but show warning
                              field.onChange(value);
                            }
                            // Otherwise just update normally and let validation run on blur
                            else {
                              field.onChange(value);
                            }
                          }}
                          onBlur={() => {
                            // On blur, do full validation
                            if (field.value) {
                              ensurePhoneLength(field.value, { countryCode: selectedCountry });
                            }
                          }}
                          inputProps={{
                            name: "phone",
                            required: false,
                            autoFocus: false,
                            placeholder: "(555) 555-5555"
                          }}
                          inputClass="placeholder-gray-400"
                          inputStyle={{ width: "100%" }}
                          onFocus={() => handleFocus("phone")}
                          specialLabel={""}
                          enableSearch={true}
                          disableSearchIcon={true}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_hash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="At least 8 characters"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            onFocus={() => handleFocus("password_hash")}
                            className="bg-gray-50 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm text-gray-600">
                        I agree to the ScholarPASS{" "}
                        <Link
                          href="/terms-of-use"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Terms of Service
                        </Link>{" "}
                        &{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? "Registering..." : "Create Account"}
                </Button>

                <div className="flex justify-between text-sm">
                  <Link
                    href="/login"
                    variant="link"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Already have an account? Login
                  </Link>
                </div>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
