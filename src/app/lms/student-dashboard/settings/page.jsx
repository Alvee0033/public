"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fileUpload } from "@/lib/fileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  AlertTriangle,
  Shield,
  Upload,
  User,
  X,
  Tags,
  Trash2,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import * as z from "zod";
import TagForm from "@/components/TagForm";
import { useAppSelector } from "@/redux/hooks";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  first_name: z
    .string()
    .min(1, { message: "First name is required." })
    .max(50, { message: "First name must not be longer than 50 characters." }),
  last_name: z
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, { message: "Last name must not be longer than 50 characters." }),
  email: z
    .string()
    .min(1, { message: "This field is required." })
    .email("This is not a valid email."),
  phone_number: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: "Please enter a valid phone number.",
    }),
  profile_picture: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      if (typeof file === "string") return true;
      return file.size <= 2 * 1024 * 1024; // 2MB
    }, "File size must be less than 2MB")
    .refine((file) => {
      if (!file) return true;
      if (typeof file === "string") return true;
      // Only allow png, jpg, jpeg
      return ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    }, "Only PNG, JPG, and JPEG files are allowed"),
  two_factor_enabled: z.boolean().optional(),
  whatsapp_subscribed: z.boolean().optional(),
  email_subscribed: z.boolean().optional(),
  sms_subscribed: z.boolean().optional(),
  master_country: z.number().nullable().optional(),
});

const defaultValues = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  profile_picture: null,
  two_factor_enabled: false,
  whatsapp_subscribed: false,
  email_subscribed: false,
  sms_subscribed: false,
  master_country: null,
};

const unwrap = (res) => res?.data?.data ?? res?.data;

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

