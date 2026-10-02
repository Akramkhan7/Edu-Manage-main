import { configureStore } from "@reduxjs/toolkit";
import assignmentReducer from './assignmentSlice';
import authReducer from './authSlice';
import subjectReducer from './subjectSlice';


const store = configureStore({
  reducer: {
    auth : authReducer,
    assignment : assignmentReducer,
    subject: subjectReducer,
  },
})

export default store