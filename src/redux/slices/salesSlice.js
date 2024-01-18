import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../db";
import getFormattedDate from "../../helpers/getFormattedDate";

function filterObjectsWithNonZeroQuantity(inputObject) {
    const filteredObject = {};
  
    for (const key in inputObject) {
      if (inputObject.hasOwnProperty(key) && inputObject[key].hasOwnProperty("quantity") && inputObject[key].quantity !== 0) {
        filteredObject[key] = inputObject[key];
      }
    }
  
    return filteredObject;
  }

const salesSlice = createSlice({
    name: "salesSlice",
    initialState: await db.sales.get(getFormattedDate()) || Object.assign({}, {}),
    reducers: {
        addSales: (state, items) => {
            const payload = items.payload;

            let amountToAdd = 0;
            const itemsToAdd = payload.reduce((result, item) => {
                if (item && item.item_code && item.amount && item.quantity && item.quantity > 0) {
                    result[item.item_code] = item;
                    amountToAdd += item.amount;
                }
                return result;
            }, {})

            if (Object.keys(state).length === 0) {
                const newState = {
                    ...state,
                    sales_date: getFormattedDate(),
                    items: itemsToAdd,
                    amount: (state?.amount || 0) + amountToAdd
                }
                console.log("Setting state as: ",newState);
                db.sales.put(newState);
                return newState;
            } 
            
            else {
                state = JSON.parse(JSON.stringify(state))
                let updatedItems = { ...state.items };
                for (let newItem of payload) {
                    if (newItem.item_code && newItem.quantity && newItem.amount > 0) {
                        const itemToModify = { ...updatedItems[newItem.item_code] }

                        if (newItem?.item_code in updatedItems) {
                            itemToModify.quantity += newItem.quantity;
                            itemToModify.price = newItem.price;
                            updatedItems[newItem.item_code] = itemToModify;
                        } else {
                            updatedItems[newItem.item_code] = newItem
                        }
                    }
                }
                
                console.info("Initial state is: ", state)
                const newState = {...state, items: updatedItems, amount: (state?.amount || 0) + amountToAdd};
                console.log("Setting state as: ", newState);
                db.sales.put(newState);
                return newState
            }
        },
        updateSalesOnCancel: (state, items) => {
            const payload = items.payload;

            let amountToDeduct = payload.amount;

            console.log(filterObjectsWithNonZeroQuantity, amountToDeduct);

            // if (Object.keys(state).length === 0) {
            //     const newState = {
            //         ...state,
            //         sales_date: getFormattedDate(),
            //         items: itemsToAdd,
            //         amount: state?.amount - amountToDeduct
            //     }
            //     console.log("Setting state as: ",newState);
            //     db.sales.put(newState);
            //     return newState;
            // } 
            
            // else {
                state = JSON.parse(JSON.stringify(state))
                let updatedItems = { ...state.items };
                for (let newItem of payload.items) {
                    const itemToModify = { ...updatedItems[newItem.item_code] }
                    itemToModify.quantity -= newItem.quantity;
                    itemToModify.price = newItem.price;

                    updatedItems[newItem.item_code] = itemToModify;
                }

                updatedItems = filterObjectsWithNonZeroQuantity(updatedItems);
                
                console.info("Initial state is: ", state)
                const newState = {...state, items: updatedItems, amount: state?.amount - amountToDeduct};
                console.log("Setting state as: ", newState);
                db.sales.put(newState);
                return newState
            // }
        }
    }
})

export const { addSales, updateSalesOnCancel } = salesSlice.actions;
export default salesSlice.reducer;