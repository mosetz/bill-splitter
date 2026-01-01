import {configStore} from '@reduxjs/toolkit';

const store = configStore({
    reducer: {
        bill : "billReducer",
        items: "itemReducer",
        people: "peopleReducer"
    }
});

export default store;