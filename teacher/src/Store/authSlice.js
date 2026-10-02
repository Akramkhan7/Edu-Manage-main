import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || "",
  teacherId: localStorage.getItem("teacherId") || "",
  email: localStorage.getItem("email") || "",
  isAuthenticated: !!localStorage.getItem("token"),
    profile: JSON.parse(localStorage.getItem("profile")) || null,
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      const { token, teacherId, email,profile } = action.payload;

      state.token = token;
      state.teacherId = teacherId;
      state.email = email;
      state.isAuthenticated = true;
      state.profile = profile;

      localStorage.setItem("token", token);
      localStorage.setItem("teacherId", teacherId);
      localStorage.setItem("email", email);
      localStorage.setItem("profile", JSON.stringify(profile));
    },
    updateProfile(state, action) {
      const { name } = action.payload;

      state.profile.name = name;

      localStorage.setItem("profile", JSON.stringify(state.profile));
    },

    logout(state) {
      state.token = "";
      state.teacherId = "";
      state.email = "";
      state.isAuthenticated = false;

      
      localStorage.clear();
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;