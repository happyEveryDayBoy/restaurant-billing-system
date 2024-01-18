import { db } from "../db";
import getFormattedDate from "./getFormattedDate";

export default async function getSalesDetails(fromDate, toDate) {
    if (fromDate !== undefined && toDate !== undefined) {
        let sales;
        if (fromDate === toDate && toDate === getFormattedDate()) {
            sales = await db.dailySales.where("sales_date").between(fromDate, toDate, true, true).toArray();    
        } else {
            sales = await db.sales.where("sales_date").between(fromDate, toDate, true, true).toArray();
        }
        const salesQuantity = {};
        sales.forEach(day => {
            const items = day.items;

            for (let itemCode in items) {
                if (items.hasOwnProperty(itemCode)) {
                    const quantity = items[itemCode].quantity;
                    salesQuantity[itemCode] = {}
                    salesQuantity[itemCode]["id"] = items[itemCode].id;
                    salesQuantity[itemCode]["item_name"] = items[itemCode].item_name;
                    salesQuantity[itemCode]["price"] = items[itemCode].price;
                    salesQuantity[itemCode]["quantity"] = (salesQuantity[itemCode]["quantity"] || 0) + quantity;
                    salesQuantity[itemCode]["amount"] = salesQuantity[itemCode]["price"] * quantity;
                }
            }
        })

        let rows = []
        for (let itemCode in salesQuantity) {
            rows.push({
                ...salesQuantity[itemCode],
                item_code: itemCode
            });
        }

        return rows;
    }

    return null;
}