
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const checkAuth = createAsyncThunk('auth/getUser', async ({ userId, sessionId, token, clientId }, { rejectWithValue }) => {
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
    setUser(response.data);
    return response.data

})
const initialState = {
    user: null,
    user_media: null
};
const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setUserMedia: (state, action) => {
            state.user_media = action.payload;
        },
        logOut: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(checkAuth.rejected, (state) => {
            state.user = null
        })
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload
        })
    }
});

export const { setUser, logOut, setUserMedia } = authSlice.actions;

export default authSlice.reducer;
