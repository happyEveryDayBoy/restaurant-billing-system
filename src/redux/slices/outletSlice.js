import { createSlice } from "@reduxjs/toolkit";
import outletData from "../../data/outlet.json"

const outletSlice = createSlice({
    name: "outlet",
    initialState: {
        outlet: outletData,
    },
})

export const { setOutlets } = outletSlice.actions;
export default outletSlice.reducer;