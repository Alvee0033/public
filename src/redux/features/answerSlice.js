import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  answers: [],
};

const answerSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    addAnswer: (state, action) => {
      const { exam_id, question_id, answers } = action.payload;
      const existingIndex = state.answers.findIndex(
        (item) => item.exam_id === exam_id && item.question_id === question_id
      );

      if (existingIndex !== -1) {
        state.answers[existingIndex] = { exam_id, question_id, answers };
      } else {
        state.answers.push({ exam_id, question_id, answers });
      }
    },
    removeAnswer: (state, action) => {
      const { exam_id, question_id } = action.payload;
      state.answers = state.answers.filter(
        (item) => item.exam_id !== exam_id || item.question_id !== question_id
      );
    },
    clearAnswers: (state) => {
      state.answers = [];
    },
  },
});

export const { addAnswer, removeAnswer, clearAnswers } = answerSlice.actions;
export default answerSlice.reducer;