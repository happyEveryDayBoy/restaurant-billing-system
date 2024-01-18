import { configureStore } from "@reduxjs/toolkit";
import titleSliceReducer from "./slices/titleSlice";
import navbarSliceReducer from "./slices/navbarSlice";
import itemsSliceReducer from "./slices/itemsSlice";
import outletSliceReducer from "./slices/outletSlice";
import salesSliceReducer from "./slices/salesSlice";
import expenseSliceReducer from "./slices/expenseSlice";
import dailySalesSliceReducer from "./slices/dailySalesSlice";

export const store = configureStore({
    reducer: {
        viewTitle: titleSliceReducer,
        navbarState: navbarSliceReducer,
        foodItems: itemsSliceReducer,
        outletInfo: outletSliceReducer,
        salesInfo: salesSliceReducer,
        expenseInfo: expenseSliceReducer,
        dailySalesInfo: dailySalesSliceReducer,
    },
})

export default store;