// db.js
import Dexie from 'dexie';

export const db = new Dexie('rbs_db');

db.version(1.3).stores({
  bills: '++id, bill_no, created, date', // ', items, amount, status, created, updated,', // Primary key and indexed props
  expenses: 'expense_date',
  sales: "sales_date",
  dailySales: "sales_date"
});


// db.expenses.add({
//   "expense_date": "2023-12-01"
// })
