"use client";

import axios from '@/lib/axios';
import { createContext, useContext, useState } from "react";

const PreAssessmentContext = createContext(undefined);

export function PreAssessmentProvider({ children }) {
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [examStarted, setExamStarted] = useState(false);
    const [examCompleted, setExamCompleted] = useState(false);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [questionsPerPage] = useState(5);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });
    const [apiReadyData, setApiReadyData] = useState([]);
    const [examQuestions, setExamQuestions] = useState([]);
    const [examDetails, setExamDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [examReport, setExamReport] = useState(null);

    // Function to fetch exam questions based on examId
    const fetchExamQuestions = async (examId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`/exams/${examId}`);


            // Check if we have valid data
            if (response.data && response.data.data) {
                // Store exam questions
                const examData = response.data.data;
                setExamQuestions(examData?.exam_questions || []);

                // Store other exam details
                setExamDetails({
                    id: examData.id,
                    title: examData.title,
                    description: examData.description,
                    duration: examData.exam_duration_minutes,
                    totalQuestions: examData.total_questions_to_appear,
                    totalScore: examData.total_score,
                    passingScore: examData.passing_score,
                    isRandomized: examData.is_randomized
                });

                return response.data.data;
            } else {
                throw new Error("Invalid exam data received");
            }
        } catch (err) {
            console.error("Error fetching exam questions:", err);
            setError(err.response?.data?.message || "Failed to load exam questions");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Start exam with selected grade and fetch questions
    const startExam = async (gradeId, examId) => {
        try {
            setSelectedGrade(gradeId);
            setLoading(true);
            setError(null);

            if (!examId) {
                throw new Error("No exam ID provided");
            }

            // Fetch exam questions
            const examData = await fetchExamQuestions(examId);

            if (examData) {
                setExamStarted(true);
                return true;
            } else {
                throw new Error("Could not load exam questions");
            }
        } catch (err) {
            console.error("Error starting exam:", err);
            setError(err.message || "Failed to start assessment");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Page navigation
    const nextPage = () => {
        setCurrentPageIndex(prev => prev + 1);
    };

    const previousPage = () => {
        setCurrentPageIndex(prev => Math.max(0, prev - 1));
    };

    // Fix the getCurrentPageQuestions function to use examQuestions state when no parameter is passed
    const getCurrentPageQuestions = (questions = null) => {
        const questionsToUse = questions || examQuestions;
        const startIdx = currentPageIndex * questionsPerPage;
        return questionsToUse.slice(startIdx, startIdx + questionsPerPage);
    };

    // Fix the isLastPage function to use examQuestions state when no parameter is passed
    const isLastPage = (questions = null) => {
        const questionsToUse = questions || examQuestions;
        return (currentPageIndex + 1) * questionsPerPage >= questionsToUse.length;
    };

    // Fix the getTotalPages function to use examQuestions state when no parameter is passed
    const getTotalPages = (questions = null) => {
        const questionsToUse = questions || examQuestions;
        return Math.ceil(questionsToUse.length / questionsPerPage);
    };

    // Save answer in internal format
    const saveAnswer = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Update prepareDataForApi function to match API structure
    const prepareDataForApi = (questions = null) => {
        const questionsToUse = questions || examQuestions;

        const formattedData = questionsToUse.map((question) => {
            const userAnswer = answers[question.id];

            // Skip questions without answers
            if (userAnswer === undefined || userAnswer === null) {
                return null;
            }

            let formattedAnswers = [];

            // Handle different question types
            if (Array.isArray(userAnswer)) {
                // Multiple select questions
                formattedAnswers = userAnswer.map(answerId => {
                    const option = question.exam_question_details.find(opt => opt.id === answerId);
                    return {
                        id: option?.id,
                        ans: option?.answer
                    };
                });
            } else {
                // Single answer questions (true/false or multiple choice)
                if (question.master_exam_question_answer_type_id === 5) {
                    // True/False
                    formattedAnswers = [{
                        id: userAnswer === "True" ?
                            question.exam_question_details.find(opt => opt.answer === "True")?.id :
                            question.exam_question_details.find(opt => opt.answer === "False")?.id,
                        ans: userAnswer
                    }];
                } else {
                    // Single choice
                    const option = question.exam_question_details.find(opt => opt.id === userAnswer);
                    formattedAnswers = [{
                        id: option?.id,
                        ans: option?.answer
                    }];
                }
            }

            return {
                exam_id: question.exam_id,
                question_id: question.id,
                answers: formattedAnswers
            };
        }).filter(item => item !== null); // Remove null items (unanswered questions)

        // Save the formatted data to state
        setApiReadyData(formattedData);

        return formattedData;
    };

    // Update the calculateScore function to match the API data structure
    const calculateScore = (questions = null) => {
        const questionsToUse = questions || examQuestions;

        let correct = 0;
        const total = questionsToUse.length;

        questionsToUse.forEach(question => {
            const userAnswer = answers[question.id];

            if (userAnswer === undefined) {
                // Skip unanswered questions
                return;
            }

            // Find correct answers for this question
            const correctOptions = question.exam_question_details.filter(option => option.is_right_answer);

            if (question.master_exam_question_answer_type_id === 5) {
                // True/False question
                if (userAnswer === "True" && correctOptions.some(opt => opt.answer === "True" && opt.is_right_answer)) {
                    correct++;
                } else if (userAnswer === "False" && correctOptions.some(opt => opt.answer === "False" && opt.is_right_answer)) {
                    correct++;
                }
            } else if (question.master_exam_question_answer_type_id === 3) {
                // Multiple choice - single answer
                if (Array.isArray(userAnswer) && userAnswer.length === 1) {
                    const selectedAnswer = userAnswer[0];
                    if (correctOptions.some(opt => opt.id === selectedAnswer)) {
                        correct++;
                    }
                } else if (!Array.isArray(userAnswer)) {
                    if (correctOptions.some(opt => opt.id === userAnswer)) {
                        correct++;
                    }
                }
            } else if (question.master_exam_question_answer_type_id === 4) {
                // Multiple choice - multiple answers
                if (Array.isArray(userAnswer)) {
                    // Check if user selected all correct answers and no incorrect ones
                    const correctAnswerIds = correctOptions.map(opt => opt.id);
                    const allCorrectSelected = correctAnswerIds.every(id => userAnswer.includes(id));
                    const noIncorrectSelected = userAnswer.every(id => correctAnswerIds.includes(id));

                    if (allCorrectSelected && noIncorrectSelected) {
                        correct++;
                    }
                } else if (correctOptions.length === 1 && correctOptions[0].id === userAnswer) {
                    // Single selection for a question that only has one correct answer
                    correct++;
                }
            }
        });

        const percentage = Math.round((correct / total) * 100);
        setScore({ correct, total, percentage });

        // Prepare API data
        const apiData = prepareDataForApi(questionsToUse);

        // Store grade in localStorage when assessment is completed
        if (selectedGrade) {
            localStorage.setItem("grade", Number(selectedGrade));
        }

        setExamCompleted(true);
    };

    // Replace the submitExam function with this version
    const submitExam = async () => {
        try {
            setLoading(true);
            setError(null);

            // Calculate the score and get the formatted data directly
            const formattedAnswers = prepareDataForExamSubmission();

            if (!formattedAnswers || formattedAnswers.length === 0) {
                setError("No answers to submit");
                return false;
            }

            // Log the actual payload being sent


            // Submit the answers to the API using the formatted data directly
            const response = await axios.post('/exam-report/submit-pre-test', formattedAnswers);


            // Now we can safely calculate score for display (this updates state)
            calculateScore();

            // If successful, fetch and store the report
            if (response.data && response.data.status === "SUCCESS") {
                await fetchExamReport();
            }

            return true;
        } catch (err) {
            console.error("Error submitting exam:", err);
            setError(err.response?.data?.message || "Failed to submit exam");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Add this new helper function to prepare data for API submission
    const prepareDataForExamSubmission = () => {
        const formattedData = examQuestions.map((question) => {
            const userAnswer = answers[question.id];

            // Skip questions without answers
            if (userAnswer === undefined || userAnswer === null) {
                return null;
            }

            let formattedAnswers = [];

            // Handle different question types
            if (Array.isArray(userAnswer)) {
                // Multiple select questions
                formattedAnswers = userAnswer.map(answerId => {
                    const option = question.exam_question_details.find(opt => opt.id === answerId);
                    return {
                        id: option?.id,
                        ans: option?.answer
                    };
                });
            } else {
                // Single answer questions (true/false or multiple choice)
                if (question.master_exam_question_answer_type_id === 5) {
                    // True/False
                    const trueOption = question.exam_question_details.find(opt => opt.answer === "True");
                    const falseOption = question.exam_question_details.find(opt => opt.answer === "False");

                    formattedAnswers = [{
                        id: userAnswer === "True" ? trueOption?.id : falseOption?.id,
                        ans: userAnswer
                    }];
                } else {
                    // Single choice
                    const option = question.exam_question_details.find(opt => opt.id === userAnswer);
                    if (option) {
                        formattedAnswers = [{
                            id: option.id,
                            ans: option.answer
                        }];
                    }
                }
            }

            return {
                exam_id: question.exam_id,
                question_id: question.id,
                answers: formattedAnswers
            };
        }).filter(item => item !== null); // Remove null items (unanswered questions)

        return formattedData;
    };

    // Add a function to fetch the exam report
    const fetchExamReport = async () => {
        if (!examDetails?.id) {
            setError("No exam ID available to fetch report");
            return null;
        }

        try {
            const response = await axios.get(`/exam-report/generate?examId=${examDetails.id}`);


            if (response.data && response.data.status === "SUCCESS") {
                setExamReport(response.data.data);
                return response.data.data;
            } else {
                throw new Error(response.data?.message || "Failed to load report");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            setError(err.response?.data?.message || "Failed to load exam report");
            return null;
        }
    };

    const resetExam = () => {
        setExamStarted(false);
        setExamCompleted(false);
        setCurrentPageIndex(0);
        setAnswers({});
        setScore({ correct: 0, total: 0, percentage: 0 });
        setApiReadyData([]);
        setExamQuestions([]);
        setExamDetails(null);
    };

    // Define the selectGrade function
    const selectGrade = (grade) => {
        setSelectedGrade(grade);
    };

    const value = {
        selectedGrade,
        selectGrade,
        examStarted,
        examCompleted,
        currentPageIndex,
        questionsPerPage,
        nextPage,
        previousPage,
        answers,
        saveAnswer,
        calculateScore,
        score,
        resetExam,
        startExam,
        getCurrentPageQuestions, // No parameters needed when called
        isLastPage, // No parameters needed when called
        getTotalPages, // No parameters needed when called
        apiReadyData,
        prepareDataForApi,
        examQuestions,
        examDetails,
        loading,
        error,
        fetchExamQuestions,
        submitExam,
        examReport,
        fetchExamReport
    };

    return (
        <PreAssessmentContext.Provider value={value}>
            {children}
        </PreAssessmentContext.Provider>
    );
}

export const usePreAssessment = () => {
    const context = useContext(PreAssessmentContext);
    if (context === undefined) {
        throw new Error("usePreAssessment must be used within a PreAssessmentProvider");
    }
    return context;
};