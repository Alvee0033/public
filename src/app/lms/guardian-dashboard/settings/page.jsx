"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { fileUpload } from "@/lib/fileUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Shield, Upload, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from "sonner";
import * as z from "zod";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
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
      return file.size <= 5000000; // 5MB
    }, "File size must be less than 5MB")
    .refine((file) => {
      if (!file) return true;
      if (typeof file === "string") return true;
      return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
    }, "Only JPEG, PNG, and GIF files are allowed"),
});

const defaultValues = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  profile_picture: null,
};

export default function SettingsPage() {
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

  useEffect(function () {
    async function fetchUser() {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await axios.post("/auth/me");
        if (res.data?.status === "SUCCESS" && res.data?.data) {
          const userDataWithLocalStorage = res.data.data;
          // Check if there's a user object in local storage with profile picture URL
          const localUser = localStorage.getItem('user');
          if (localUser) {
            try {
              const parsedUser = JSON.parse(localUser);
              if (parsedUser.profile_picture_url) {
                userDataWithLocalStorage.profile_picture_url = parsedUser.profile_picture_url;
              }
            } catch (e) {
              console.error('Error parsing user from localStorage:', e);
            }
          }
          setUserData(userDataWithLocalStorage);
        } else setHasError(true);
      } catch (e) {
        setHasError(true);
      }
      setIsLoading(false);
    }
    fetchUser();
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
      }
      : defaultValues,
    mode: "onChange",
  });

  useEffect(
    function () {
      if (userData) {
        form.reset({
          username: userData.username || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          profile_picture: userData.profile_picture_url || null,
        });
      }
    },
    [userData, form]
  );

  // Image Preview Component
  const ImagePreview = ({ src, onRemove }) => {
    if (!src) return null;
    return (
      <div className="relative inline-block">
        <img
          src={typeof src === "string" ? src : URL.createObjectURL(src)}
          alt="Profile"
          className="h-24 w-24 rounded-lg object-cover"
        />
        <button
          type="button"
          onClick={() => {
            onRemove();
            // Remove profile picture URL from user object in local storage
            const localUser = localStorage.getItem('user');
            if (localUser) {
              try {
                const parsedUser = JSON.parse(localUser);
                const updatedUser = {
                  ...parsedUser,
                  profile_picture_url: null
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
              } catch (e) {
                console.error('Error updating user in localStorage:', e);
              }
            }
          }}
          className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
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
    // Check if user is logged in
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setHasSubmitError(true);
      setIsSubmitting(false);
      console.error('No authentication token found');
      return;
    }
    try {
      let profilePictureUrl = data.profile_picture;
      // If profile_picture is a File object, upload it first
      if (data.profile_picture && typeof data.profile_picture === "object") {
        try {
          profilePictureUrl = await fileUpload(data.profile_picture);
        } catch (uploadError) {
          setHasSubmitError(true);
          setIsSubmitting(false);
          return;
        }
      }
      const payload = {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        profile_picture_url: profilePictureUrl,
      };
      const response = await axios.patch(`/app-users/${userData.id}`, payload);
      if (response.data?.status === "SUCCESS") {
        setIsSuccess(true);
        setUserData({ ...userData, ...payload });
        // Update user object in local storage with profile picture URL
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            const updatedUser = {
              ...parsedUser,
              profile_picture_url: profilePictureUrl
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (e) {
            console.error('Error updating user in localStorage:', e);
          }
        }
        // Reset the form with the new profile picture URL
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
    const token = localStorage.getItem('auth-token');
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
      const response = await axios.post(
        '/app-users/reset-password',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true,
        }
      );
      if (response.status === 201) {
        setChangePasswordSuccess("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (response.data && response.data.message) {
        setChangePasswordError(response.data.message);
      } else {
        setChangePasswordError("Current password is incorrect or failed to change password.");
      }
    } catch (err) {
      setChangePasswordError("Failed to change password.");
    }
    setIsChangingPassword(false);
  }

  if (isLoading)
    return <div className="p-8">Loading...</div>;
  if (hasError)
    return <div className="p-8 text-red-500">Failed to load user data.</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">Profile Settings</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <User className="h-5 w-5 text-blue-700" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <ImagePreview
                  src={form.watch("profile_picture")}
                  onRemove={() => form.setValue("profile_picture", null)}
                />
                {!form.watch("profile_picture") && (
                  <>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          form.setValue("profile_picture", file);
                        }
                      }}
                      className="hidden"
                      id="profile_picture"
                    />
                    <label
                      htmlFor="profile_picture"
                      className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
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
                          <Input placeholder="john@example.com"
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
                            country={'us'} // default country
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              autoFocus: false,
                            }}
                            inputStyle={{ width: '100%' }}
                          />
                        </FormControl>
                        <FormDescription>Your phone number for account verification.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="hover:scale-105 text-white rounded-xl px-3 py-3 text-lg border-none sm:py-5"
                  style={{
                    background:
                      'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                  }}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Shield className="h-5 w-5 text-blue-700" />
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
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 border rounded"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
              <Button className="hover:scale-105 text-white rounded-xl px-3 py-3 text-lg border-none sm:py-5"
                style={{
                  background:
                    'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                }} type="submit" disabled={isChangingPassword} >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
