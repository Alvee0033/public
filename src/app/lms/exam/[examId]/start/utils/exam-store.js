"use client";

// Store exam data in localStorage until API is ready
export const examStore = {

  saveAnswer: (examId, questionId, answer) => {
    const key = `exam_${examId}`;
    const examData = JSON.parse(localStorage.getItem(key) || "{}");
  
    examData.answers = {
      ...examData.answers,
      [questionId]: answer,
    };
  
    localStorage.setItem(key, JSON.stringify(examData));
  },
  

  saveExamProgress: (examId, data) => {
    const key = `exam_${examId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString(),
      })
    );
  },

  getExamProgress: (examId) => {
    const key = `exam_${examId}`;
    return JSON.parse(localStorage.getItem(key) || "{}");
  },
};
