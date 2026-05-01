'use client';

import dynamic from 'next/dynamic';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import ContextWrapper from '@/components/shared/wrappers/ContextWrapper';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import axios from '@/lib/axios';
import { getPostCheckoutRoute } from '@/lib/dashboard-route';
import { checkCourseEnrollment } from '@/lib/enrollment';
import { parseDangerousHtml } from '@/lib/parseHtml';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  BadgeCheck,
  AlertCircle,
  GraduationCap,
  UserCircle,
  ChevronDown,
} from 'lucide-react';

const Header = dynamic(() => import('@/components/layout/header/Header'), {
  ssr: false,
  loading: () => <div className="h-[120px] bg-white" />,
});

export default function DirectCheckoutPage() {
  const params = useParams();
  const scholarshipId = params?.scholarshipId;
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
  const [guardianStudentList, setGuardianStudentList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const redirectBasedOnRole = async () => {
    try {
      const userResponse = await axios.post('/auth/me');
      router.push(getPostCheckoutRoute(userResponse?.data?.data || {}));
    } catch (error) {
      console.error(
        'Failed to fetch user role, defaulting to student dashboard',
        error
      );
      router.push('/lms/student-dashboard/my-courses');
    }
  };

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const response = await axios.get(`/scholarships/${scholarshipId}`);
        setCourse(response.data.data);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('current_checkout_course_id', scholarshipId);
        }

        // Fetch user role
        try {
          const userResponse = await axios.post('/auth/me');
          const primaryRole = userResponse.data.data.primary_role.name.toLowerCase();
          setCurrentUserRole(primaryRole);
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }

        setIsCheckingEnrollment(true);
        try {
          const result = await checkCourseEnrollment(scholarshipId);
          if (result.authError) {
            setIsEnrolled(false);
          } else {
            const isUserEnrolled = !!result.enrolled;
            if (isUserEnrolled) {
              setIsEnrolled(true);
              setTimeout(() => {
                redirectBasedOnRole();
              }, 2000);
            } else {
              setIsEnrolled(false);
            }
          }
        } catch {
          setIsEnrolled(false);
        } finally {
          setIsCheckingEnrollment(false);
        }
      } catch {
        setError('Failed to load course details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    if (scholarshipId) fetchCourse();
  }, [scholarshipId, router]);

  useEffect(() => {
    async function fetchGuardianStudentList() {
      if (currentUserRole === 'guardian') {
        try {
          const res = await axios.get(
            '/student-guardian-accesses/guardian-student-list'
          );
          setGuardianStudentList(res.data?.data || []);
        } catch (err) {
          setGuardianStudentList([]);
        }
      }
    }
    fetchGuardianStudentList();
  }, [currentUserRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (showStudentDropdown && !event.target.closest('#student-select') && !event.target.closest('.student-dropdown')) {
        setShowStudentDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStudentDropdown]);

  async function handlePaymentSuccess() {
    setPaymentSuccess(true);
    try {
      try {
        const result = await checkCourseEnrollment(scholarshipId);
        if (result.enrolled) {
          setEnrollmentSuccess(true);
          setTimeout(() => {
            redirectBasedOnRole();
          }, 2000);
          return;
        }
      } catch {
        setEnrollmentError(
          'Failed to check enrollment status. Please try again later.'
        );
        return;
      }
      const userResponse = await axios.post('/auth/me');
      const primaryRole =
        userResponse.data.data.primary_role.name.toLowerCase();
      if (primaryRole === 'student') {
        await axios.post('/edumarket/enrollments/confirm', {
          course_id: parseInt(scholarshipId),
          scholarship_id: parseInt(scholarshipId),
        });
      } else if (primaryRole === 'guardian') {
        // Validate that a student is selected for guardians
        if (!selectedStudentId) {
          setEnrollmentError('Please select a student to enroll in this course.');
          return;
        }

        const payload = {
          course_id: parseInt(scholarshipId),
          student_id: parseInt(selectedStudentId),
        };

        await axios.post('/stripe/guardian-enroll', payload);
      }
      setEnrollmentSuccess(true);
      setTimeout(() => {
        redirectBasedOnRole();
      }, 2000);
    } catch (err) {
      setEnrollmentError(
        err.response?.data?.message || 'Failed to create enrollment'
      );
      setTimeout(() => {
        redirectBasedOnRole();
      }, 5000);
    }
  }

  function handleCancel() {
    router.back();
  }

  if (loading)
    return (
      <>
        <ContextWrapper>
          <Header />
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
            <div className="container mx-auto py-16 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="mt-4 text-lg font-medium">Loading course details...</p>
                <p className="text-muted-foreground text-sm">Please wait a moment.</p>
              </div>
            </div>
          </div>
        </ContextWrapper>
      </>
    );

  if (error)
    return (
      <>
        <ContextWrapper>
          <Header />
          <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error
                </CardTitle>
                <CardDescription>Something went wrong</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{error}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button onClick={() => location.reload()}>Try Again</Button>
              </CardFooter>
            </Card>
          </div>
        </ContextWrapper>
      </>
    );

  if (paymentSuccess)
    return (
      <>
        <ContextWrapper>
          <Header />
          <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center space-y-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Payment Successful!</CardTitle>
                <CardDescription>We’re finalizing your enrollment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <p>
                    Thank you for your payment for <strong>{course?.name}</strong>.
                  </p>
                  {!enrollmentSuccess && !enrollmentError && (
                    <div className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating your enrollment...
                    </div>
                  )}
                  {enrollmentSuccess && (
                    <div className="rounded-md bg-green-50 px-3 py-2 text-green-700 text-sm">
                      Your enrollment has been created successfully! Redirecting to your dashboard...
                    </div>
                  )}
                  {enrollmentError && (
                    <div className="space-y-2">
                      <p className="text-amber-600">
                        We received your payment, but there was an issue creating your enrollment. Don&apos;t worry — our team has been notified and will fix this for you shortly.
                      </p>
                      <p className="text-red-600 text-sm">{enrollmentError}</p>
                      <p className="text-muted-foreground text-sm">Redirecting to your dashboard...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ContextWrapper>
      </>
    );

  return (
    <>
      <ContextWrapper>
        <Header />
        {/* Page masthead */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/10 to-background">
          <div className="container mx-auto px-4 py-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex h-7 items-center rounded-full bg-primary/10 px-3 font-medium text-primary">
                <CreditCard className="mr-1 h-4 w-4" /> Checkout
              </span>
              <span className="text-muted-foreground/70">Secure • Fast • Simple</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Complete your enrollment</h1>
            <p className="text-muted-foreground">
              Review the course details and proceed to secure payment.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="max-w-6xl mx-auto">
            {isEnrolled && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center">
                    <BadgeCheck className="mr-2 h-5 w-5" />
                    Already Enrolled
                  </CardTitle>
                  <CardDescription className="text-green-700/80">
                    You are already enrolled in this course.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={redirectBasedOnRole}
                  >
                    View My Dashboard
                  </Button>
                </CardFooter>
              </Card>
            )}

            {course && !isEnrolled && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Left: Course / Payment */}
                <div className="md:col-span-2 space-y-6">
                  {/* Course Details / Payment Form */}
                  {!showPaymentForm ? (
                    <Card className="shadow-sm">
                      <CardHeader className="space-y-1">
                        <CardTitle className="flex items-center">
                          <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                          Course Details
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Trusted enrollment with secure payment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold tracking-tight">
                            {course.name}
                          </h3>
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            {parseDangerousHtml(course.description)}
                          </div>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                          <h4 className="font-semibold">What you&apos;ll learn</h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {course.what_you_will_learn ||
                              'Comprehensive course materials and hands-on practice.'}
                          </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                          <h4 className="font-semibold">Course Includes</h4>
                          <ul className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Full lifetime access
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Access on mobile and desktop
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                              Certificate of completion
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-primary" />
                          Payment Details
                        </CardTitle>
                        <CardDescription>
                          Complete your payment to enroll in this course
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StripePaymentForm
                          scholarshipId={scholarshipId}
                          onSuccess={handlePaymentSuccess}
                          onCancel={() => setShowPaymentForm(false)}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-center border-t pt-4"></CardFooter>
                    </Card>
                  )}

                  {/* Helper Note */}
                  {!showPaymentForm && (
                    <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Note:</span>{' '}
                      You’ll be able to review the price and student selection (for guardians) in the Order Summary.
                    </div>
                  )}
                </div>

                {/* Right: Order Summary (sticky) */}
                <div className="md:col-span-1">
                  <Card className="shadow-sm md:sticky md:top-24">
                    <CardHeader className="pb-2">
                      <CardTitle>Order Summary</CardTitle>
                      <CardDescription>Review and proceed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <span>Course Price</span>
                          <span className="font-medium">
                            {course.discounted_price && course.discounted_price < course.regular_price ? (
                              <>
                                <span className="mr-2 line-through text-muted-foreground">
                                  ${Number(course.regular_price || 0).toFixed(2)}
                                </span>
                                <span className="text-green-600">
                                  ${Number(course.discounted_price).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <>${Number(course.regular_price || 0).toFixed(2)}</>
                            )}
                          </span>
                        </div>

                        {course.discounted_price &&
                          course.discounted_price < course.regular_price && (
                            <div className="flex items-center justify-between text-green-600">
                              <span>Discount</span>
                              <span>
                                -$
                                {(
                                  Number(course.regular_price) - Number(course.discounted_price)
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}

                        <div className="mt-1 flex items-center justify-between border-t pt-3 font-semibold">
                          <span>Total</span>
                          <span>
                            $
                            {Number(
                              course.discounted_price || course.regular_price || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Student Selection for Guardians */}
                      {currentUserRole === 'guardian' && (
                        <div className="border-t pt-4 space-y-3">
                          {guardianStudentList.length > 0 ? (
                            <>
                              <Label htmlFor="student-select" className="text-sm font-medium flex items-center">
                                <UserCircle className="mr-2 h-4 w-4" />
                                Select Student <span className="ml-1 text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="student-select"
                                  placeholder="Search and select a student..."
                                  value={studentSearchTerm}
                                  onChange={(e) => {
                                    setStudentSearchTerm(e.target.value);
                                    setShowStudentDropdown(true);
                                  }}
                                  onFocus={() => setShowStudentDropdown(true)}
                                  className="w-full pr-8"
                                  required
                                />
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                {selectedStudentId && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedStudentId('');
                                      setStudentSearchTerm('');
                                      setShowStudentDropdown(false);
                                    }}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    title="Clear selection"
                                  >
                                    ✕
                                  </button>
                                )}
                                {showStudentDropdown && (
                                  <div className="student-dropdown absolute z-10 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                                    {selectedStudentId && (
                                      <div
                                        className="px-3 py-2 hover:bg-red-50 cursor-pointer border-b text-red-600"
                                        onClick={() => {
                                          setSelectedStudentId('');
                                          setStudentSearchTerm('');
                                          setShowStudentDropdown(false);
                                        }}
                                      >
                                        ✕ Clear selection
                                      </div>
                                    )}
                                    {guardianStudentList
                                      .filter((item) =>
                                        item.student_name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                        item.student?.email_address?.toLowerCase().includes(studentSearchTerm.toLowerCase())
                                      )
                                      .map((item) => (
                                        <div
                                          key={item.id}
                                          className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer border-b last:border-b-0"
                                          onClick={() => {
                                            setSelectedStudentId(item.student_id);
                                            setStudentSearchTerm(item.student_name);
                                            setShowStudentDropdown(false);
                                          }}
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium text-sm">{item.student_name}</span>
                                            {item.student?.email_address && (
                                              <span className="text-xs text-muted-foreground">
                                                {item.student.email_address}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    {guardianStudentList.filter((item) =>
                                      item.student_name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                      item.student?.email_address?.toLowerCase().includes(studentSearchTerm.toLowerCase())
                                    ).length === 0 && !selectedStudentId && (
                                      <div className="px-3 py-2 text-muted-foreground text-sm">
                                        No students found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              {selectedStudentId ? (
                                <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                                  <span>
                                    ✓ Student selected:{' '}
                                    {guardianStudentList.find(item => item.student_id == selectedStudentId)?.student_name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedStudentId('');
                                      setStudentSearchTerm('');
                                    }}
                                    className="text-red-500 hover:text-red-700 font-medium ml-2"
                                    title="Deselect student"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div className="text-xs text-red-500">
                                  Please select a student to proceed with enrollment
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center">
                              <div className="text-red-600 text-sm font-semibold mb-1">
                                No Students Found
                              </div>
                              <div className="text-muted-foreground text-xs">
                                You need to add students to your account before enrolling in courses.
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3">
                      {!showPaymentForm ? (
                        <>
                          <Button
                            className="w-full"
                            onClick={() => setShowPaymentForm(true)}
                            disabled={currentUserRole === 'guardian' && (guardianStudentList.length === 0 || !selectedStudentId)}
                          >
                            Proceed to Payment
                          </Button>
                          {currentUserRole === 'guardian' && guardianStudentList.length === 0 && (
                            <p className="text-xs text-red-500 text-center">
                              Please add students to your account first
                            </p>
                          )}
                          {currentUserRole === 'guardian' && guardianStudentList.length > 0 && !selectedStudentId && (
                            <p className="text-xs text-red-500 text-center">
                              Please select a student to proceed
                            </p>
                          )}
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                            <ShieldCheck className="h-4 w-4" />
                            Transactions are secured and encrypted
                          </div>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowPaymentForm(false)}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Course Details
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}

            {isCheckingEnrollment && !isEnrolled && !course && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
                <span className="text-lg">Checking enrollment status...</span>
              </div>
            )}
          </div>
        </div>
      </ContextWrapper>
    </>
  );
}
    
