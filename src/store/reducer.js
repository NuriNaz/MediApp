import { configureStore } from '@reduxjs/toolkit';
import customizationReducer from './customizationReducer';
import api from './api';

export const store = configureStore({
    reducer: {
        customization: customizationReducer,
        api: api
    }
});
