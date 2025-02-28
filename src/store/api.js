import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from 'Constants/API';
import axios from 'axios';

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('Token');

export const punched = createAsyncThunk('punched', async () => {
    const URL = API.PUNCHIN;
    try {
        const response = await axios.post(
            URL,
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (response.status === 201) {
            return response;
        }
    } catch (err) {
        console.log(err);
        return err;
    }
});

export const api = createSlice({
    name: 'api',
    initialState: {
        punchin: [],
        loading: false,
        error: null,
        searchData: []
    },
    reducers: {},
    extraReducers: {
        [punched.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [punched.fulfilled]: (state, action) => {
            state.loading = false;
            state.punchin.push(action.payload);
        },
        [punched.rejected]: (state, action) => {
            state.loading = false;
            state.users = action.payload;
        }
    }
});

// Action creators are generated for each case reducer function
export const {} = api.actions;

export default api.reducer;
