import { createSlice} from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const initialState = {
    list: []
}

export const peopleSlice = createSlice({
    name: "people",
    initialState,
    reducers: {

        addPerson: {
            reducer(state, action){
                state.list.push(action.payload);
            },

            prepare(name){
                return{
                    payload: {
                        id: nanoid(), //nanoid() avoid bugs when deleting/reordering
                        name
                    }
                }
            }
        },

        removePerson: (state, action) => {
            state.list = state.list.filter(p => p.id !== action.payload)
        }

    }
})

export const {addPerson, removePerson} = peopleSlice.actions

export default peopleSlice.reducer