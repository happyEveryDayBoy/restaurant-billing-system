import "../nav/nav.css";

import Table from "./TableRows";
import { db } from "../../db";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getFormattedDate from "../../helpers/getFormattedDate";

export default function NewBillTab() {
    const isNavOpen = useSelector(state => state.navbarState);
    const outletInfo = useSelector(state => state.outletInfo.outlet)
    const [ billNumber, setBillNumber ] = useState();

    async function getNewBillNumber() {
        try {
            const bill = await db.bills.where("created").aboveOrEqual(new Date().setHours(0,0,0,0)).last();
            if (!bill) return 1000;

            const currentBillNumber = bill.bill_no;
            return Number.parseInt(currentBillNumber)+1;
        } catch(error) {
            return null;
        }
    }

    const setNewBillNumber = async () => {
        setBillNumber(await getNewBillNumber());
    }

    useEffect(() => {
        setNewBillNumber();
    }, [])

    return (
        <section className={isNavOpen ? "p-4 mr-nav-left transition-300ms" : "p-4 transition-300ms"}>
            <div className="d-flex justify-content-between">
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Bill No. </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{billNumber}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Outlet Name </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{ outletInfo.outlet_name }</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Outlet No. </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.outlet_no}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Server Name</span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.server_name}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Table Name</span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.table_name}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Date</span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{getFormattedDate(new Date(), "dd-mm-yyyy")}</span>
                </div>
            </div>
            <Table billNumber={billNumber} setNewBillNumber={setNewBillNumber} />
        </section>
    );
}