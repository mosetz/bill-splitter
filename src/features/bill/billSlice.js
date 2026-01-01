import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vatRate: 7,
    vatMode: "INCLUDED",
    serviceRate: 10,
    calculationPreset: "Disc_FIRST",
    currency: "THB"
}

export const billSlice = createSlice({
    name: "bill",
    initialState,
    reducers: {

        setVatRate: (state, action) => {
            state.vatRate = action.payload;
        },

        setVatMode: (state, action) => {
            state.vatMode = action.payload;
        },

        setServiceRate: (state, action) => {
            state.serviceRate = action.payload
        },

        setCalculationPreset: (state, action) => {
            state.calculationPreset = action.payload
        }


    }


});

export const {
    setVatRate,
    setVatMode,
    setServiceRate,
    setCalculationPreset

} = billSlice.actions;

export default billSlice.reducer;

