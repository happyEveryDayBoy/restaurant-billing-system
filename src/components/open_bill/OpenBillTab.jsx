import "../nav/nav.css"


import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useFocus } from "../../hooks/useFocus";
import Table from "./TableRows";
import { db } from "../../db";
import NotificationToast from "../toast/NotificationToast";
import getFormattedDate from "../../helpers/getFormattedDate";

export default function OpenBillTab() {
    const isNavOpen = useSelector(state => state.navbarState);
    const outletInfo = useSelector(state => state.outletInfo.outlet)

    const [searchBillValueInputRef, setSearchBillValueInputRefFocus] = useFocus()

    const [toastInfo, setToastInfo] = useState({
        "show": false,
        "message": undefined,
        "type": undefined
    })
    const [searchBillValue, setSearchBillValue] = useState("");
    const [openBillDate, setOpenBillDate] = useState(getFormattedDate());
    const [billDetails, setBillDetails] = useState(null);

    const clearSearchBillValue = () => {
        setSearchBillValue("");
        searchBillValueInputRef.current.value = "";
    }

    useEffect(() => {
        async function getBillDetails() {
            if (searchBillValue) {
                const billNumber = Number.parseInt(searchBillValue);
                const bill = await db.bills.where({bill_no: billNumber, date: openBillDate}).first();
                // console.log(searchBillValue, bill);
                return bill;
            }

            return null;
        }
        getBillDetails().then(result => {
            setBillDetails(result)
        }).catch(e => setBillDetails(null));
    }, [searchBillValue, openBillDate])

    const toggleToastShow = () => {
        setToastInfo({
            ...toastInfo,
            show: !toastInfo.show
        })
    }

    return (
        <section className={isNavOpen ? "p-4 mr-nav-left transition-300ms" : "p-4 transition-300ms"}>
            <div className="d-flex justify-content-between">
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span htmlFor="bill_no" className="clr-gray">Bill No. </span>
                    <input type="number" className="py-2 rounded-3 clr-dark-gray form-control" id="bill_no" placeholder="Enter Bill No." value={searchBillValue} onChange={(e) => setSearchBillValue(e.target.value || "")} ref={searchBillValueInputRef} autoFocus />
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span htmlFor="bill_date" className="clr-gray">Date </span>
                    <input type="date" className="py-2 rounded-3 clr-dark-gray form-control" id="bill_date" placeholder="Enter Bill Date" value={openBillDate} onChange={(e) => setOpenBillDate(e.target.value || getFormattedDate())} />
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
                {/* <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Table Name</span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.table_name}</span>
                </div> */}
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1 position-relative">
                    <span className="clr-gray">Status</span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray text-capitalize circle-ellipsis">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="10" viewBox="0 0 9 10" fill="none">
                            <circle cx="4.5" cy="5" r="4.5" fill={billDetails && billDetails["status"] === "pending" ? "#FF9401" : "#198754"}/>
                        </svg>
                        <span className="ms-2">{billDetails ? billDetails["status"] : "Status"}</span>
                    </span>
                </div>
            </div>
            { (billDetails && 
                <Table billId={billDetails.id} billItems={billDetails.items} billNo={searchBillValue} billStatus={billDetails["status"]} bill_created_at={billDetails["created"]} billDate={billDetails["date"]} clearSearchBillValue={clearSearchBillValue} setToastInfo={setToastInfo} />) || 
                <div className="mt-4 clr-dark-gray">Please Enter a valid Bill Id to continue</div> }

{ toastInfo["show"] && <NotificationToast message={toastInfo["message"]} type={toastInfo["type"]} delay={2000} toggleToastShow={toggleToastShow} /> }
        </section>
    );
}