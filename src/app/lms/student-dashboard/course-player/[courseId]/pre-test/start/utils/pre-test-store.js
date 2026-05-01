"use client";

// Store pre-test data in localStorage until API is ready
export const preTestStore = {

  saveAnswer: (courseId, questionId, answer) => {
    const key = `pretest_${courseId}`;
    const preTestData = JSON.parse(localStorage.getItem(key) || "{}");
  
    preTestData.answers = {
      ...preTestData.answers,
      [questionId]: answer,
    };
  
    localStorage.setItem(key, JSON.stringify(preTestData));
  },
  

  savePreTestProgress: (courseId, data) => {
    const key = `pretest_${courseId}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString(),
      })
    );
  },

  getPreTestProgress: (courseId) => {
    const key = `pretest_${courseId}`;
    return JSON.parse(localStorage.getItem(key) || "{}");
  },

  clearPreTestProgress: (courseId) => {
    const key = `pretest_${courseId}`;
    localStorage.removeItem(key);
  },
};
