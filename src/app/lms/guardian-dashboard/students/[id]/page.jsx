'use client';

import { use } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import {
  ArrowLeft,
  AtSign,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Globe,
  GraduationCap,
  Hash,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  Smartphone,
  Trash2,
  User,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentDetailsPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const handleBack = () => {
    router.back();
  };

  const fetchStudentDetails = async () => {
    try {
      const response = await axios.get(`/students/${id}`);
      setStudent(response.data.data);
      setEditFormData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Normalization helper for student data
  function normalizeStudentData(data) {
    return {
      ...data,
      institute:
        typeof data.institute === 'object'
          ? data.institute?.name || ''
          : data.institute,
      master_k12_grade:
        typeof data.master_k12_grade === 'object'
          ? data.master_k12_grade?.name || ''
          : data.master_k12_grade,
      primary_guardian_email:
        typeof data.primary_guardian_email === 'object'
          ? data.primary_guardian_email?.email ||
          data.primary_guardian_email?.name ||
          ''
          : data.primary_guardian_email,
      primary_guardian_phone:
        typeof data.primary_guardian_phone === 'object'
          ? data.primary_guardian_phone?.phone ||
          data.primary_guardian_phone?.number ||
          ''
          : data.primary_guardian_phone,
      assigned_employee:
        typeof data.assigned_employee === 'object'
          ? data.assigned_employee?.name || ''
          : data.assigned_employee,
      referred_by_email:
        typeof data.referred_by_email === 'object'
          ? data.referred_by_email?.email || data.referred_by_email?.name || ''
          : data.referred_by_email,
    };
  }

  const handleEdit = async () => {
    setEditLoading(true);
    try {
      const response = await axios.patch(`/students/${id}`, editFormData);
      const normalized = normalizeStudentData(response.data);
      setStudent(normalized);
      setEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Student details updated successfully',
      });
      setTimeout(() => {
        router.refresh && router.refresh();
      }, 500);
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error',
        description: 'Failed to update student details',
        variant: 'destructive',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/students/${id}`);
      toast({
        title: 'Success',
        description: 'Student deleted successfully',
      });
      router.push('/lms/guardian-dashboard/students');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-center text-sm sm:text-base">
              Loading student details...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
            <XCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-600 text-center mb-4 text-sm sm:text-base">
              Error: {error}
            </p>
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center justify-center p-6 sm:p-8">
            <User className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center mb-4 text-sm sm:text-base">
              No student data found
            </p>
            <Button onClick={handleBack} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="sm"
              className="shadow-sm bg-transparent w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Back to Students</span>
              <span className="xs:hidden">Back</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                Student Profile
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Comprehensive student information and details
              </p>
            </div>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 text-xs sm:text-sm"
                >
                  <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Edit Details</span>
                  <span className="xs:hidden">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] mx-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">
                    Edit Student Details
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Update the student information below. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] sm:max-h-[70vh] pr-2 sm:pr-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 py-4">
                    {/* Personal Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Personal Information
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="full_name"
                          value={editFormData.full_name || ''}
                          onChange={(e) =>
                            handleInputChange('full_name', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="first_name" className="text-sm">
                            First Name
                          </Label>
                          <Input
                            id="first_name"
                            value={editFormData.first_name || ''}
                            onChange={(e) =>
                              handleInputChange('first_name', e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name" className="text-sm">
                            Last Name
                          </Label>
                          <Input
                            id="last_name"
                            value={editFormData.last_name || ''}
                            onChange={(e) =>
                              handleInputChange('last_name', e.target.value)
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alias_name" className="text-sm">
                          Alias Name
                        </Label>
                        <Input
                          id="alias_name"
                          value={editFormData.alias_name || ''}
                          onChange={(e) =>
                            handleInputChange('alias_name', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth" className="text-sm">
                          Date of Birth
                        </Label>
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={editFormData.date_of_birth || ''}
                          onChange={(e) =>
                            handleInputChange('date_of_birth', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="email_address" className="text-sm">
                          Email Address
                        </Label>
                        <Input
                          id="email_address"
                          type="email"
                          value={editFormData.email_address || ''}
                          onChange={(e) =>
                            handleInputChange('email_address', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile_number" className="text-sm">
                          Mobile Number
                        </Label>
                        <Input
                          id="mobile_number"
                          value={editFormData.mobile_number || ''}
                          onChange={(e) =>
                            handleInputChange('mobile_number', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp_number" className="text-sm">
                          WhatsApp Number
                        </Label>
                        <Input
                          id="whatsapp_number"
                          value={editFormData.whatsapp_number || ''}
                          onChange={(e) =>
                            handleInputChange('whatsapp_number', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="sms_subscribed"
                            checked={editFormData.sms_subscribed || false}
                            onCheckedChange={(checked) =>
                              handleInputChange('sms_subscribed', checked)
                            }
                          />
                          <Label htmlFor="sms_subscribed" className="text-sm">
                            SMS Subscribed
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="email_subscribed"
                            checked={editFormData.email_subscribed || false}
                            onCheckedChange={(checked) =>
                              handleInputChange('email_subscribed', checked)
                            }
                          />
                          <Label htmlFor="email_subscribed" className="text-sm">
                            Email Subscribed
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Guardian Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Guardian Information
                      </h3>
                      <div className="space-y-2">
                        <Label
                          htmlFor="primary_guardian_name"
                          className="text-sm"
                        >
                          Guardian Name
                        </Label>
                        <Input
                          id="primary_guardian_name"
                          value={editFormData.primary_guardian_name || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'primary_guardian_name',
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="primary_guardian_email"
                          className="text-sm"
                        >
                          Guardian Email
                        </Label>
                        <Input
                          id="primary_guardian_email"
                          type="email"
                          value={editFormData.primary_guardian_email || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'primary_guardian_email',
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="primary_guardian_phone"
                          className="text-sm"
                        >
                          Guardian Phone
                        </Label>
                        <Input
                          id="primary_guardian_phone"
                          value={editFormData.primary_guardian_phone || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'primary_guardian_phone',
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="primary_guardian_relationship"
                          className="text-sm"
                        >
                          Relationship
                        </Label>
                        <Input
                          id="primary_guardian_relationship"
                          value={
                            editFormData.primary_guardian_relationship || ''
                          }
                          onChange={(e) =>
                            handleInputChange(
                              'primary_guardian_relationship',
                              e.target.value
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Address Information
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="full_address" className="text-sm">
                          Full Address
                        </Label>
                        <Textarea
                          id="full_address"
                          value={editFormData.full_address || ''}
                          onChange={(e) =>
                            handleInputChange('full_address', e.target.value)
                          }
                          className="text-sm min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code" className="text-sm">
                          Zip Code
                        </Label>
                        <Input
                          id="zip_code"
                          value={editFormData.zip_code || ''}
                          onChange={(e) =>
                            handleInputChange('zip_code', e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Administrative */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                      <h3 className="font-semibold text-base sm:text-lg">
                        Administrative
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="internal_remarks" className="text-sm">
                          Internal Remarks
                        </Label>
                        <Textarea
                          id="internal_remarks"
                          value={editFormData.internal_remarks || ''}
                          onChange={(e) =>
                            handleInputChange(
                              'internal_remarks',
                              e.target.value
                            )
                          }
                          className="text-sm min-h-[80px]"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="active_or_archive"
                            checked={editFormData.active_or_archive || false}
                            onCheckedChange={(checked) =>
                              handleInputChange('active_or_archive', checked)
                            }
                          />
                          <Label
                            htmlFor="active_or_archive"
                            className="text-sm"
                          >
                            Active Status
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="verified_student"
                            checked={editFormData.verified_student || false}
                            onCheckedChange={(checked) =>
                              handleInputChange('verified_student', checked)
                            }
                          />
                          <Label htmlFor="verified_student" className="text-sm">
                            Verified Student
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEdit}
                    disabled={editLoading}
                    className="text-sm"
                  >
                    {editLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xs sm:text-sm"
                >
                  <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Delete Student</span>
                  <span className="xs:hidden">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm">
                    This action cannot be undone. This will permanently delete
                    the student
                    <strong> {student.full_name}</strong> and remove all
                    associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                  <AlertDialogCancel className="text-sm">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    className="bg-red-600 hover:bg-red-700 text-sm"
                  >
                    {deleteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Student
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Card */}
          <Card className="xl:col-span-1 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 mx-auto mb-3 sm:mb-4 ring-4 ring-blue-100">
                  <AvatarImage
                    src={
                      student.profile_picture ||
                      '/placeholder.svg?height=128&width=128'
                    }
                  />
                  <AvatarFallback className="text-xl sm:text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {student.full_name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('') || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2">
                  {student.verified_student ? (
                    <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                      <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <XCircle className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg sm:text-2xl text-gray-900 break-words">
                {student.full_name}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Student ID: {id}
              </CardDescription>
              {student.alias_name && (
                <p className="text-xs sm:text-sm text-gray-500 break-words">
                  Also known as: {student.alias_name}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <Badge
                  variant={student.active_or_archive ? 'default' : 'secondary'}
                  className={`text-xs ${student.active_or_archive
                      ? 'bg-green-500 hover:bg-green-600'
                      : ''
                    }`}
                >
                  {student.active_or_archive ? 'Active' : 'Archived'}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 break-all">
                    {student.email_address || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 break-all">
                    {student.mobile_number || 'Not provided'}
                  </span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 break-all">
                    {student.whatsapp_number || 'Not provided'}
                  </span>
                </div>
                {student.date_of_birth && (
                  <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      {new Date(student.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <Button
                onClick={() => router.push(`/lms/guardian-dashboard/students/${id}/courses`)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                View Enrolled Courses
              </Button>
            </CardContent>
          </Card>

          {/* Main Information */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Basic personal details and identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      First Name
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                      {student.first_name || 'Not provided'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      Last Name
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                      {student.last_name || 'Not provided'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs sm:text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                      {student.user_id || 'Not assigned'}
                    </p>
                  </div>
                  {student.tax_or_ssn && (
                    <div className="min-w-0">
                      <label className="text-xs sm:text-sm font-medium text-gray-500">
                        Tax/SSN
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                        {student.tax_or_ssn}
                      </p>
                    </div>
                  )}
                  {student.student_profile && (
                    <div className="sm:col-span-2 lg:col-span-3 min-w-0">
                      <label className="text-xs sm:text-sm font-medium text-gray-500">
                        Student Profile
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 break-words">
                        {student.student_profile}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication Preferences */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Communication Preferences
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Student's subscription and contact settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        SMS Notifications
                      </span>
                    </div>
                    <Badge
                      variant={student.sms_subscribed ? 'default' : 'secondary'}
                      className="text-xs flex-shrink-0"
                    >
                      {student.sms_subscribed ? 'Subscribed' : 'Not Subscribed'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <AtSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        Email Notifications
                      </span>
                    </div>
                    <Badge
                      variant={
                        student.email_subscribed ? 'default' : 'secondary'
                      }
                      className="text-xs flex-shrink-0"
                    >
                      {student.email_subscribed
                        ? 'Subscribed'
                        : 'Not Subscribed'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            {(student.full_address ||
              student.zip_code ||
              student.zone ||
              student.state ||
              student.country) && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                      Address Information
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Location and address details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {student.full_address && (
                        <div className="sm:col-span-2 min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            Full Address
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 break-words">
                            {student.full_address}
                          </p>
                        </div>
                      )}
                      {student.zip_code && (
                        <div className="min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            Zip Code
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                            {student.zip_code}
                          </p>
                        </div>
                      )}
                      {student.zone && (
                        <div className="min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            Learning Hub
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                            {student.zone}
                          </p>
                        </div>
                      )}
                      {student.state && (
                        <div className="min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            State
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                            {student.state}
                          </p>
                        </div>
                      )}
                      {student.country && (
                        <div className="min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            Country
                          </label>
                          <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                            {student.country}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Academic Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Academic Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Educational details and academic progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm sm:text-lg font-bold text-green-600 break-words">
                      {typeof student.master_k12_grade === 'object'
                        ? student.master_k12_grade?.name || 'N/A'
                        : student.master_k12_grade || 'N/A'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Grade Level
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-100 rounded-lg">
                    <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm sm:text-lg font-bold text-blue-600 break-words">
                      {typeof student.institute === 'object'
                        ? student.institute?.name || 'N/A'
                        : student.institute || 'N/A'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Institute
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-violet-100 rounded-lg">
                    <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm sm:text-lg font-bold text-purple-600">
                      {student.courses_enrolled || '0'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Courses Enrolled
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-100 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm sm:text-lg font-bold text-orange-600">
                      {student.tutoring_sessions || '0'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Tutoring Sessions
                    </div>
                  </div>
                </div>
                {student.scholar_pass_amount && (
                  <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                      <span className="font-medium text-sm sm:text-base break-words">
                        Scholar Pass Amount: ${student.scholar_pass_amount}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guardian Information */}
            {(student.primary_guardian_name ||
              student.primary_guardian_email ||
              student.primary_guardian_phone) && (
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      Primary Guardian
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Emergency contact and guardian details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            Full Name
                          </label>
                          <p className="text-sm sm:text-lg font-semibold text-gray-900 break-words">
                            {student.primary_guardian_name || 'Not provided'}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <label className="text-xs sm:text-sm font-medium text-gray-500">
                            Relationship
                          </label>
                          <p className="text-sm sm:text-base text-gray-700 break-words">
                            {student.primary_guardian_relationship ||
                              'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">
                              Phone Number
                            </label>
                            <p className="text-sm sm:text-base text-gray-700 break-all">
                              {typeof student.primary_guardian_phone === 'object'
                                ? student.primary_guardian_phone?.phone ||
                                student.primary_guardian_phone?.number ||
                                'N/A'
                                : student.primary_guardian_phone ||
                                'Not provided'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-1 flex-shrink-0" />
                          <div className="min-w-0">
                            <label className="text-xs sm:text-sm font-medium text-gray-500">
                              Email Address
                            </label>
                            <p className="text-sm sm:text-base text-gray-700 break-all">
                              {typeof student.primary_guardian_email === 'object'
                                ? student.primary_guardian_email?.email ||
                                student.primary_guardian_email?.name ||
                                'N/A'
                                : student.primary_guardian_email ||
                                'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Administrative Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  Administrative Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Internal records and administrative details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {student.internal_remarks && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 sm:p-4 rounded-lg border-l-4 border-orange-400">
                      <label className="text-xs sm:text-sm font-medium text-gray-500">
                        Internal Remarks
                      </label>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1 break-words">
                        {student.internal_remarks}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {student.internal_student_score && (
                      <div className="min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-500">
                          Internal Score
                        </label>
                        <p className="text-sm sm:text-lg font-bold text-indigo-600 break-words">
                          {student.internal_student_score}
                        </p>
                      </div>
                    )}

                    <div className="min-w-0">
                      <label className="text-xs sm:text-sm font-medium text-gray-500">
                        Referral Status
                      </label>
                      <Badge
                        variant={student.referred ? 'default' : 'secondary'}
                        className="text-xs mt-1"
                      >
                        {student.referred ? 'Referred' : 'Direct'}
                      </Badge>
                    </div>

                    {student.referred_by_email && (
                      <div className="min-w-0">
                        <label className="text-xs sm:text-sm font-medium text-gray-500">
                          Referred By
                        </label>
                        <p className="text-sm sm:text-base text-gray-700 break-all">
                          {typeof student.referred_by_email === 'object'
                            ? student.referred_by_email?.email ||
                            student.referred_by_email?.name ||
                            'N/A'
                            : student.referred_by_email}
                        </p>
                      </div>
                    )}
                  </div>

                  {student.assigned_employee && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-3 sm:p-4 rounded-lg">
                      <label className="text-xs sm:text-sm font-medium text-gray-500">
                        Assigned Employee
                      </label>
                      <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                        {typeof student.assigned_employee === 'object'
                          ? student.assigned_employee?.name || 'N/A'
                          : student.assigned_employee}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  System Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Internal system IDs and references
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      Institute ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.institute_id || 'N/A'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      Country ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.country_id || 'N/A'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      State ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.state_id || 'N/A'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      Learning Hub ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.zone_id || 'N/A'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      Grade ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.master_k12_grade_id || 'N/A'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      Membership Type ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.master_membership_type_id || 'N/A'}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <label className="text-xs font-medium text-gray-500">
                      Employee ID
                    </label>
                    <p className="text-gray-700 break-words">
                      {student.assigned_employee_id || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
