'use client';

import axios from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ExamForm from './components/ExamForm';
import ExamResults from './components/ExamResults';
import GradeSelector from './components/GradeSelector';
import InstructionModal from './components/InstructionModal';
import {
  PreAssessmentProvider,
  usePreAssessment,
} from './context/PreAssessmentContext';

const PreAssessmentPage = () => {
  const router = useRouter();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  // Redirect if user's email is in attempted_users array in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const email = user?.email;
          if (email) {
            let attemptedUsers = [];
            const attemptedUsersStr = localStorage.getItem('attempted_users');
            if (attemptedUsersStr) {
              attemptedUsers = JSON.parse(attemptedUsersStr);
            } else {
              // Create empty array if not exists
              localStorage.setItem('attempted_users', JSON.stringify([]));
            }
            if (Array.isArray(attemptedUsers) && attemptedUsers.includes(email)) {
              router.replace('/');
            }
          }
        } catch (e) {
          console.error('Error parsing user or attempted_users from localStorage', e);
        }
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/master-k12-grades');
        setGrades(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError(err.response?.data?.message || 'Failed to load grades');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  const handleCloseModal = () => {
    setShowInstructions(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load grades</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <PreAssessmentProvider>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">
          Pre-Assessment
        </h1>
        <PreAssessmentContent grades={grades} />
      </div>

      {showInstructions && <InstructionModal onClose={handleCloseModal} />}
    </PreAssessmentProvider>
  );
};

const PreAssessmentContent = ({ grades }) => {
  const { examStarted, examCompleted, answers, apiReadyData } =
    usePreAssessment();

  if (examCompleted) {
    return <ExamResults />;
  }

  if (examStarted) {
    return <ExamForm />;
  }

  return <GradeSelector grades={grades} />;
};

export default PreAssessmentPage;
