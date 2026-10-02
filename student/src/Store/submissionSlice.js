import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubmissions = createAsyncThunk(
  "submission/fetchSubmissions",
  async (studentId, { rejectWithValue }) => {
    try {
      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

      const res = await fetch(`${db_url}/submissions.json`);

      if (!res.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await res.json();

      if (!data) return [];

      const submissions = [];

      for (const assignmentId in data) {
        const assignmentSubmissions = data[assignmentId];

        if (!assignmentSubmissions) continue;

        if (assignmentSubmissions[studentId]) {
          submissions.push({
            id: studentId,
            assignmentId,
            ...assignmentSubmissions[studentId],
          });
        }
      }

      return submissions;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const submissionSlice = createSlice({
  name: "submission",

  initialState: {
    submissions: [],
    loading: false,
    error: null,
  },

  reducers: {

    addSubmission(state, action) {
      state.submissions.push(action.payload);
    },

    clearSubmissions(state) {
      state.submissions = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload;
      })

      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const submissionActions = submissionSlice.actions;
export default submissionSlice.reducer;
