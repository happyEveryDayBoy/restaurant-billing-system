import { useReactToPrint } from 'react-to-print';
import { useFocus } from "../../hooks/useFocus";
import React, { useState, useEffect, useRef } from "react";

import BillPrint from '../bill_print/BillPrint';

import {ReactComponent as PrintSVG} from "../../static/icons/printer.svg";
import getFormattedDate from '../../helpers/getFormattedDate';
import { emptyIntervalSales } from '../../redux/slices/dailySalesSlice';
import { useDispatch } from 'react-redux';
function Table(props) {
    const { salesDetails, fromDate, toDate } = props;
    const dispatch = useDispatch();
    
    const [itemCodeInputRef, setItemCodeInputRefFocus] = useFocus();
    
    let printableRef = useRef();
    
    const [rows, initRow] = useState(salesDetails);
    const [billTotal, setBillTotal] = useState(null);
    const [billQuantity, setBillQuantity] = useState(0);

    let keepButtonsDisabled = rows && rows.length === 1 && (rows[0].item_code == null || rows[0].item_code === "");

    const handleBillPrint = useReactToPrint({
        content: () => printableRef.current,
        onAfterPrint: () => {
            if (fromDate === toDate && toDate === getFormattedDate()) {
                dispatch(emptyIntervalSales())
            }
        }
    })

    useEffect(() => {
        let amountSum = 0;
        let qtySum = 0;
        rows && rows.map(item => {
            amountSum += Number.parseFloat(item.amount);
            qtySum += Number.parseInt(item.quantity);

            return 0;
        })

        setBillTotal(amountSum);
        setBillQuantity(qtySum);
    }, [rows])

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
                e.preventDefault();
                !keepButtonsDisabled && handleBillPrint(e);
            }
		});
	}, []);

    useEffect(() => {
        initRow(salesDetails);
    }, [salesDetails])

    return (
        rows && rows.length > 0 ?
        <div id='itemsTable' className='bg-light p-3 mt-4 rounded'>
            {( <div className="table-responsive" style={{ maxHeight: "400px" }}>
                <table className="table mb-0">
                    <thead className="border-bottom position-sticky top-0">
                        <tr className="">
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Item Code</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal w-25">Item Name</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Quantity</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Price</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Amount</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal"></th>
                        </tr>
                    </thead>
                    <tbody className="overflow-scroll table-white">
                        {
                            rows && rows.map((rowsData, index) => {
                                console.log(rowsData.items);
                                const { id, item_code, item_name, price, quantity, amount } = rowsData;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                id={"itemCode" + id}
                                                type="text"
                                                defaultValue={item_code}
                                                name={"itemCode" + id}
                                                className={"form-control"} placeholder="Item Code"
                                                autoFocus={true} required ref={itemCodeInputRef}
                                                autoComplete="off"
                                                disabled
                                            />
                                        </td>
                                        <td>
                                        <input
                                            id={"itemName" + id}
                                            type="text"
                                            defaultValue={item_name}
                                            name={"itemName" + id}
                                            className="form-control" placeholder="Item Name" required disabled
                                        />
                                        </td>
                                        <td>
                                        <input
                                            id={"quantity" + id}
                                            type="number"
                                            value={quantity}
                                            name={"quantity" + id}
                                            className="form-control" placeholder="Quantity"
                                            min={1} 
                                            disabled
                                            required
                                        />
                                        </td>
                                        <td>
                                            <input
                                                id={"price" + id}
                                                type="number"
                                                value={price}
                                                name={"price" + id}
                                                className="form-control" placeholder="Price"
                                                min={1}
                                                disabled={true} required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                id={"amount" + id}
                                                type="number"
                                                value={amount}
                                                name={"amount" + id}
                                                className="form-control" placeholder="Amount"
                                                min={1}
                                                disabled={true} required
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>) }
            <table className="table">
                <tfoot className="position-sticky bottom-0 table-light">
                    <tr>
                        <td></td>
                        <td><span className='float-end clr-dark-gray'>Total</span></td>
                        <td>
                            <div className='d-flex bg-white border py-2 px-3 rounded-2 clr-dark-gray'>
                                <p className='my-auto'>{ Number.parseInt(billQuantity) }</p>
                            </div>
                        </td>
                        <td></td>
                        <td>
                            <div className='d-flex bg-white border py-2 px-3 rounded-2'>
                                <p className='my-auto'>
                                    <span>&#8377; {Number.parseFloat(billTotal)}/-</span>
                                </p>
                            </div>
                        </td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            <div className="position-fixed end-0 bottom-0 bg-white mb-3 pb-3 me-3 pe-3">
                <button className="me-2 btn bg-blue-20 clr-dark-blue" disabled={keepButtonsDisabled} onClick={handleBillPrint}>Print <PrintSVG/></button>
            </div>

            <div className="d-none">
                <BillPrint items={rows} billTotal={billTotal} billQuantity={billQuantity} ref={printableRef} fromDate={fromDate} toDate={toDate} billType="sales" />
            </div>
        </div> : <div className="mt-5 clr-dark-gray">No sales recorded between {fromDate} to {toDate}</div>
    );
}

export default Table;
