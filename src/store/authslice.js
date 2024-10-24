
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};
export const checkAuth = createAsyncThunk('auth/getUser', async ({userId, sessionId, token, clientId}, {rejectWithValue}) => {
  const response = await fetch(`http://tancatest.me/api/v1/users/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      'session-id': sessionId,
      'Authorization': `Bearer ${token}`,
      'x-client-id': clientId
    },
  }).then(response => response.json())
  .catch(error => {
    console.log(error)
    return rejectWithValue(error)
  })
  return response.data
  
})
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null
      state.isAuthenticated = false
    })
  }
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
