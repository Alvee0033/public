"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


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
import { AlertTriangle, Shield, Upload, User, X, Tags, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useAppSelector } from "@/redux/hooks";
import TutorTagForm from "@/components/TutorTagForm";
import TutorInformationForm from "./_components/TutorInformationForm";
import PasswordChangeForm from "./_components/PasswordChangeForm";
import TagManagementSection from "./_components/TagManagementSection";
import DefaultTagForm from "../tags/DefaultTagForm";

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
  const [imageError, setImageError] = useState("");
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);

  // Get user data from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);
  const [tutorData, setTutorData] = useState(null);
  // Social Media Section State
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    linked_in: '',
    twitter_x: '',
    instagram: ''
  });
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialError, setSocialError] = useState('');
  const [socialSuccess, setSocialSuccess] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Tutor extra fields state
  const [tutorFields, setTutorFields] = useState({
    name: '',
    job_title: '',
    company_name: '',
    full_address: '',
    address: '',
    zip_code: '',
    date_of_birth: '',
    tax_or_ssn: '',
    mobile: '',
    sms_subscribed: false,
    whatsapp_number: '',
    personal_email: '',
  business_email: '',
  years_of_experience: '',
  full_profile: '',
  verified_tutor: false,
  referred: false,
  referred_by_email: '',
  tutor_since_date: '',
  country: '',
  state: '',
  });

  const [showTagForm, setShowTagForm] = useState(false);

  // Populate social media and tutor fields from tutorData
  useEffect(() => {
    if (tutorData) {
      setSocialMedia({
        facebook: tutorData.facebook || '',
        linked_in: tutorData.linked_in || '',
        twitter_x: tutorData.twitter_x || '',
        instagram: tutorData.instagram || ''
      });
      setTutorFields({
        name: tutorData.name || '',
        job_title: tutorData.job_title || '',
        company_name: tutorData.company_name || '',
        full_address: tutorData.full_address || '',
        address: tutorData.address || '',
        zip_code: tutorData.zip_code || '',
        date_of_birth: tutorData.date_of_birth ? tutorData.date_of_birth.slice(0, 10) : '',
        tax_or_ssn: tutorData.tax_or_ssn || '',
        mobile: tutorData.mobile || '',
        sms_subscribed: !!tutorData.sms_subscribed,
        whatsapp_number: tutorData.whatsapp_number || '',
        personal_email: tutorData.personal_email || '',
  business_email: tutorData.business_email || '',
  years_of_experience: tutorData.years_of_experience || '',
  full_profile: tutorData.full_profile || '',
  verified_tutor: !!tutorData.verified_tutor,
  referred: !!tutorData.referred,
  referred_by_email: tutorData.referred_by_email || '',
  tutor_since_date: tutorData.tutor_since_date ? tutorData.tutor_since_date.slice(0, 10) : '',
  country: tutorData.country?.id || tutorData.country || '',
  state: tutorData.state?.id || tutorData.state || '',
      });
    }
  }, [tutorData]);

  // Handle input changes
  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialError('');
    setSocialSuccess('');
  };

  // Handle tutor fields input changes
  const handleTutorFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTutorFields((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle submit
  const handleSocialMediaSubmit = async (e) => {
    e.preventDefault();
    setSocialLoading(true);
    setSocialError('');
    setSocialSuccess('');
    try {
      // Merge tutorFields and socialMedia for PATCH
      const {
        personal_email_verified,
        personal_email_subscribed,
        business_email_verified,
        business_email_subscribed,
        summary,
        admin_remarks,
        ...filteredTutorFields
      } = tutorFields;
      const patchBody = {
        ...filteredTutorFields,
        facebook: socialMedia.facebook,
        linked_in: socialMedia.linked_in,
        twitter_x: socialMedia.twitter_x,
        instagram: socialMedia.instagram
      };
      // Remove read-only fields
      delete patchBody.verified_tutor;
      // Remove empty string fields so user can keep blank
      Object.keys(patchBody).forEach(key => {
        if (patchBody[key] === '') patchBody[key] = undefined;
      });
      const response = await axios.patch(`/tutors/${userData.tutor_id}`, patchBody);
      if (response.data?.status === "SUCCESS") {
        setTutorData((prev) => ({ ...prev, ...patchBody }));
        setSocialSuccess('Tutor information updated successfully!');
      } else {
        setSocialError('Failed to update tutor information.');
      }
    } catch (error) {
      setSocialError('Failed to update tutor information.');
    }
    setSocialLoading(false);
  };

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      setHasError(false);
      try {
        // Get user data from Redux state
        if (user) {
          const userDataWithLocalStorage = user;
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
          if (userDataWithLocalStorage.tutor_id) {
            try {
              const tutorRes = await axios.get(`/tutors/${userDataWithLocalStorage.tutor_id}`);
              if (tutorRes.data?.status === "SUCCESS" && tutorRes.data?.data) {
                setTutorData(tutorRes.data.data);
              }
            } catch (tutorError) {
              console.error('Error fetching tutor data:', tutorError);
            }
          }
        } else {
          setHasError(true);
        }
      } catch (e) {
        setHasError(true);
      }
      setIsLoading(false);
    }
    
    if (user) {
      getUser();
    } else {
      setIsLoading(false);
    }
  }, [user]);

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

  useEffect(() => {
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
        two_factor_enabled: userData.two_factor_enabled || false,
        lockout_enabled: userData.lockout_enabled || false,
        access_failed_count: typeof userData.access_failed_count === "number"
          ? userData.access_failed_count
          : 0,
        security_stamp: userData.security_stamp || "",
        whatsapp_subscribed: userData.whatsapp_subscribed || false,
        email_subscribed: userData.email_subscribed || false,
        sms_subscribed: userData.sms_subscribed || false,
        master_country: userData.master_country_id || null,
        zone: userData.zone_id || null,
        student: userData.student_id || null,
        tutor: userData.tutor_id || null,
        institute: userData.institute_id || null,
        employee: userData.employee_id || null,
        primary_role: userData.primary_role_id || (userData.primary_role && userData.primary_role.id) || null,
        roles: userData.app_user_roles ? userData.app_user_roles.map(role => role.role.name) : ["Student"]
      };
      const response = await axios.patch(`/app-users/${userData.id}`, payload);
      if (response.data?.status === "SUCCESS") {
        setIsSuccess(true);
        setUserData({ ...userData, ...payload });
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try {
            const parsedUser = JSON.parse(localUser);
            const updatedUser = {
              ...parsedUser,
              profile_picture_url: profilePictureUrl,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              phone_number: data.phone_number
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (e) {
            console.error('Error updating user in localStorage:', e);
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
      const response = await axios.post('/app-users/reset-password', payload, {
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
        setChangePasswordError("Current password is incorrect or failed to change password.");
      }
    } catch (err) {
      setChangePasswordError("Failed to change password.");
    }
    setIsChangingPassword(false);
  }

  async function handleSaveTag(tagData) {
    if (!userData?.tutor_id) {
      toast.error("Tutor ID not found. Please refresh the page.");
      throw new Error("Tutor ID not found");
    }

    setIsSubmittingTag(true);
    try {
      const payload = {
        tag: tagData.tag,
        tag_value: tagData.tag_value,
        years_of_experience: tagData.years_of_experience || "",
        display_sequence: tagData.display_sequence || 0,
        rating_score: tagData.rating_score || 0,
        tutor: userData.tutor_id,
        tutor_id: userData.tutor_id,
        verified_by_employee: 0, // Default value, can be updated based on requirements
        verified_by_employee_id: 0, // Default value
        master_tag_category: tagData.master_tag_category_id || 0,
        master_tag_category_id: tagData.master_tag_category_id || 0,
        master_tag: tagData.master_tag_id || 0,
        master_tag_id: tagData.master_tag_id || 0,
        default_tag: tagData.default_tag
      };

      const response = await axios.post('/tutor-tags', payload);
      
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
        <AlertTriangle className="w-10 h-10 text-red-400 mb-2" aria-hidden="true" />
        <div className="text-base text-gray-700 font-medium">Failed to load user data</div>
        <div className="text-xs text-gray-400 mt-1">Please refresh the page or try again later.</div>
      </div>
    );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">Profile Settings</h1>
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
                  form.setValue("profile_picture", null, { shouldValidate: true });
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
                        form.setValue("profile_picture", file, { shouldValidate: true });
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
              <div className="ml-2 text-xs text-gray-500 max-w-[180px]">
                {/* Only PNG, JPG, and JPEG files are allowed.
                <br />
                Max file size: 2MB. */}
                {imageError && <div className="text-red-500">{imageError}</div>}
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <FormDescription>This is your public display name.</FormDescription>
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
                          <Input placeholder="john@example.com" {...field} disabled={true} />
                        </FormControl>
                        <FormDescription>Your email address will not be shared publicly.</FormDescription>
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

                <Button type="submit" disabled={isSubmitting} className="py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <TutorInformationForm
          tutorFields={tutorFields}
          socialMedia={socialMedia}
          handleTutorFieldChange={handleTutorFieldChange}
          handleSocialMediaChange={handleSocialMediaChange}
          handleSubmit={handleSocialMediaSubmit}
          loading={socialLoading}
          error={socialError}
          success={socialSuccess}
          tutorData={tutorData}
        />

        {/* Tag Management Section */}
        {/* <TagManagementSection 
          handleSaveTag={handleSaveTag}
          isSubmittingTag={isSubmittingTag}
        /> */}

        {/* Change Password Section */}
        <PasswordChangeForm
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setCurrentPassword={setCurrentPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          handleChangePassword={handleChangePassword}
          isChangingPassword={isChangingPassword}
          changePasswordError={changePasswordError}
          changePasswordSuccess={changePasswordSuccess}
        />
        <div>
          <button
            className="py-2 px-4 bg-purple-500 text-white rounded"
            onClick={() => setShowTagForm((prev) => !prev)}
          >
            {showTagForm ? "Hide Tags" : "Show Tags"}
          </button>
          {showTagForm && <DefaultTagForm className="max-h-36" />}
        </div>

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
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Warning:</strong> Deleting your account is permanent and cannot be undone. 
                  All your data, including profile information, courses, and history, will be permanently removed.
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
                <li>Your tutor information and tags</li>
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
