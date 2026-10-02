import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("studentToken") || "",
  studentId: localStorage.getItem("studentId") || "",
  email: localStorage.getItem("studentEmail") || "",
  profile: JSON.parse(localStorage.getItem("studentProfile")) || null,
  isAuthenticated: !!localStorage.getItem("studentToken"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.studentId = action.payload.studentId;
      state.email = action.payload.email;
      state.profile = action.payload.profile;
      state.isAuthenticated = true;

      localStorage.setItem("studentToken", action.payload.token);

      localStorage.setItem("studentId", action.payload.studentId);

      localStorage.setItem("studentEmail", action.payload.email);

      localStorage.setItem(
        "studentProfile",
        JSON.stringify(action.payload.profile),
      );
    },
    updateProfile(state, action) {
      state.profile = {
        ...state.profile,
        ...action.payload,
      };
      localStorage.setItem("studentProfile", JSON.stringify(state.profile));
    },

    logout(state) {
      state.token = "";
      state.studentId = "";
      state.email = "";
      state.profile = null;
      state.isAuthenticated = false;

      localStorage.removeItem("studentToken");
      localStorage.removeItem("studentId");
      localStorage.removeItem("studentEmail");
      localStorage.removeItem("studentProfile");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
