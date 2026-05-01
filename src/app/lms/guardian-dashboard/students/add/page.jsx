"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axios from "@/lib/axios";
import {
  AlertCircle,
  ArrowLeft,
  AtSign,
  CheckCircle,
  Lock,
  Mail,
  Phone,
  Shield,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password_hash: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    active_or_archive: true,
    email_confirmed: true,
    account_lock: false,
    phone_number_confirmed: false,
    two_factor_enabled: false,
    lockout_enabled: false,
    access_failed_count: 0,
    lockout_end: null,
    security_stamp: null,
    profile_picture: null,
    profile_picture_url: null,
    profile_picture_thumbnail_url: null,
    whatsapp_subscribed: false,
    email_subscribed: false,
    sms_subscribed: false,
    master_country: null,
    zone: null,
    student: null,
    tutor: null,
    institute: null,
    employee: null,
    roles: [4],
    primary_role: 4,
    access_level: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submissionData = {
        ...formData,
        master_country: formData.master_country || null,
        zone: formData.zone || null,
        student: formData.student || null,
        tutor: formData.tutor || null,
        institute: formData.institute || null,
        employee: formData.employee || null,
      };

      const response = await axios.post("/app-users/add-user", submissionData);

      if (response.data) {
        setSubmitted(true);
        setError("");
      }
    } catch (err) {
      console.error("Error details:", {
        message: err.response?.data?.message,
        data: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message ||
          "An error occurred while adding the student"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddAnother = () => {
    setSubmitted(false);
    setFormData({
      username: "",
      password_hash: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      active_or_archive: true,
      email_confirmed: true,
      account_lock: false,
      phone_number_confirmed: false,
      two_factor_enabled: false,
      lockout_enabled: false,
      access_failed_count: 0,
      lockout_end: null,
      security_stamp: null,
      profile_picture: null,
      profile_picture_url: null,
      profile_picture_thumbnail_url: null,
      whatsapp_subscribed: false,
      email_subscribed: false,
      sms_subscribed: false,
      master_country: null,
      zone: null,
      student: null,
      tutor: null,
      institute: null,
      employee: null,
      roles: [4],
      primary_role: 4,
      access_level: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 space-y-8">
      {/* <div className="max-w-4xl mx-auto space-y-8"> */}
      <div className="space-y-4">
        <Button
          onClick={handleBack}
          variant="outline"
          className="mb-4 bg-white/80 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <div className="flex justify-start gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Student
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2x1">
          Create a new student account with secure credentials and contact
          information
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Success State */}
      {submitted ? (
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Student Added Successfully!
                </h2>
                <p className="text-gray-600">
                  The new student account has been created and is ready to use.
                </p>
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Details
                  </h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-white">
                        Name
                      </Badge>
                      <span className="font-medium">
                        {formData.first_name} {formData.last_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-white">
                        Email
                      </Badge>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-white">
                        Username
                      </Badge>
                      <span className="font-medium">{formData.username}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-white">
                        Phone
                      </Badge>
                      <span className="font-medium">
                        {formData.phone_number}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleAddAnother}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Another Student
                </Button>
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Students
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Form State */
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <UserPlus className="h-6 w-6" />
              Student Information
            </CardTitle>
            <CardDescription className="text-blue-100">
              Fill in the required information to create a new student account
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Credentials
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Username <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Choose a unique username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password_hash"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        id="password_hash"
                        name="password_hash"
                        value={formData.password_hash}
                        onChange={handleChange}
                        className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Create a secure password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="student@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phone_number"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="h-12 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Student
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {/* </div> */}
    </div>
  );
}
