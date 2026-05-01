'use client';

import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePreAssessment } from '../context/PreAssessmentContext';

const GradeSelector = ({ grades }) => {
  const [selectedGradeId, setSelectedGradeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { startExam } = usePreAssessment();

  const handleGradeSelect = (gradeId) => {
    setSelectedGradeId(gradeId);
  };

  const handleStartExam = async () => {
    if (!selectedGradeId) return;

    try {
      setLoading(true);
      setError(null);

      const filter = {
        is_pre_test: true,
        grade: selectedGradeId,
      };

      const response = await axios.get(
        `/exams?filter=${JSON.stringify(filter)}`
      );

      if (response.data?.data && response.data.data.length > 0) {
        const examId = response.data.data[0].id;
        await startExam(selectedGradeId, examId);
      } else {
        setError('No pre-assessment available for this grade level.');
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
      setError(err.response?.data?.message || 'Failed to load pre-assessment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        <span className="bg-gradient-to-r from-[#2B60EB] via-[#A73FC1] to-[#F5701E] bg-clip-text text-transparent">
          Select Your Grade Level
        </span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {grades.map((grade) => (
          <Button
            key={grade.id}
            onClick={() => handleGradeSelect(grade.id)}
            variant={selectedGradeId === grade.id ? 'default' : 'outline'}
            className={`h-16 relative overflow-hidden ${
              selectedGradeId === grade.id ? 'text-white' : ''
            }`}
          >
            {selectedGradeId === grade.id && (
              <span
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
                }}
              />
            )}
            <span className="relative z-10">{grade.grade_level}</span>
          </Button>
        ))}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Button
        onClick={handleStartExam}
        disabled={!selectedGradeId || loading}
        className="hover:scale-105 text-white rounded-xl px-8 py-3 text-lg border-none sm:py-5 w-full"
        style={{
          background:
            'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
        }}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          'Start Assessment'
        )}
      </Button>
    </div>
  );
};

export default GradeSelector;
