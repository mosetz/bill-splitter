import {configureStore} from '@reduxjs/toolkit';
import billReducer from "../features/bill/billSlice"
import itemReducer from '../features/items/itemSlice'
import peopleReducer from '../features/people/peopleSlice'

export const store = configureStore({
    reducer: {
        bill : billReducer,
        items: itemReducer,
        people: peopleReducer
    }
});