function dateInputValue(raw) {
  if (raw == null || raw === "") return "";
  const s = (typeof raw === "string" ? raw : String(raw)).trim();
  const head = s.length >= 10 ? s.slice(0, 10) : s;
  return optionalCalendarYyyyMmDd(head) ?? "";
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

export default function SettingsPage() {
  // Get user data from Redux state instead of API call
  const reduxUser = useAppSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [imageError, setImageError] = useState("");
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef(null);
  const [matchingLoading, setMatchingLoading] = useState(true);
  const [matchingSaving, setMatchingSaving] = useState(false);
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
  const [budgetCurrencyCode, setBudgetCurrencyCode] = useState("");
  const [needsScholarship, setNeedsScholarship] = useState(false);
  const [preferredSubjectAreasText, setPreferredSubjectAreasText] =
    useState("");
  const [preferredInstituteTypesText, setPreferredInstituteTypesText] =
    useState("");

  // Lightweight AsyncSelect component (searchable, async-like)
  function AsyncSelect({
    value,
    onChange,
    loadOptions,
    placeholder,
    disabled,
  }) {
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      // show selected label if value set
      let mounted = true;
      async function fetchSelected() {
        if (value == null) {
          if (mounted) setInputValue("");
          return;
        }
        try {
          const items = await loadOptions("");
          const sel = items.find((i) => i.id === value || i.value === value);
          if (mounted) setInputValue(sel ? sel.name || sel.label || "" : "");
        } catch (e) {}
      }
      fetchSelected();
      return () => {
        mounted = false;
      };
    }, [value, loadOptions]);

    useEffect(() => {
      function onDocClick(e) {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      }
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }, []);

    async function handleInputChange(v) {
      setInputValue(v);
      try {
        const opts = await loadOptions(v);
        setOptions(opts || []);
        setOpen(true);
      } catch (e) {
        setOptions([]);
      }
    }

    function handleSelectOpt(opt) {
      setInputValue(opt.name || opt.label || "");
      setOpen(false);
      if (onChange) onChange(opt.id ?? opt.value ?? null);
    }

    return (
      <div className="relative" ref={ref}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => handleInputChange(inputValue)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full p-2 border rounded-md"
        />
        {open && options && options.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow-lg">
            {options.map((o) => (
              <div
                key={o.id ?? o.value}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                onClick={() => handleSelectOpt(o)}
              >
                {o.name ?? o.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    // Use Redux user data instead of API call
    if (reduxUser) {
      setUserData(reduxUser);
      setIsLoading(false);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [reduxUser]);

  useEffect(() => {
    async function loadMatchingProfile() {
      setMatchingLoading(true);
      try {
        const meRes = await axios.get("/student-matching-profile/me");
        const me = unwrap(meRes);
        const p = me?.profile;
        if (p) {
          setGender(p.gender ?? "");
          setGpa(p.gpa != null ? String(p.gpa) : "");
          setIncomeBracket(p.income_bracket ?? "");
          setPreferredCourseLevel(p.preferred_course_level ?? "");
          setPreferredDeliveryMode(p.preferred_delivery_mode ?? "");
          setPreferredCountryId(
            p.preferred_country_id != null ? String(p.preferred_country_id) : ""
          );
          setPreferredStateId(
            p.preferred_state_id != null ? String(p.preferred_state_id) : ""
          );
          setDesiredStartDate(dateInputValue(p.desired_start_date));
          setMinBudget(p.min_budget != null ? String(p.min_budget) : "");
          setMaxBudget(p.max_budget != null ? String(p.max_budget) : "");
          setBudgetCurrencyCode(p.budget_currency_code ?? "");
          setNeedsScholarship(Boolean(p.needs_scholarship));
          setPreferredSubjectAreasText(p.preferred_subject_areas_text ?? "");
          setPreferredInstituteTypesText(p.preferred_institute_types_text ?? "");
        }
      } catch (e) {
        // Matching profile is optional and may not exist yet.
      } finally {
        setMatchingLoading(false);
      }
    }
    loadMatchingProfile();
  }, []);

  useEffect(() => {
    // fetch and cache master countries
    async function fetchCountries() {
      try {
        const cacheKey = "master_countries_cache_v1";
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const now = Date.now();
            // TTL 24 hours
            if (
              parsed.timestamp &&
              now - parsed.timestamp < 24 * 60 * 60 * 1000 &&
              Array.isArray(parsed.data)
            ) {
              setCountries(parsed.data);
              return;
            }
          } catch (err) {
            // ignore parse errors and refetch
          }
        }
        setCountriesLoading(true);
        const res = await axios.get("/master-countries");
        if (res.data?.status === "SUCCESS" && Array.isArray(res.data.data)) {
          setCountries(res.data.data);
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ timestamp: Date.now(), data: res.data.data })
            );
          } catch (e) {}
        }
      } catch (e) {
        // leave countries empty on error
      } finally {
        setCountriesLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userData
      ? {
          username: userData.username || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          profile_picture: userData.profile_picture_url || null,
          two_factor_enabled: !!userData.two_factor_enabled,
          whatsapp_subscribed: !!userData.whatsapp_subscribed,
          email_subscribed: !!userData.email_subscribed,
          sms_subscribed: !!userData.sms_subscribed,
          master_country: userData.master_country_id ?? null,
        }
      : defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        profile_picture: userData.profile_picture_url || null,
        two_factor_enabled: !!userData.two_factor_enabled,
        whatsapp_subscribed: !!userData.whatsapp_subscribed,
        email_subscribed: !!userData.email_subscribed,
        sms_subscribed: !!userData.sms_subscribed,
        master_country: userData.master_country_id ?? null,
      });
    }
  }, [userData, form]);

  const ImagePreview = ({ src, onRemove }) => {
    if (!src) return null;
    return (
      <div className="relative inline-block">
        <img
          src={typeof src === "string" ? src : URL.createObjectURL(src)}
          alt="Profile"
          className="h-24 w-24 rounded-lg object-cover transition-all duration-300 ease-in-out"
        />
        <button
          type="button"
          onClick={() => {
            onRemove();
            const localUser = localStorage.getItem("user");
            if (localUser) {
              try {
                const parsedUser = JSON.parse(localUser);
                const updatedUser = {
                  ...parsedUser,
                  profile_picture_url: null,
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));
              } catch (e) {
                console.error("Error updating user in localStorage:", e);
              }
            }
          }}
          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-200 ease-in-out"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  async function onSubmit(data) {
    if (!userData?.id) return;
    setIsSubmitting(true);
    setHasSubmitError(false);
    setIsSuccess(false);
    try {
      let profilePictureUrl = data.profile_picture;
      if (data.profile_picture && typeof data.profile_picture === "object") {
        try {
          profilePictureUrl = await fileUpload(data.profile_picture);
        } catch (uploadError) {
          setHasSubmitError(true);
          setIsSubmitting(false);
          toast.error("Failed to update profile.");
          return;
        }
      }
      const payload = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number || "",
        profile_picture_url: profilePictureUrl,
        active_or_archive: userData.active_or_archive || true,
        email_confirmed: userData.email_confirmed || true,
        account_lock: userData.account_lock || false,
        phone_number_confirmed: userData.phone_number_confirmed || false,
        two_factor_enabled:
          typeof data.two_factor_enabled === "boolean"
            ? data.two_factor_enabled
            : userData.two_factor_enabled || false,
        lockout_enabled: userData.lockout_enabled || false,
        access_failed_count:
          typeof userData.access_failed_count === "number"
            ? userData.access_failed_count
            : 0,
        security_stamp: userData.security_stamp || "",
        whatsapp_subscribed:
          typeof data.whatsapp_subscribed === "boolean"
            ? data.whatsapp_subscribed
            : userData.whatsapp_subscribed || false,
        email_subscribed:
          typeof data.email_subscribed === "boolean"
            ? data.email_subscribed
            : userData.email_subscribed || false,
        sms_subscribed:
          typeof data.sms_subscribed === "boolean"
            ? data.sms_subscribed
            : userData.sms_subscribed || false,
        master_country:
          data.master_country ?? userData.master_country_id ?? null,
        zone: userData.zone_id || null,
        student: userData.student_id || null,
        tutor: userData.tutor_id || null,
        institute: userData.institute_id || null,
        employee: userData.employee_id || null,
        primary_role:
          userData.primary_role_id ||
          (userData.primary_role && userData.primary_role.id) ||
          null,
        roles: userData.app_user_roles
          ? userData.app_user_roles.map((role) => role.role.name)
          : ["Student"],
      };
      const response = await axios.patch(`/app-users/${userData.id}`, payload);
      if (response.data?.status === "SUCCESS") {
        setIsSuccess(true);
        // No need to refresh from server since user data comes from Redux/localStorage
        setUserData({ ...userData, ...payload });
        const localUser = localStorage.getItem("user");
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            const updatedUser = {
              ...parsedUser,
              profile_picture_url: profilePictureUrl,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              phone_number: data.phone_number,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          } catch (e) {
            console.error("Error updating user in localStorage:", e);
          }
        }
        form.setValue("profile_picture", profilePictureUrl);
        toast.success("Profile updated successfully.");
      } else {
        setHasSubmitError(true);
        toast.error("Failed to update profile.");
      }
    } catch (e) {
      setHasSubmitError(true);
      toast.error("Failed to update profile.");
    }
    setIsSubmitting(false);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError("New password and confirmation do not match.");
      return;
    }
    if (!userData?.id) {
      setChangePasswordError("User not loaded.");
      return;
    }
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setChangePasswordError("No authentication token found.");
      return;
    }
    setIsChangingPassword(true);
    try {
      const payload = {
        user_id: userData.id,
        old_password: currentPassword,
        new_password: newPassword,
      };
      const response = await axios.post("/app-users/reset-password", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true,
      });
      if (response.status === 201) {
        setChangePasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (response.data && response.data.message) {
        setChangePasswordError(response.data.message);
      } else {
        setChangePasswordError(
          "Current password is incorrect or failed to change password."
        );
      }
    } catch (err) {
      setChangePasswordError("Failed to change password.");
    }
    setIsChangingPassword(false);
  }

  async function handleSaveMatchingProfile() {
    setMatchingSaving(true);
    try {
      const body = {
        gender: gender.trim() || undefined,
        gpa: optionalFiniteNumber(gpa),
        income_bracket: incomeBracket.trim() || undefined,
        preferred_course_level: preferredCourseLevel.trim() || undefined,
        preferred_delivery_mode: preferredDeliveryMode.trim() || undefined,
        preferred_country_id: optionalIntString(preferredCountryId),
        preferred_state_id: optionalIntString(preferredStateId),
        desired_start_date: optionalCalendarYyyyMmDd(desiredStartDate),
        min_budget: optionalFiniteNumber(minBudget),
        max_budget: optionalFiniteNumber(maxBudget),
        budget_currency_code: (() => {
          const s = budgetCurrencyCode.trim().toUpperCase();
          if (!s) return undefined;
          return s.slice(0, 3);
        })(),
        needs_scholarship: needsScholarship,
        preferred_subject_areas_text: preferredSubjectAreasText,
        preferred_institute_types_text: preferredInstituteTypesText,
      };
      await axios.patch("/student-matching-profile/me", body);
      toast.success("Scholarship matching profile saved.");
    } catch (e) {
      toast.error("Failed to save scholarship matching profile.");
    } finally {
      setMatchingSaving(false);
    }
  }

  async function handleSaveTag(tagData) {
    if (!userData?.student_id) {
      toast.error("Student ID not found. Please refresh the page.");
      throw new Error("Student ID not found");
    }

    setIsSubmittingTag(true);
    try {
      const payload = {
        tag: tagData.tag,
        notes: tagData.notes || "",
        tag_value: tagData.tag_value,
        display_sequence: tagData.display_sequence || 0,
        student: userData.student_id,
        student_id: userData.student_id,
        rated_by_employee: 0, // Default value, can be updated based on requirements
        rated_by_employee_id: 0, // Default value
        master_tag_category: tagData.master_tag_category_id || 0,
        master_tag_category_id: tagData.master_tag_category_id || 0,
        master_tag: tagData.master_tag_id || 0,
        master_tag_id: tagData.master_tag_id || 0,
        default_tag: tagData.default_tag,
      };

      const response = await axios.post("/student-tags", payload);

      if (response.data?.status === "SUCCESS" || response.status === 201) {
        toast.success("Tag saved successfully!");
        return Promise.resolve();
      } else {
        toast.error("Failed to save tag.");
        throw new Error("Failed to save tag");
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      toast.error("Failed to save tag. Please try again.");
      throw error;
    } finally {
      setIsSubmittingTag(false);
    }
  }

  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    
    if (!userData?.id) {
      setDeleteError("User ID not found.");
      return;
    }
    
    setIsDeleting(true);
    setDeleteError("");
    setDeleteSuccess("");
    
    try {
      const response = await axios.delete(`/app-users/${userData.id}`);
      
      if (response.status === 200 || response.status === 204) {
        setDeleteSuccess("Account deleted successfully. You will be redirected shortly.");
        toast.success("Account deleted successfully.");
        
        // Clear local storage and redirect after a short delay
        setTimeout(() => {
          localStorage.removeItem('auth-token');
          localStorage.removeItem('user');
          window.location.href = '/'; // Redirect to home or login page
        }, 2000);
      } else {
        setDeleteError("Failed to delete account. Please try again.");
        toast.error("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError("Failed to delete account. Please try again.");
      toast.error("Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (hasError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center">
        <AlertTriangle
          className="w-10 h-10 text-red-400 mb-2"
          aria-hidden="true"
        />
        <div className="text-base text-gray-700 font-medium">
          Failed to load user data
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Please refresh the page or try again later.
        </div>
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">
          Profile Settings
        </h1>
      </div>
      <div className="grid gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-purple-600">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <ImagePreview
                src={form.watch("profile_picture")}
                onRemove={() => {
                  form.setValue("profile_picture", null, {
                    shouldValidate: true,
                  });
                  setImageError("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
              {!form.watch("profile_picture") && (
                <>
                  <Input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          setImageError("Image must not be more than 2mb");
                          e.target.value = "";
                          return;
                        }
                        setImageError("");
                        form.setValue("profile_picture", file, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    className="hidden"
                    id="profile_picture"
                  />
                  <label
                    htmlFor="profile_picture"
                    className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 ease-in-out"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-6 w-6 text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">
                        Upload
                      </span>
                    </div>
                  </label>
                </>
              )}
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            {...field}
                            disabled={true}
                          />
                        </FormControl>
                        <FormDescription>
                          Your email address will not be shared publicly.
                        </FormDescription>
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
                          <PhoneInput
                            country={"us"} // default country
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            inputProps={{
                              name: "phone",
                              required: true,
                              autoFocus: false,
                            }}
                            inputStyle={{ width: "100%" }}
                          />
                        </FormControl>
                        <FormDescription>
                          Your phone number for account verification.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="two_factor_enabled"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Two-factor Authentication</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm text-gray-600">
                              Enable two-factor authentication
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="master_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          {countriesLoading ? (
                            <Input disabled value="Loading countries..." />
                          ) : (
                            <AsyncSelect
                              value={field.value}
                              onChange={(val) => field.onChange(val)}
                              placeholder="Search country..."
                              loadOptions={async (q) => {
                                const query = (q || "").toLowerCase().trim();
                                if (!query)
                                  return countries.map((c) => ({
                                    id: c.id,
                                    name: c.name,
                                  }));
                                return countries
                                  .filter((c) =>
                                    c.name.toLowerCase().includes(query)
                                  )
                                  .map((c) => ({ id: c.id, name: c.name }));
                              }}
                              disabled={false}
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          Set your master country (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="whatsapp_subscribed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm text-gray-600">
                              Subscribed to WhatsApp
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email_subscribed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm text-gray-600">
                              Subscribed to Email
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sms_subscribed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SMS</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="mr-2 h-4 w-4"
                            />
                            <span className="text-sm text-gray-600">
                              Subscribed to SMS
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-purple-600">
              Scholarship matching profile
            </CardTitle>
            <CardDescription>
              Information used to match you with relevant scholarships and
              programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matchingLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading matching profile...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-sm font-semibold text-gray-700">
                    About you
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="matching-gender">Gender</Label>
                      <Input
                        id="matching-gender"
                        placeholder="e.g. female, male, non-binary"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-gpa">GPA (0-5)</Label>
                      <Input
                        id="matching-gpa"
                        type="number"
                        min={0}
                        max={5}
                        step="0.001"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-income">Income bracket</Label>
                      <Input
                        id="matching-income"
                        placeholder="e.g. under-40k, 40k-60k"
                        value={incomeBracket}
                        onChange={(e) => setIncomeBracket(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-level">
                        Preferred course level
                      </Label>
                      <Input
                        id="matching-level"
                        placeholder="e.g. undergraduate"
                        value={preferredCourseLevel}
                        onChange={(e) => setPreferredCourseLevel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-mode">
                        Preferred delivery mode
                      </Label>
                      <Input
                        id="matching-mode"
                        placeholder="e.g. online, in-person"
                        value={preferredDeliveryMode}
                        onChange={(e) => setPreferredDeliveryMode(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-country-id">
                        Preferred country ID
                      </Label>
                      <Input
                        id="matching-country-id"
                        type="number"
                        min={0}
                        value={preferredCountryId}
                        onChange={(e) => setPreferredCountryId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-state-id">
                        Preferred state ID
                      </Label>
                      <Input
                        id="matching-state-id"
                        type="number"
                        min={0}
                        value={preferredStateId}
                        onChange={(e) => setPreferredStateId(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-start-date">
                        Desired start date
                      </Label>
                      <Input
                        id="matching-start-date"
                        type="date"
                        value={desiredStartDate}
                        onChange={(e) => setDesiredStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-min-budget">Min budget</Label>
                      <Input
                        id="matching-min-budget"
                        type="number"
                        min={0}
                        step="0.01"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-max-budget">Max budget</Label>
                      <Input
                        id="matching-max-budget"
                        type="number"
                        min={0}
                        step="0.01"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matching-currency">
                        Budget currency (3 letters)
                      </Label>
                      <Input
                        id="matching-currency"
                        maxLength={3}
                        placeholder="USD"
                        value={budgetCurrencyCode}
                        onChange={(e) => setBudgetCurrencyCode(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-8 md:col-span-2">
                      <input
                        id="matching-needs-scholarship"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={needsScholarship}
                        onChange={(e) => setNeedsScholarship(e.target.checked)}
                      />
                      <Label htmlFor="matching-needs-scholarship">
                        I need scholarship support
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">
                    Preferred subject areas
                  </h3>
                  <Textarea
                    rows={4}
                    placeholder="Describe subjects or fields you care about..."
                    value={preferredSubjectAreasText}
                    onChange={(e) => setPreferredSubjectAreasText(e.target.value)}
                    className="min-h-[110px] resize-y"
                  />
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700">
                    Preferred institute types
                  </h3>
                  <Textarea
                    rows={4}
                    placeholder="Describe institute or program types you prefer..."
                    value={preferredInstituteTypesText}
                    onChange={(e) =>
                      setPreferredInstituteTypesText(e.target.value)
                    }
                    className="min-h-[110px] resize-y"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSaveMatchingProfile}
                  disabled={matchingSaving}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {matchingSaving ? "Saving..." : "Save Matching Profile"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tag Management Section */}
        {/* <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-purple-600">
              <Tags className="h-5 w-5" />
              Tag Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TagForm
              setFieldValue={() => {}}
              values={{}}
              errors={{}}
              touched={{}}
              onSave={handleSaveTag}
              isSubmitting={isSubmittingTag}
            />
          </CardContent>
        </Card> */}

        {/* Change Password Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-purple-600">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleChangePassword}>
              {changePasswordError && (
                <div className="text-red-500">{changePasswordError}</div>
              )}
              {changePasswordSuccess && (
                <div className="text-green-600">{changePasswordSuccess}</div>
              )}
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <Button
                className="mt-8 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg"
                type="submit"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Delete Account Section */}
        <Card className="shadow-lg border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium text-gray-800">
                  Delete Your Account
                </p>
                <p>
                  Once you delete your account, there is no going back. This action will permanently delete your account and remove all of your data from our servers.
                </p>
                <p>
                  If you're sure you want to proceed, click the button below. You will be asked for confirmation.
                </p>
              </div>
              
              {deleteError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                  {deleteError}
                </div>
              )}
              
              {deleteSuccess && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                  {deleteSuccess}
                </div>
              )}
              
              <Button 
                onClick={handleDeleteAccountClick}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="text-left">
              <strong>Warning:</strong> This action cannot be undone. Deleting your account will permanently remove:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Your profile information</li>
                <li>All your courses and learning progress</li>
                <li>Your enrolled courses and certificates</li>
                <li>All associated data and history</li>
              </ul>
              <p className="mt-3 font-medium">
                Are you absolutely sure you want to delete your account?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
