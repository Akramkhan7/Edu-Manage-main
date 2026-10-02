import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import assignmentReducer from "./assignmentSlice";
import subjectReducer from "./subjectSlice";
import submissionReducer from "./submissionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    assignment : assignmentReducer,
     subject: subjectReducer,
     submission: submissionReducer,
  },
});

export default store;