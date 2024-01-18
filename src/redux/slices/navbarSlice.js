import { createSlice } from "@reduxjs/toolkit";

const navbarSlice = createSlice({
    name: "navbarSlice",
    initialState: false,
    reducers: {
        toggleNavbar: (state) => {
            console.log(state);
            return !state;
        }
    }
})

export const { toggleNavbar } = navbarSlice.actions;
export default navbarSlice.reducer;