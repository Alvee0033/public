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

const Header = dynamic(() => import('@/components/layout/header/Header'), {
  ssr: false,
  loading: () => <div className="h-[120px] bg-white" />,
});

export default function DirectCheckoutPage() {
  const params = useParams();
  const courseId = params?.courseId;
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
        const response = await axios.get(`/courses/${courseId}`);
        setCourse(response.data.data);
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('current_checkout_course_id', courseId);
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
          const result = await checkCourseEnrollment(courseId);
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
    if (courseId) fetchCourse();
  }, [courseId, router]);

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
        const result = await checkCourseEnrollment(courseId);
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
          course_id: parseInt(courseId),
        });
      } else if (primaryRole === 'guardian') {
        // Validate that a student is selected for guardians
        if (!selectedStudentId) {
          setEnrollmentError('Please select a student to enroll in this course.');
          return;
        }

        const payload = {
          course_id: parseInt(courseId),
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
          <div className="container mx-auto py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-lg">Loading course details...</p>
            </div>
          </div>
          {/* <Footer /> */}
        </ContextWrapper>
      </>
    );

  if (error)
    return (
      <>
        <ContextWrapper>
          <Header />
          <div className="container mx-auto py-10">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => router.back()}>Go Back</Button>
              </CardFooter>
            </Card>
          </div>
          {/* <Footer /> */}
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
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-center">
                    Thank you for your payment for{' '}
                    <strong>{course?.name}</strong>.
                  </p>
                  {!enrollmentSuccess && !enrollmentError && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <p>Creating your enrollment...</p>
                    </div>
                  )}
                  {enrollmentSuccess && (
                    <p className="text-green-600">
                      Your enrollment has been created successfully! Redirecting
                      to your dashboard...
                    </p>
                  )}
                  {enrollmentError && (
                    <div>
                      <p className="text-amber-600">
                        We received your payment, but there was an issue
                        creating your enrollment. Don&apos;t worry - our team
                        has been notified and will fix this for you shortly.
                      </p>
                      <p className="text-red-500 mt-2">{enrollmentError}</p>
                      <p className="mt-2">Redirecting to your dashboard...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* <Footer /> */}
        </ContextWrapper>
      </>
    );

  return (
    <>
      <ContextWrapper>
        <Header />
        <div className="container mx-auto py-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            {isEnrolled && (
              <Card className="mb-6 bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Already Enrolled
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700">
                    You are already enrolled in this course. You will be
                    redirected to your dashboard shortly.
                  </p>
                </CardContent>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {showPaymentForm ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>
                          Complete your payment to enroll in this course
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StripePaymentForm
                          courseId={courseId}
                          onSuccess={handlePaymentSuccess}
                          onCancel={() => setShowPaymentForm(false)}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-center border-t pt-4"></CardFooter>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-xl">
                              {course.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {parseDangerousHtml(course.description)}
                            </p>
                          </div>
                          <div className="border-t pt-4">
                            <h4 className="font-semibold">
                              What you&apos;ll learn:
                            </h4>
                            <p>
                              {course.what_you_will_learn ||
                                'Comprehensive course materials and hands-on practice.'}
                            </p>
                          </div>
                          <div className="border-t pt-4">
                            <h4 className="font-semibold">Course Includes:</h4>
                            <ul className="list-disc list-inside space-y-1 mt-2">
                              <li>Full lifetime access</li>
                              <li>Access on mobile and desktop</li>
                              <li>Certificate of completion</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Course Price:</span>
                          <span>${course.regular_price || 0}</span>
                        </div>
                        {course.discounted_price &&
                          course.discounted_price < course.regular_price && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount:</span>
                              <span>
                                -$
                                {(
                                  course.regular_price - course.discounted_price
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                        <div className="flex justify-between font-bold border-t pt-4">
                          <span>Total:</span>
                          <span>
                            $
                            {course.discounted_price ||
                              course.regular_price ||
                              0}
                          </span>
                        </div>

                        {/* Student Selection for Guardians */}
                        {currentUserRole === 'guardian' && (
                          <div className="border-t pt-4 space-y-3">
                            {guardianStudentList.length > 0 ? (
                              <>
                                <Label htmlFor="student-select" className="text-sm font-medium">
                                  Select Student <span className="text-red-500">*</span>
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
                                  {selectedStudentId && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedStudentId('');
                                        setStudentSearchTerm('');
                                        setShowStudentDropdown(false);
                                      }}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                      title="Clear selection"
                                    >
                                      ✕
                                    </button>
                                  )}
                                  {showStudentDropdown && (
                                    <div className="student-dropdown absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                      {/* Clear selection option */}
                                      {selectedStudentId && (
                                        <div
                                          className="px-3 py-2 hover:bg-red-50 cursor-pointer border-b border-gray-100 text-red-600"
                                          onClick={() => {
                                            setSelectedStudentId('');
                                            setStudentSearchTerm('');
                                            setShowStudentDropdown(false);
                                          }}
                                        >
                                          <div className="flex items-center">
                                            <span className="text-sm">✕ Clear selection</span>
                                          </div>
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
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            onClick={() => {
                                              setSelectedStudentId(item.student_id);
                                              setStudentSearchTerm(item.student_name);
                                              setShowStudentDropdown(false);
                                            }}
                                          >
                                            <div className="flex flex-col">
                                              <span className="font-medium text-sm">{item.student_name}</span>
                                              {item.student?.email_address && (
                                                <span className="text-xs text-gray-500">{item.student.email_address}</span>
                                              )}
                                            </div>
                                          </div>
                                        ))
                                      }
                                      {guardianStudentList.filter((item) =>
                                        item.student_name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
                                        item.student?.email_address?.toLowerCase().includes(studentSearchTerm.toLowerCase())
                                      ).length === 0 && !selectedStudentId && (
                                          <div className="px-3 py-2 text-gray-500 text-sm">
                                            No students found
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                                {selectedStudentId ? (
                                  <div className="flex items-center justify-between text-xs text-green-600 bg-green-50 p-2 rounded">
                                    <span>✓ Student selected: {guardianStudentList.find(item => item.student_id == selectedStudentId)?.student_name}</span>
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
                              <div className="text-center py-4">
                                <div className="text-red-500 text-sm font-medium mb-2">
                                  No Students Found
                                </div>
                                <div className="text-gray-600 text-xs">
                                  You need to add students to your account before enrolling in courses.
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowPaymentForm(false)}
                        >
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <span className="text-lg">Checking enrollment status...</span>
              </div>
            )}
          </div>
        </div>
        {/* <Footer /> */}
      </ContextWrapper>
    </>
  );
}
