import "../nav/nav.css"


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useFocus } from "../../hooks/useFocus";
import Table from "./TableRows";
import { db } from "../../db";

export default function ExpensesTab() {
    const isNavOpen = useSelector(state => state.navbarState);
    const outletInfo = useSelector(state => state.outletInfo.outlet)

    const [searchExpenseDateValueInputRef, setSearchExpenseDateValueInputRefFocus] = useFocus()

    const [searchExpenseDateValue, setSearchExpenseDateValue] = useState(getFormattedDate());
    const [expensesDetails, setExpensesDetails] = useState(null);

    function getFormattedDate(today = new Date()) {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        async function getExpenseDetails() {
            if (searchExpenseDateValue) {
                const expenses = await db.expenses.get(searchExpenseDateValue);
                console.log(expenses);
                return expenses;
            }

            return null;
        }

        getExpenseDetails().then(result => {
            if (result) setExpensesDetails(result);
            else setExpensesDetails([]);
        }).catch(e => setExpensesDetails([]));
    }, [searchExpenseDateValue])

    return (
        <section className={isNavOpen ? "p-4 mr-nav-left transition-300ms" : "p-4 transition-300ms"}>
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-column pe-3 py-2" style={{minWidth: "20%"}}>
                    <span htmlFor="expense_date" className="clr-gray">Date </span>
                    <input type="date" className="py-2 rounded-3 clr-dark-gray form-control" id="expense_date" placeholder="Select Expense Date" value={searchExpenseDateValue} max={getFormattedDate()} onChange={(e) => setSearchExpenseDateValue(e.target.value)} ref={searchExpenseDateValueInputRef} autoFocus />
                </div>
                <div className="d-flex flex-column pe-3 py-2 flex-grow-1" style={{minWidth: "20%"}}>
                    <span className="clr-gray">Outlet Name </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{ outletInfo.outlet_name }</span>
                </div>
                <div className="d-flex flex-column pe-3 py-2" style={{minWidth: "20%"}}>
                    <span className="clr-gray">Outlet No. </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.outlet_no}</span>
                </div>
                <div className="d-flex flex-column pe-3 py-2 position-relative" style={{minWidth: "20%"}}>
                    <button type="submit" className="btn bg-blue-20 clr-dark-blue py-2 mt-auto">Search</button>
                </div>
            </div>
            <Table expenses={expensesDetails} expenses_date={searchExpenseDateValue} />
        </section>
    );
}