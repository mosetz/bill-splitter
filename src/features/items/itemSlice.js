import { createSlice} from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    list: []
};

export const itemSlice = createSlice({
    name: "items",
    initialState,
    reducers: {
        addItem: {
            reducer(state, action){
                state.list.push(action.payload);
            },

            prepare({name, unitPrice, qty}) {
                return {
                    payload: {
                        id: nanoid(),
                        name,
                        unitPrice,
                        qty,
                        discount: null,
                        splitMode: "SHARED",
                        assignedTo: null,
                    }
                };
            }
        },

        removeItem: (state, action) => {
                state.list = state.list.filter(i => i.id !== action.payload);
        },

    }
});

export const { addItem, removeItem } = itemSlice.actions


export default itemSlice.reducer;