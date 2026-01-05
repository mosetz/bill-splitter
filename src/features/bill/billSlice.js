import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vatRate: 7,
    vatMode: "INCLUDED",
    serviceRate: 10,
    calculationPreset: "DISC_FIRST",
    currency: "THB",
    splitMode: "EQUAL"
}

export const billSlice = createSlice({
    name: "bill",
    initialState,
    reducers: {

        setVatRate: (state, action) => {
            state.vatRate = action.payload;
        },

        setVatMode: (state, action) => {
            if (action.payload === "INCLUDED" || action.payload === "ADDED") {
            state.vatMode = action.payload;
            }
        },

        setServiceRate: (state, action) => {
            state.serviceRate = action.payload
        },

        setCalculationPreset: (state, action) => {
            state.calculationPreset = action.payload
        },
        
        setSplitMode: (state, action) => {
            if (action.payload === "EQUAL" || action.payload === "BY_ITEM"){
                state.splitMode = action.payload;
            }
        }

    }


});

export const {
    setVatRate,
    setVatMode,
    setServiceRate,
    setCalculationPreset,
    setSplitMode

} = billSlice.actions;

export default billSlice.reducer;

