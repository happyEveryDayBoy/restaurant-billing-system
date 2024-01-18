import { useEffect } from 'react';
import { utils, writeFileXLSX } from 'xlsx';

import getSalesDetails from '../helpers/getSalesDetails';
import getFormattedDate from '../helpers/getFormattedDate';
import getExpenseDetails from '../helpers/getExpensesDetails';

async function generateXLSX(salesData, expenseData, file_name="report") {
    const sales_ws = utils.json_to_sheet(salesData);
    const expenses_ws = utils.json_to_sheet(expenseData);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, sales_ws, "Sales");
    utils.book_append_sheet(wb, expenses_ws, "Expenses");

    writeFileXLSX(wb, file_name + ".xlsx");
}

export const useReportDownload = () => {
    useEffect(() => {
        const monthlyFunction = () => {
            console.log('Function called on the 2nd of every month');
            downloadReport();
            updateLastDownloadDate();
        };

        const updateLastDownloadDate = () => {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
            localStorage.setItem('lastDownloadDate', formattedDate);
        };

        const checkAndDownload = () => {
            const currentDate = new Date();
            const dayOfMonth = currentDate.getDate();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Get YYYY-MM-DD

            // if (dayOfMonth === 2 && localStorage.getItem('lastDownloadDate') !== formattedDate) {
            //     monthlyFunction();
            // }
        };

        checkAndDownload();

        return () => { };
    }, []);

    const downloadReport = async (reportStartDate, reportEndDate) => {
        if (reportStartDate && reportEndDate) {
            const fileName = "billing_report_" + reportStartDate + "_to_" + reportEndDate;
            let salesData = await getSalesDetails(reportStartDate, reportEndDate);
            let expenseData = await getExpenseDetails(reportStartDate, reportEndDate);

            salesData && expenseData && generateXLSX(salesData, expenseData, fileName);
        } else {
            const currentDate = new Date()
            let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); 
            
            const fileName = "monthly_report_" + startDate.toLocaleString("default", { month: "long" })
            
            startDate = getFormattedDate(startDate)
            endDate = getFormattedDate(endDate)
            
            let salesData = await getSalesDetails(startDate, endDate);
            let expenseData = await getExpenseDetails(startDate, endDate);

            salesData && expenseData && generateXLSX(salesData, expenseData, fileName);
        }
        return;
    };

    return downloadReport;
}
