import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    isAuth: false,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialValue,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload
            state.isAuth = true
        },
        setLogout: () => ({
            isAuth: false,
            user: null
        }),
    }
})

export const { setLogin, setLogout} = authSlice.actions

export default authSlice.reducer
