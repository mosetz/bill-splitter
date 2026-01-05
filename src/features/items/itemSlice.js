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
                item.qty = Math.max(1, item.qty - 1); //make sure the qty not less than 1
            }
        },

        /**
         * This reducer function take and id with a person id 
         * First it find an item that match with id 
         */
        assignItemToPerson: (state, action) => {
            const {itemId, personId} = action.payload
            const item = state.list.find((i) => i.id === itemId);
            if (item) {
                item.assignedTo = personId;
            }
        },

        /**
         * This reducer function take id and splitMode that dispatch from a splitMode section in home.jsx
         * It first find the item that match the id and then assign that item with that id with a splitMode "EQUAL" or "BY_ITEM"
         * IF splitMode was set to "BY_ITEM" assign to assignTo with a null.
         */
        setItemSplitMode: (state, action) => {
            const {id, splitMode} = action.payload;
            const item = state.list.find((i) => i.id === id)
            if (item) {
                item.splitMode = splitMode;
                if (splitMode === "SHARED"){
                    state.assignedTo = null;
                }
            }

        }
    }
});

export const { addItem, removeItem, incrementQty, decrementQty, setItemSplitMode, assignItemToPerson } = itemSlice.actions


export default itemSlice.reducer;