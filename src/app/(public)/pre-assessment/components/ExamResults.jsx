'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import axios from '@/lib/axios';
import { AlertCircle, Award, BookOpen, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePreAssessment } from '../context/PreAssessmentContext';

export default function ExamResults() {
  const {
    score,
    selectedGrade,
    resetExam,
    apiReadyData,
    examDetails,
    examReport,
  } = usePreAssessment();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  // Define feedback based on score percentage
  const getFeedback = () => {
    if (score.percentage >= 80) {
      return {
        message: "Excellent! You've mastered this material.",
        icon: <Award className="w-16 h-16 text-yellow-500" />,
        color: 'bg-green-600',
      };
    } else if (score.percentage >= 60) {
      return {
        message: 'Good job! You understand most concepts.',
        icon: <CheckCircle className="w-16 h-16 text-green-500" />,
        color: 'bg-yellow-500',
      };
    } else {
      return {
        message: 'You might need more practice with this material.',
        icon: <AlertCircle className="w-16 h-16 text-red-500" />,
        color: 'bg-red-500',
      };
    }
  };

  const feedback = getFeedback();

  // Function to submit answers to API
  const submitAnswers = async () => {
    if (!apiReadyData || apiReadyData.length === 0) {
      setSubmitError('No answer data available to submit');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Submit the answers to the API
      const response = await axios.post(
        '/exam-report/submit-pre-test',
        apiReadyData
      );

      // If successful, fetch the report
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchReport();
      }
    } catch (err) {
      console.error('Error submitting answers:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch exam report
  const fetchReport = async () => {
    if (!examDetails?.id) {
      setSubmitError('No exam ID available to fetch report');
      return;
    }

    try {
      setIsReportLoading(true);

      // Get the exam report using the exam ID
      const response = await axios.get(
        `/exam-report/generate?examId=${examDetails.id}`
      );

      if (response.data && response.data.status === 'SUCCESS') {
        setReportData(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to load report');
      }
    } catch (err) {
      console.error('Error fetching report:', err);
      setSubmitError(
        err.response?.data?.message || 'Failed to load exam report'
      );
    } finally {
      setIsReportLoading(false);
    }
  };

  // Handle if we already have report data
  if (reportData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-center">Detailed Exam Report</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                Submission Successful!
              </h3>
              <p className="text-green-700">
                Your assessment has been submitted and recorded.
              </p>
            </div>

            {/* Display the report data here in a user-friendly format */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Assessment Results</h3>
              <p className="text-gray-700">
                Score:{' '}
                <span className="font-semibold">{score.percentage}%</span>
              </p>
              <p className="text-gray-700">
                Grade Level:{' '}
                <span className="font-semibold">{selectedGrade}</span>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={resetExam}
              className="relative overflow-hidden text-white"
              style={{
                background:
                  'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
              }}
            >
              Take Another Assessment
            </Button>
            <Link
              href="/learninghub/recommended-courses"
              className="w-full"
              onClick={() => {
                // Get user object from localStorage
                const userStr = localStorage.getItem('user');
                if (!userStr) return;
                let user;
                try {
                  user = JSON.parse(userStr);
                } catch {
                  return;
                }
                if (!user?.email) return;

                // Get attempted_users array or create new
                const attemptedUsersStr = localStorage.getItem('attempted_users');
                let attemptedUsers = [];
                if (attemptedUsersStr) {
                  try {
                    attemptedUsers = JSON.parse(attemptedUsersStr);
                    if (!Array.isArray(attemptedUsers)) attemptedUsers = [];
                  } catch {
                    attemptedUsers = [];
                  }
                }

                // Add email if not already present
                if (!attemptedUsers.includes(user.email)) {
                  attemptedUsers.push(user.email);
                  localStorage.setItem('attempted_users', JSON.stringify(attemptedUsers));
                }
              }}
            >
              <Button variant="outline" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                View Recommended Courses
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-center font-bold mb-6 bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">
            Assessment Results
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6 py-6">
          <div className="flex flex-col items-center space-y-4">
            {feedback.icon}
            <h2 className="text-2xl font-bold">
              {examDetails?.title || 'Pre-Assessment'}
            </h2>
          </div>

          <div className="w-full max-w-xs bg-gray-100 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${feedback.color}`}
              style={{ width: `${score.percentage}%` }}
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-3xl font-bold">Score: {score.percentage}%</p>
            <p>
              You got {score.correct} out of {score.total} questions correct.
            </p>
            <p className="text-muted-foreground">{feedback.message}</p>
          </div>

          {submitError && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {submitError}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={resetExam}
            className="hover:scale-105 text-white rounded-xl px-8 py-3 text-lg border-none sm:py-5"
            style={{
              background:
                'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
            }}
          >
            Take Another Assessment
          </Button>
          <Link
            href="/learninghub/recommended-courses"
            className="w-full"
            onClick={() => {
              // Get user object from localStorage
              const userStr = localStorage.getItem('user');
              if (!userStr) return;
              let user;
              try {
                user = JSON.parse(userStr);
              } catch {
                return;
              }
              if (!user?.email) return;

              // Get attempted_users array or create new
              const attemptedUsersStr = localStorage.getItem('attempted_users');
              let attemptedUsers = [];
              if (attemptedUsersStr) {
                try {
                  attemptedUsers = JSON.parse(attemptedUsersStr);
                  if (!Array.isArray(attemptedUsers)) attemptedUsers = [];
                } catch {
                  attemptedUsers = [];
                }
              }

              // Add email if not already present
              if (!attemptedUsers.includes(user.email)) {
                attemptedUsers.push(user.email);
                localStorage.setItem('attempted_users', JSON.stringify(attemptedUsers));
              }
            }}
          >
            <Button variant="outline" className="w-full">
              <BookOpen className="mr-2 h-4 w-4" />
              View Recommended Courses
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
