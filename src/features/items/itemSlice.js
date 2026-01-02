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

            /**
             * This is a prepare state or pre-action factory use to build the payload before the reducer update the state
             * @param {*} param0 
             * @returns 
             */
            prepare({name, unitPrice, qty}) { 
                return {
                    payload: {
                        id: nanoid(), //nanoid() avoid bugs when deleting/reordering
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

        updateQty: (state, action) => {
            const {id , qty} = action.payload
            const item = state.list.find(p => p.id === id)
            if (item) {
                item.qty = Math.max(1, qty);
            }
        },

        incrementQty: (state, action) => {
            const id = action.payload;
            const item = state.list.find(p => p.id === id);

            if(item) {
                item.qty += 1
            }
        },

        decrementQty: (state, action) => {
            const id = action.payload;
            const item = state.list.find(p => p.id === id);

            if(item) {
                item.qty = Math.max(1, item.qty - 1);
            }
        }

    }
});

export const { addItem, removeItem, incrementQty, decrementQty } = itemSlice.actions


export default itemSlice.reducer;