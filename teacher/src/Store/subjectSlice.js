import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchSubjects = createAsyncThunk(
  "subject/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

      const res = await fetch(`${db_url}/subjects.json`);

      if (!res.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await res.json();

      if (!data) return [];

      const loadedSubjects = [];

      for (const key in data) {
        loadedSubjects.push({
          id: key,
          ...data[key],
        });
      }

      return loadedSubjects;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const subjectSlice = createSlice({
  name: "subject",

  initialState: {
    subjects: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })

      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default subjectSlice.reducer;