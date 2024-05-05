"use client"
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice.js'

const store = configureStore({
    reducer: {
        auth : authReducer,
    },
    devTools: false,
});

export default store;