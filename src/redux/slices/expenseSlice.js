import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../db";
import getFormattedDate from "../../helpers/getFormattedDate";

const expenseSlice = createSlice({
    name: "expenseSlice",
    initialState: Object.assign({}, {}),
    reducers: {
        addExpense: async (state, expenseInfo) => {
            const x = await db.expenses.put(expenseInfo.payload)

            return expenseInfo.payload;
        }
    }
})

export const { addExpense } = expenseSlice.actions;
export default expenseSlice.reducer; 