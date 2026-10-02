import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
  loading: false,
};

export const fetchAssignments = createAsyncThunk(
  "assignment/fetchAssignments",
  async (teacherId, { rejectWithValue }) => {
    try {
      const db_url = import.meta.env.VITE_FIREBASE_DATABASE_URL;

      const response = await fetch(
        `${db_url}/assignments.json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();

      if (!data) return [];

      const loadedAssignments = [];

      for (const key in data) {
        if (data[key].teacherId === teacherId) {
          loadedAssignments.push({
            id: key,
            ...data[key],
          });
        }
      }

      return loadedAssignments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action) => {
      state.assignments.push(action.payload);
    },

    updateAssignment: (state, action) => {
  const index = state.assignments.findIndex(
    (item) => item.id === action.payload.id
  );

  if (index !== -1) {
    state.assignments[index] = {
      ...state.assignments[index],
      ...action.payload,
    };
  }
},

    deleteAssignment: (state, action) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment.id !== action.payload,
      );
    },
    unlockAssignment(state, action) {
      const assignment = state.assignments.find(
        (item) => item.id === action.payload,
      );

      if (assignment) {
        assignment.unlocked = true;
      }
    },
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
        console.error("Error fetching assignments:", action.payload);
      });
  },
});

export const assignmentActions = assignmentSlice.actions;
export default assignmentSlice.reducer;
