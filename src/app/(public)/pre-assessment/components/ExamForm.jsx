'use client';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';
import { usePreAssessment } from '../context/PreAssessmentContext';

const ExamForm = () => {
  const {
    currentPageIndex,
    nextPage,
    previousPage,
    answers,
    saveAnswer,
    selectedGrade,
    submitExam,
    getCurrentPageQuestions,
    isLastPage,
    getTotalPages,
    examQuestions,
    examDetails,
    loading,
    error,
  } = usePreAssessment();

  const [validationError, setValidationError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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
          <p className="text-red-500 mb-2">Error loading exam questions</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="text-center">
        <p>No questions available for this exam.</p>
      </div>
    );
  }

  // Function to determine question type and render appropriate component
  const renderQuestion = (question, index) => {
    // Check question type based on master_exam_question_answer_type_id
    // 3: Multiple choice, 4: Text input, 5: True/False
    const questionType = question.master_exam_question_answer_type_id;

    switch (questionType) {
      case 3: // Multiple choice - Single answer
        if (
          question.exam_question_details &&
          question.exam_question_details.length > 0
        ) {
          return (
            <div
              key={question.id}
              className="mb-6 p-4 border border-gray-200 rounded-lg"
            >
              <h3 className="font-medium text-lg mb-3">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-2">
                {question.exam_question_details.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 p-2"
                  >
                    <input
                      type="radio"
                      id={`question_${question.id}_option_${option.id}`}
                      name={`question_${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => saveAnswer(question.id, option.id)}
                      className="h-4 w-4 border-gray-300 focus:ring-primary"
                    />
                    <label
                      htmlFor={`question_${question.id}_option_${option.id}`}
                      className="text-sm font-medium text-gray-900"
                    >
                      {option.answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;
      case 4: // Multiple choice - Multiple Answer
        if (
          question.exam_question_details &&
          question.exam_question_details.length > 0
        ) {
          // Since the API structure shows these as multiple choice with single answer in practice
          return (
            <div
              key={question.id}
              className="mb-6 p-4 border border-gray-200 rounded-lg"
            >
              <h3 className="font-medium text-lg mb-3">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-2">
                {question.exam_question_details.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 p-2"
                  >
                    <input
                      type="radio"
                      id={`question_${question.id}_option_${option.id}`}
                      name={`question_${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => saveAnswer(question.id, option.id)}
                      className="h-4 w-4 border-gray-300 focus:ring-primary"
                    />
                    <label
                      htmlFor={`question_${question.id}_option_${option.id}`}
                      className="text-sm font-medium text-gray-900"
                    >
                      {option.answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;
      case 5: // True/False
        return (
          <div
            key={question.id}
            className="mb-6 p-4 border border-gray-200 rounded-lg"
          >
            <h3 className="font-medium text-lg mb-3">
              {index + 1}. {question.question}
            </h3>
            <div className="flex space-x-4 justify-center">
              {question.exam_question_details.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`question_${question.id}_option_${option.id}`}
                    name={`question_${question.id}`}
                    value={option.answer}
                    checked={answers[question.id] === option.answer}
                    onChange={() => saveAnswer(question.id, option.answer)}
                    className="h-4 w-4 border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor={`question_${question.id}_option_${option.id}`}
                    className="text-sm font-medium text-gray-900"
                  >
                    {option.answer}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
    }

    // Default fallback
    return (
      <div
        key={question.id}
        className="mb-6 p-4 border border-gray-200 rounded-lg"
      >
        <h3 className="font-medium text-lg mb-3">
          {index + 1}. {question.question}
        </h3>
        <p className="text-red-500">Unsupported question type</p>
      </div>
    );
  };

  // Get current page questions using the API data
  const currentQuestions = getCurrentPageQuestions();
  const totalPages = getTotalPages();
  const isLastPageOfQuestions = isLastPage();

  // Check if all questions on the current page are answered
  const allQuestionsAnswered = () => {
    return currentQuestions.every(
      (question) =>
        answers[question.id] !== undefined && answers[question.id] !== null
    );
  };

  // Next page handler with validation
  const handleNextPage = async () => {
    if (!allQuestionsAnswered()) {
      setValidationError('Please answer all questions before proceeding.');
      return;
    }

    setValidationError(null);

    if (isLastPageOfQuestions) {
      setSubmitting(true);
      try {
        const result = await submitExam();
      } catch (error) {
        console.error('Error submitting exam:', error);
      } finally {
        setSubmitting(false);
      }
    } else {
      nextPage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {examDetails?.title || 'Pre-Assessment'}
              {examDetails?.duration && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({examDetails.duration} minutes)
                </span>
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Page {currentPageIndex + 1} of {totalPages}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${((currentPageIndex + 1) / totalPages) * 100}%`,
                background:
                  'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
              }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {currentQuestions.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {validationError && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {validationError}
            </div>
          )}

          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={previousPage}
              disabled={currentPageIndex === 0}
              className="relative overflow-hidden text-white"
              style={{
                background:
                  'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
              }}
            >
              Previous Page
            </Button>

            <Button
              onClick={handleNextPage}
              disabled={!allQuestionsAnswered() || submitting}
              className={`relative overflow-hidden text-white ${!allQuestionsAnswered() || submitting ? 'opacity-70' : ''
                }`}
              style={{
                background:
                  'linear-gradient(90deg, #2B60EB 0%, #A73FC1 50%, #F5701E 100%)',
              }}
            >
              {isLastPageOfQuestions ? (
                submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Complete Assessment'
                )
              ) : (
                'Next Page'
              )}
            </Button>
          </div>

          {!allQuestionsAnswered() && (
            <p className="text-amber-600 text-xs w-full text-right">
              Answer all questions to proceed (
              {
                currentQuestions.filter((q) => answers[q.id] === undefined)
                  .length
              }{' '}
              remaining)
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExamForm;
