import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import answerReducer from "./features/answerSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    answers: answerReducer,

  },
});
