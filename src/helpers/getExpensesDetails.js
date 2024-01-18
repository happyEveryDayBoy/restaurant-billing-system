import { db } from "../db";

export default async function getExpenseDetails(fromDate, toDate) {
    let expenseData = [];
    if (fromDate && toDate) {
        const expenses = await db.expenses.where("expense_date").between(fromDate, toDate, true, true).toArray();
        
        for (let expense of expenses) {
            for (let item of expense.items) {
                item["expense_date"] = expense.expense_date;
                expenseData.push(item);
            }
        }

        return expenseData;
    }

    return null;
}
