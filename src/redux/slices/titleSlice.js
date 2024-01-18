import { createSlice } from "@reduxjs/toolkit";

const titleSlice = createSlice({
    name: "title",
    initialState: "New",
    reducers: {
        setViewTitle: (state, title) => {
            return (state = title.payload)
        }
    }
})

export const { setViewTitle } = titleSlice.actions;
export default titleSlice.reducer;