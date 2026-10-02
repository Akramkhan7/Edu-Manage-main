import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAssignments",
  async (_, { rejectWithValue }) => {
    try {
      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;
      const res = await fetch(`${db_url}/assignments.json`);
      if (!res.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await res.json();
      const loadedAssignments = [];

      for (const key in data) {
        loadedAssignments.push({
          id: key,
          ...data[key],
        });
      }

      return loadedAssignments;
    } catch (err) {
      return rejectWithValue(err.message); 
    }
  },
);

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const assignmentActions = assignmentSlice.actions;
export default assignmentSlice.reducer;
