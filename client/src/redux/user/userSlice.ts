import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    currentUser: any;
    error: string | null;
    loading: boolean;
}

const initialState: UserState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true,
            state.error = null
        },
        updateSuccess: (state, action: PayloadAction<any>) => {
            state.currentUser = action.payload;
            state.loading = false,
            state.error = null
        },
        updateFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, updateFailure, updateStart, updateSuccess } = userSlice.actions

export default userSlice.reducer;