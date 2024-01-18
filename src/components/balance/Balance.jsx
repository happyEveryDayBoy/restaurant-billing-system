import "./balance.css"

import expenseImage from "../../static/icons/expense.svg";
import salesImage from "../../static/icons/sales.svg";
import carryOverImage from "../../static/icons/carryover.svg";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import getFormattedDate from "../../helpers/getFormattedDate";
import { db } from "../../db";

export default function BalanceTab() {
	const isNavOpen = useSelector((state) => state.navbarState);
    const salesInfo = useSelector(state => state.salesInfo);

    const [totalExpensesToday, setTotalExpensesToday] = useState(0);
    const [carryOver, setCarryOver] = useState(0);
    
    useEffect(() => {
        async function getExpenseDetails() {
            return await db.expenses.get(getFormattedDate());
        }

        getExpenseDetails().then(result => {
            if (result) setTotalExpensesToday(result.amount);
            else setTotalExpensesToday(0);
        }).catch(e => setTotalExpensesToday(0));
    })

    useEffect(() => {
        if (salesInfo?.amount || totalExpensesToday) {
            setCarryOver(salesInfo.amount - totalExpensesToday);
        }
    }, [salesInfo, totalExpensesToday])

	return (
		<section className={(isNavOpen ? "mr-nav-left ": "") + " p-4 transition-300ms"}>
            <div className="balance-card-container border rounded-3 d-flex p-4 w-100 flex-wrap">
                <div className="balance-card card rounded-3 p-3 flex-grow-1 mx-2">
                    <div className="card-title fs-4 fw-500 d-flex justify-content-between align-items-center">
                        <span className="clr-dark-gray">Total Expenses</span>
                        <img src={expenseImage} alt="" height="32"/>
                    </div>
                    <div className="card-text fs-2 mt-3 fw-500 clr-dark-blue currency-icon">{totalExpensesToday}</div>
                </div>
                <div className="balance-card card rounded-3 p-3 flex-grow-1 mx-2">
                    <div className="card-title fs-4 fw-500 d-flex justify-content-between align-items-center">
                        <span className="clr-dark-gray">Total Sales</span>
                        <img src={salesImage} alt="" height="32"/>
                    </div>
                    <div className="card-text fs-2 mt-3 fw-500 clr-dark-blue currency-icon">{salesInfo?.amount || "NA"}</div>
                </div>
                <div className="balance-card card rounded-3 p-3 flex-grow-1 mx-2">
                    <div className="card-title fs-4 fw-500 d-flex justify-content-between align-items-center">
                        <span className="clr-dark-gray">Total Carryover</span>
                        <img src={carryOverImage} alt="" height="32"/>
                    </div>
                    <div className="card-text fs-2 mt-3 fw-500 clr-dark-blue currency-icon">{carryOver}</div>
                </div>
            </div>
        </section>
	);
}
