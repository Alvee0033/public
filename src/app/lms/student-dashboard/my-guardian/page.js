'use client';

import Button from '@/components/shared/buttons/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import axios from "@/lib/axios";
import { useAppSelector } from '@/redux/hooks';
import {
  AlertCircle,
  Briefcase,
  Loader2,
  Mail,
  Phone,
  Plus,
  User,
} from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';

export default function GuardianPage() {
  // Get user data from Redux state instead of /me API
  const userData = useAppSelector((state) => state.auth.user);

  // Get student ID from user data
  const studentId = userData?.student_id;
  // console.log('Student Id', studentId);

  // Fetch guardians data based on student ID
  //

  const getGuardians = async () => {
    try {
      const res = await axios.get('/app-users?limit=50');
      const allUsers = res?.data?.data || [];

      const filtered = allUsers.filter(
        (user) =>
          user.app_user_roles?.some((role) => role.role_id === 5) &&
          user.id === studentId
      );

      // console.log('Filtered guardians:', filtered);
      return filtered;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  const {
    data: guardians = [],
    isLoading: guardiansLoading,
    error: guardiansError,
  } = useSWR(studentId ? ['student-guardians', studentId] : null, getGuardians);

  // Replace this with the actual studentId if you want it dynamic
  // const studentId = userData.student_id;

  const getGuardianAccesses = async () => {
    try {
      const filter = {
        student: studentId,
      };
      // const res = await axios.get(
      //   `/student-guardian-accesses/guardian-student-list`
      // );
      const res = await axios.get(
        `/student-guardian-accesses?filter=${JSON.stringify(filter)}`
      );
      return res?.data?.data || [];
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  const {
    data: guardianAccesses = [],
    isLoading: guardianAccessesLoading,
    error: guardianAccessesError,
  } = useSWR(['student-guardian-accesses', studentId], getGuardianAccesses);

  // Format date function for displaying dates
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get the primary guardian (first in the list if available)
  const primaryGuardian =
    guardians && guardians.length > 0 ? guardians[0] : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Guardian</h1>
            <p className="text-muted-foreground">
              View and manage guardian information for your student.
            </p>
          </div>
          <Link href="/lms/student-dashboard/my-guardian/new">
            <Button className="rounded-md border-none">
              <Plus className="mr-2 h-4 w-4" /> Add Guardian
            </Button>
          </Link>
        </div>

        {/* <div className="grid gap-6 md:grid-cols-2">
          {/* Student Information Card
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Student Information
              </CardTitle>
              <CardDescription>Details about the student</CardDescription>
            </CardHeader>
            <CardContent>
              {userLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading student information...</span>
                </div>
              ) : userError ? (
                <div className="text-red-500">
                  Error loading student information. Please try again.
                </div>
              ) : userData ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {userData.profile_picture_url ? (
                      <AvatarImage
                        src={userData.profile_picture_url}
                        alt={`${userData.first_name} ${userData.last_name}`}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {`${userData.first_name?.[0] || ''}${
                          userData.last_name?.[0] || ''
                        }`}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {`${userData.first_name || ''} ${
                        userData.last_name || ''
                      }`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Student ID: {userData.student_id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: {userData.email}
                    </p>
                    {/* <p className="text-sm text-muted-foreground">
                      User ID: {userData.id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No student information available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guardian Status Card
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Guardian Status
              </CardTitle>
              <CardDescription>Access information</CardDescription>
            </CardHeader>
            <CardContent>
              {guardiansLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading guardian status...</span>
                </div>
              ) : guardiansError ? (
                <div className="text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Error loading guardian information</span>
                </div>
              ) : !primaryGuardian ? (
                <div className="text-muted-foreground">
                  No guardian information available
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Access Since</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatDate(
                        primaryGuardian.created_at ||
                          primaryGuardian.access_date
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Access Level</span>
                    </div>
                    <Badge variant="outline" className="font-medium">
                      {primaryGuardian.access_level || 'Standard'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Status</span>
                    </div>
                    <Badge
                      className={
                        primaryGuardian.active || primaryGuardian.is_active
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }
                    >
                      {primaryGuardian.active || primaryGuardian.is_active
                        ? 'Active'
                        : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div> */}

        {/* Guardian Information Card */}
        {/* <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Guardian Information
            </CardTitle>
            <CardDescription>Contact details for your guardian</CardDescription>
          </CardHeader>
          <CardContent>
            {guardiansLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading guardian information...</span>
              </div>
            ) : guardiansError ? (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Error loading guardian information</span>
              </div>
            ) : guardians.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-muted-foreground mb-4">
                  No guardian information available
                </div>
                <Link href="/lms/student-dashboard/my-guardian/new">
                  <Button className=" rounded-md border-none">
                    <Plus className="mr-2 h-4 w-4" /> Add Guardian
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {primaryGuardian.profile_picture_url ? (
                      <AvatarImage
                        src={primaryGuardian.profile_picture_url}
                        alt={primaryGuardian.guardian_name || 'Guardian'}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {primaryGuardian.guardian_name
                          ? primaryGuardian.guardian_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                          : 'G'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {primaryGuardian.first_name || 'Guardian'}{' '}
                      {primaryGuardian.last_name || ''}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Guardian ID:{' '}
                      {primaryGuardian.guardian_user ||
                        primaryGuardian.id ||
                        'N/A'}
                    </p>
                    {primaryGuardian.relation && (
                      <p className="text-sm text-muted-foreground">
                        Relationship: {primaryGuardian.relation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {(primaryGuardian.guardian_email ||
                    primaryGuardian.email) && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`mailto:${
                          primaryGuardian.guardian_email ||
                          primaryGuardian.email
                        }`}
                        className="text-sm hover:underline"
                      >
                        {primaryGuardian.guardian_email ||
                          primaryGuardian.email}
                      </a>
                    </div>
                  )}

                  {(primaryGuardian.guardian_phone ||
                    primaryGuardian.phone_number) && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={`tel:${
                          primaryGuardian.guardian_phone ||
                          primaryGuardian.phone_number
                        }`}
                        className="text-sm hover:underline"
                      >
                        {primaryGuardian.guardian_phone ||
                          primaryGuardian.phone_number}
                      </a>
                    </div>
                  )}

                  {(primaryGuardian.guardian_job_title ||
                    primaryGuardian.occupation) && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        {primaryGuardian.guardian_job_title ||
                          primaryGuardian.occupation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Show multiple guardians if there are more than one */}
        {guardians && guardians.length > 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Additional Guardians
              </CardTitle>
              <CardDescription>
                Other guardians associated with this account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {guardians.slice(1).map((guardian, index) => (
                  <div
                    key={guardian.id || index}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <Avatar className="h-12 w-12">
                      {guardian.profile_picture_url ? (
                        <AvatarImage
                          src={guardian.profile_picture_url}
                          alt={guardian.guardian_name || 'Guardian'}
                        />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {guardian.guardian_name
                            ? guardian.guardian_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : `G${index + 2}`}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {guardian.guardian_name || 'Guardian'}
                      </h3>
                      {guardian.relation && (
                        <p className="text-xs text-muted-foreground">
                          {guardian.relation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guardian Accesses Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Guardian Information
            </CardTitle>
            <CardDescription>
              List of guardians with access to this student
            </CardDescription>
          </CardHeader>
          <CardContent>
            {guardianAccessesLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading guardian accesses...</span>
              </div>
            ) : guardianAccessesError ? (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Error loading guardian accesses</span>
              </div>
            ) : guardianAccesses.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No guardian access records found.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {guardianAccesses.map((access) => (
                  <div
                    key={access.id}
                    className="flex flex-col gap-2 p-4 rounded-lg border bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-lg">
                        {access.guardian_name || 'Guardian'}
                      </span>
                      <span
                        className={`ml-auto px-2 py-0.5 rounded text-xs font-medium
                ${
                  access.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
                      >
                        {access.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {access.guardian_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${access.guardian_email}`}
                          className="hover:underline"
                        >
                          {access.guardian_email}
                        </a>
                      </div>
                    )}
                    {access.guardian_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${access.guardian_phone}`}
                          className="hover:underline"
                        >
                          {access.guardian_phone}
                        </a>
                      </div>
                    )}
                    {access.guardian_job_title && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{access.guardian_job_title}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Access Level:</span>
                      <span>{access.access_level || 'Standard'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Access Date:</span>
                      <span>
                        {access.access_date
                          ? formatDate(access.access_date)
                          : 'Not specified'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
