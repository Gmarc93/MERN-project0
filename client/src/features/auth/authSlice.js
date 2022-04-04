import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user
// user will be passed in from the signup component
export const signup = createAsyncThunk(
  'auth/signup',
  async (user, thunkAPI) => {
    console.log(user);
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/users/signup',
        user
      );
      // console.log(res);

      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }

      return res.data;
    } catch (err) {
      console.log(err.response.data);
      return;
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;
