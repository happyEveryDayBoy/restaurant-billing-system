import { useReactToPrint } from 'react-to-print';
import { useFocus } from "../../hooks/useFocus";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import BillPrint from '../bill_print/BillPrint';

import {ReactComponent as SaveSVG} from "../../static/icons/save.svg";
import {ReactComponent as PrintSVG} from "../../static/icons/printer.svg";
import {ReactComponent as ResetSVG} from "../../static/icons/reset.svg";
import {ReactComponent as DeleteSVG } from "../../static/icons/x.svg";

import { db } from '../../db';
import { addExpense } from '../../redux/slices/expenseSlice';
import NotificationToast from '../toast/NotificationToast';

function Table(props) {
    let { expenses, expenses_date } = props;
    const [rows, initRow] = useState([]);

    const [itemCodeInputRef, setItemCodeInputRefFocus] = useFocus()
    const [additemsFormSubmitRef, setAdditemsFormSubmitRef] = useFocus();
    
    const dispatch = useDispatch();
    const foodItems = useSelector(state => state.foodItems)
    
    let printableRef = useRef();

    const [billTotal, setBillTotal] = useState(null);
    const [billQuantity, setBillQuantity] = useState(0);
    const [toastInfo, setToastInfo] = useState({
        "show": false,
        "message": undefined,
        "type": undefined
    })

    const toggleToastShow = () => {
        setToastInfo({
            ...toastInfo,
            show: !toastInfo.show
        })
    }

    let keepButtonsDisabled = rows && rows.length < 1 && (rows[0]?.merchant_name === "" || rows[0]?.expense_name === ""); // rows.length

    const addNewEmptyRow = () => {
        initRow([...rows, {
            id: rows.length+1,
            expense_name: "",
            merchant_name: "",
            quantity: 1,
            price: 0,
            amount: 0,
        }])
    }

    const removeTableRow = (index) => {
        const dataRow = [...rows];
        dataRow.splice(index, 1);

        // if (dataRow.length === 0) dataRow.push({
        //     id: 0,
        //     item_code: '',
        //     quantity: 1,
        //     price: 0,
        //     amount: 0
        // })

        initRow(dataRow);
    }

    const getFoodItemDetails = (itemCodeToSearch) => {
        const foundItem = foodItems.find((item) => item.item_code == itemCodeToSearch);
        if (foundItem === undefined) {
            return null;
        }
        return foundItem;
    }

    const handleFormKeyPress = (e, input_name="") => {
        const key = e.key;
        const targetId = e.target?.id;

        const referencePress = {
            "expense_name": ["merchant_name", null],
            "merchant_name": ["quantity", "expense_name"],
            "quantity": ["price", "merchant_name"],
            "price": [null, "quantity"],
            // "amount": [null, "price"]
        }

        if (e.ctrlKey && key === "Enter") {
            additemsFormSubmitRef.current.click()
        } else if (e.shiftKey === false && key === "Enter" && input_name !== "") {
                
            const nextInputId = referencePress[input_name][0] + (Number.parseInt(targetId.replace(input_name, "")));
            const nextInput = document.getElementById(nextInputId);
            // console.log(nextInputId);
            // console.log(nextInput);
            if (nextInput) nextInput.focus();
            else {
                addNewEmptyRow();
            }
        } else if (key === "Enter" && targetId === "quantity") {
            e.preventDefault();
            setAdditemsFormSubmitRef()
        }
    }

    async function handleBillSave(status = "pending") {
        try {
            const time_now = new Date().getTime();
            dispatch(addExpense({
                expense_date: expenses_date,
                amount: billTotal,
                items: rows,
                updated: time_now,
            }))

            setToastInfo({
                show: true,
                message: `Expense saved successfully.`,
                type: "success"
            })
        } catch (error) {
            setToastInfo({
                show: true,
                message: `Error: ${error}`,
                type: "error"
            })
        }
    }

    const handleBillPrint = useReactToPrint({
        content: () => printableRef.current,
        onAfterPrint: () => {
            handleBillSave("success")
        },
    })

    const handleBillReset = () => {
        initRow([])
        db.expenses.delete(expenses_date);
        setItemCodeInputRefFocus()
    }
    const populateCurrentItemRow = (id, expense_name) => {
        const itemDetails = getFoodItemDetails(expense_name);
        const rowIndex = rows.findIndex(row => row.id === id);

        if (itemDetails) {
            initRow([...rows.splice(0, rowIndex), {...itemDetails, quantity: 1, amount: itemDetails.price, id: rowIndex+1}, ...rows.splice(rowIndex+1)])
            return;
        }
    }

    const updateCurrentRowState = (id, event, to_update) => {
        const rowIndex = rows.findIndex(row => row.id == id);
        let modifiedRow = rows[rowIndex]

        if (to_update === "expense_name") modifiedRow.expense_name = event.target.value;
        else if (to_update === "merchant_name") modifiedRow.merchant_name = event.target.value;

        // console.log(modifiedRow);

        initRow([...rows.splice(0, rowIndex), modifiedRow, ...rows.splice(rowIndex+1)]);

        // console.log(rows);
    } 

    const updateRowAmount = (id, value, changed) => {
        const rowIndex = rows.findIndex(row => row.id == id);
        let modifiedRow = rows[rowIndex]

        let price = modifiedRow.price || null;
        let quantity = modifiedRow.quantity || 1;

        value = Number.parseInt(value)

        let amount;
        if (changed === 'quantity') {
            amount = value * price;
            modifiedRow = {...modifiedRow, quantity: value, amount}
        } else {
            amount = value * quantity;
            modifiedRow = {...modifiedRow, price: value, amount: amount}
        }

        initRow([...rows.splice(0, rowIndex), modifiedRow, ...rows.splice(rowIndex+1)]);
    }

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
        // console.log(expenses);
        if (expenses && expenses?.items) initRow(expenses.items)
        else initRow([])
    }, [expenses])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "PrintScreen") {
                e.preventDefault();
                !keepButtonsDisabled && handleBillPrint(e);
            } else if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
                e.preventDefault();
                !keepButtonsDisabled && handleBillSave("pending");
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [keepButtonsDisabled]);

    return (
        rows.length > 0 ?
        <div id='itemsTable' className='bg-light p-3 mt-4 rounded'>
            {( <div className="table-responsive" style={{ maxHeight: "400px" }}>
                <table className="table mb-0">
                    <thead className="border-bottom position-sticky top-0">
                        <tr className="">
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Expense Name</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal w-25">Merchant Name</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Quantity</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Price</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal">Amount</th>
                            <th className="bg-gradient bg-light clr-dark-gray fw-normal"></th>
                        </tr>
                    </thead>
                    <tbody className="overflow-scroll table-white">
                        {
                            rows && rows.map((rowsData, index) => {
                                // console.log(rowsData);
                                const { id, expense_name, merchant_name, price, quantity, amount } = rowsData;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                id={"expense_name" + id}
                                                type="text"
                                                defaultValue={expense_name}
                                                onChange={(event) => updateCurrentRowState(id, event, "expense_name")}
                                                onKeyDown={(e) => handleFormKeyPress(e, "expense_name")}
                                                name={"expense_name" + id}
                                                className={"form-control"} placeholder="Expense Name"
                                                autoFocus={true} required ref={itemCodeInputRef}
                                                // list="list-items"
                                                autoComplete="off"
                                            />
                                            {/* <datalist id="list-items" className="bg-light">
                                                {foodItems.map(item => {
                                                    return <option key={item.item_code} value={item.item_code}>{item.item_code}</option>
                                                })}
                                            </datalist> */}
                                        </td>
                                        <td>
                                        <input
                                            id={"merchant_name" + id}
                                            type="text"
                                            defaultValue={merchant_name}
                                            name={"merchant_name" + id}
                                            onChange={(event) => updateCurrentRowState(id, event, "merchant_name")}
                                            onKeyDown={(e) => handleFormKeyPress(e, "merchant_name")}
                                            className="form-control" placeholder="Merchant Name" required
                                        />
                                        </td>
                                        <td>
                                        <input
                                            id={"quantity" + id}
                                            type="number"
                                            value={quantity}
                                            onChange={(event) => updateRowAmount(id, event.target.value, 'quantity')}
                                            onKeyDown={(e) => handleFormKeyPress(e, "quantity")}
                                            name={"quantity" + id}
                                            className="form-control" placeholder="Quantity"
                                            min={1}
                                            required
                                        />
                                        </td>
                                        <td>
                                            <input
                                                id={"price" + id}
                                                type="number"
                                                value={price}
                                                onChange={(event) => updateRowAmount(id, event.target.value, 'price')}
                                                onKeyDown={(e) => handleFormKeyPress(e, "price")}
                                                name={"price" + id}
                                                className="form-control" placeholder="Price"
                                                min={1}
                                                required
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
                                        <td className={" align-middle"}>
                                            <DeleteSVG className='cursor-pointer delete-btn-stroke-danger' onClick={() => removeTableRow(index)} />
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
                        <td>
                            <button
                                id="addItem"
                                className="btn bg-blue-20 clr-dark-blue"
                                type="submit" ref={additemsFormSubmitRef}
                                onClick={addNewEmptyRow}
                            >
                                Add Item +
                            </button>
                        </td>
                        <td><span className='float-end clr-dark-gray'>Total</span></td>
                        <td>
                            <div className='d-flex bg-white border py-2 px-3 rounded-2 clr-dark-gray'>
                                {/* <p className='my-auto'>Qty: </p> */}
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
                <button className="me-2 btn btn-primary" disabled={keepButtonsDisabled} onClick={() => handleBillSave()}>Save <SaveSVG/></button>
                <button className="me-2 btn bg-blue-20 clr-dark-blue" disabled={keepButtonsDisabled} onClick={handleBillPrint}>Print <PrintSVG/></button>
                <button className="me-2 btn bg-gray-10 clr-dark-gray" disabled={keepButtonsDisabled} onClick={handleBillReset}>Reset <ResetSVG/></button>
            </div>

            <div className="d-none">
                <BillPrint items={rows} billTotal={billTotal} billQuantity={billQuantity} expense_date={expenses_date} billType="expense" ref={printableRef} />
            </div>
            { toastInfo["show"] && <NotificationToast message={toastInfo["message"]} type={toastInfo["type"]} delay={2000} toggleToastShow={toggleToastShow} /> }
        </div> : 
        <>
            <div className="mt-5 clr-dark-gray">No expenses recorded today. Let's keep track of your expenses.</div>
            <button id="addItem" className="btn bg-blue-20 clr-dark-blue mt-2" type="submit" ref={additemsFormSubmitRef} onClick={addNewEmptyRow}>Add Item +</button>
        </>
    );
}

export default Table;
