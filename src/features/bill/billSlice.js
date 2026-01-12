import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    vatRate: 7,
    vatMode: "INCLUDED",
    serviceRate: 10,
    calculationPreset: "DISC_FIRST",
    currency: "THB",
    splitMode: "EQUAL",
    vatBase: "FOOD_PLUS_SERVICE",
    discount: {
        mode: "NONE",   // "NONE" | "PERCENT" | "FIXED"
        value: 0,       // number (percent e.g. 10, or fixed amount e.g. 200)
        // "BILL" now; later you can add "ITEMS" or "PER_ITEM"
        // optional: cap discount (future)
    }
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
        },

        setVatBase: (state, action) => {
            if (action.payload === "FOOD_ONLY" || action.payload === "FOOD_PLUS_SERVICE"){
                state.vatBase = action.payload;
            }
        },

        setDiscountMode: (state, action) => {
           const m = action.payload;
           if(m === "NONE" || m === "PERCENT" || m === "FIXED") {
                state.discount.mode = m
           }
           if (m === "NONE") state.discount.value = 0;
        },

        setDiscountValue: (state, action) => {
            const v = Number(action.payload);
            state.discount.value = Number.isFinite(v) ? Math.max(0, v) : 0;
        }

    }


});

export const {
    setVatRate,
    setVatMode,
    setServiceRate,
    setCalculationPreset,
    setSplitMode,
    setVatBase,
    setDiscountMode,
    setDiscountValue

} = billSlice.actions;

export default billSlice.reducer;

