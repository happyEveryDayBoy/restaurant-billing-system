import { useReactToPrint } from 'react-to-print';
import { useFocus } from "../../src/hooks/useFocus";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import BillPrint from '../../src/components/bill_print/BillPrint';
import { db } from '../../src/db';
import { addSales } from '../../src/redux/slices/salesSlice';
import { addDailySales } from '../../src/redux/slices/dailySalesSlice';

import {ReactComponent as SaveSVG} from "../../static/icons/save.svg";
import {ReactComponent as PrintSVG} from "../../static/icons/printer.svg";
import {ReactComponent as ResetSVG} from "../../static/icons/reset.svg";
import {ReactComponent as DeleteSVG } from "../../static/icons/x.svg";
import NotificationToast from '../../src/components/toast/NotificationToast';
import getFormattedDate from '../../src/helpers/getFormattedDate';
import PrintButton from './PrintButtonn';

function Table(props) {
    const { billNumber, setNewBillNumber } = props;
    const [rows, initRow] = useState([{
        id: 0,
        item_code: '',
        quantity: "",
        price: 0,
        amount: 0
    }]);

    const dispatch = useDispatch();
    const [itemCodeInputRef, setItemCodeInputRefFocus] = useFocus()
    const [additemsFormSubmitRef, setAdditemsFormSubmitRef] = useFocus();
    
    const foodItems = useSelector(state => state.foodItems)
    
    let printableRef = useRef();

    const [toastInfo, setToastInfo] = useState({
        "show": false,
        "message": undefined,
        "type": undefined
    })
    const [billTotal, setBillTotal] = useState(null);
    const [billQuantity, setBillQuantity] = useState(0);

    const toggleToastShow = () => {
        setToastInfo({
            ...toastInfo,
            show: !toastInfo.show
        })
    }

    const addRowTable = (data) => {
        initRow([...rows, data]);
    };

    let keepButtonsDisabled = rows && rows.length === 1 && (rows[0].item_code == null || rows[0].item_code === "");

    const addNewEmptyRow = () => {
        initRow([...rows, {
            id: rows ? rows.length+1 : 0,
            itemCode: null,
            itemName: "",
            quantity: "",
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
    };

    const handleAddNewItemFormSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const { itemCode, itemName, quantity, price, amount } = form;

        if (itemName.value === undefined || itemName.value === "" || itemName.value.length === 0) {
            setItemCodeInputRefFocus();
            return;
        }

        addRowTable({
            itemCode: itemCode.value,
            itemName: itemName.value,
            quantity: quantity.value,
            price: price.value,
            amount: amount.value,
        })

        form.reset();
        setItemCodeInputRefFocus()
    }

    const getFoodItemDetails = (itemCodeToSearch) => {
        const foundItem = foodItems.find((item) => item.item_code == itemCodeToSearch);
        if (foundItem === undefined) {
            return null;
        }
        return foundItem;
    }

    const handleFormKeyPress = (e) => {
        const key = e.key;
        const targetId = e.target?.id;
        
        if (e.ctrlKey && key === "Enter") {
            additemsFormSubmitRef.current.click()
        } else if (e.shiftKey === false && key === "Enter") {
            if (targetId.includes("quantity")) {
                const nextInputId = "itemCode" + (Number.parseInt(targetId.replace("quantity", ""))+1);
                const nextInput = document.getElementById(nextInputId);
                if (nextInput) nextInput.focus();
                else addNewEmptyRow();
            } else if (targetId.includes("itemCode")) {
                const nextInputId = "quantity" + (Number.parseInt(targetId.replace("itemCode", "")));
                const nextInput = document.getElementById(nextInputId);
                nextInput && nextInput.focus();
            }
        } else if (key === "Enter" && targetId === "quantity") {
            e.preventDefault();
            setAdditemsFormSubmitRef()
        }
    }

    async function handleBillSave(status = "pending") {
        try {
            const time_now = new Date().getTime();
            
            let items = [];
            for (let item of rows) {
                console.log(item.item_code, item.quantity);
                if (item.item_code && item.quantity && item.quantity > 0) {
                    items.push(item)
                }
            }
            
            const id = await db.bills.add({
                bill_no: billNumber,
                amount: billTotal,
                items: items,
                status: status,
                created: time_now,
                updated: time_now,
                paid_at: status === "pending" ? null : time_now,
                date: getFormattedDate()
            })

            if (status === "success") {
                dispatch(addSales(rows))
                dispatch(addDailySales(rows))
            }
            
            handleBillReset();
            setToastInfo({
                show: true,
                message: `Bill no: ${billNumber} saved successfully.`,
                type: "success"
            })
        } catch (error) {
            setToastInfo({
                show: true,
                message: `Error: ${error}`,
                type: "error"
            })
        } finally {
            setNewBillNumber();
        }
    }

    const handleBillPrint = useReactToPrint({
        content: () => printableRef.current,
        onAfterPrint: () => handleBillSave("success") && handleBillReset(),
    })

    const handleBillReset = () => {
        if (itemCodeInputRef && itemCodeInputRef.current) itemCodeInputRef.current.value = ""
        // initRow([{
        //     id: 0,
        //     item_name: "",
        //     item_code: undefined,
        //     quantity: 0,
        //     price: 0,
        //     amount: 0
        // }])

        initRow(null);
        setItemCodeInputRefFocus();
        setNewBillNumber();
    }

    const populateCurrentItemRow = (id, itemCode) => {
        const itemDetails = getFoodItemDetails(itemCode);
        const rowIndex = rows.findIndex(row => row.id === id);

        if (itemDetails) {
            initRow([...rows.splice(0, rowIndex), {...itemDetails, quantity: "", amount: itemDetails.price, id: rowIndex+1}, ...rows.splice(rowIndex+1)])
            return;
        }
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
            if (item.item_code && item.quantity) {
                amountSum += Number.parseFloat(item.amount || 0);
                qtySum += Number.parseInt(item.quantity || 0);
            }
        
            return 0;
        })

        setBillTotal(amountSum);
        setBillQuantity(qtySum);
    }, [rows])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "s" || e.key === "S") {
                e.preventDefault();
                !keepButtonsDisabled && handleBillSave("pending");
            } else if (e.key === "p" || e.key === "P") {
                e.preventDefault();
                !keepButtonsDisabled && handleBillPrint(e);
            }
        };
    
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [keepButtonsDisabled, rows]);

    // useEffect(() => {
    //     const handleKeyUp = (e) => {
    //         // console.log(e);
    //         if (e.key === "PrintScreen") {
    //             e.preventDefault();
    //             !keepButtonsDisabled && handleBillPrint(e);
    //         }
    //     };
    
    //     document.addEventListener("keyup", handleKeyUp);
    //     return () => {
    //         document.removeEventListener("keyup", handleKeyUp);
    //     };
    // }, [keepButtonsDisabled]);

    useEffect(() => {
        setNewBillNumber();
    }, [])

    // hack for resetting bill
    useEffect(() => {
        if (rows === null) initRow([{
            id: 0,
            item_name: "",
            item_code: undefined,
            quantity: 0,
            price: 0,
            amount: 0
        }])
    }, [rows])

    return (
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
                                const { id, item_code, item_name, price, quantity, amount } = rowsData;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                id={"itemCode" + id}
                                                type="text"
                                                defaultValue={item_code}
                                                onChange={(event) => populateCurrentItemRow(id, event.target.value)}
                                                onKeyUp={handleFormKeyPress}
                                                name={"itemCode" + id}
                                                className={"form-control"} placeholder="Item Code"
                                                autoFocus={true} required ref={itemCodeInputRef}
                                                list="list-items"
                                                autoComplete="off"
                                            />
                                            <datalist id="list-items" className="bg-light">
                                                {foodItems && foodItems.map(item => {
                                                    return <option key={item.item_code} value={item.item_code}>{item.item_code}</option>
                                                })}
                                            </datalist>
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
                                            onChange={(event) => updateRowAmount(id, event.target.value, 'quantity')}
                                            onKeyUp={handleFormKeyPress}
                                            name={"quantity" + id}
                                            className="form-control" placeholder="Quantity"
                                            min={1} required
                                        />
                                        </td>
                                        <td>
                                            <input
                                                id={"price" + id}
                                                type="number"
                                                value={price}
                                                onChange={(event) => updateRowAmount(id, event.target.value, 'price')}
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
                                        <td className='align-middle'>
                                            <DeleteSVG className='cursor-pointer delete-btn-stroke-danger' onClick={() => removeTableRow(index)} />
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                    
                </table>
            </div>) }
            <table className='table'>
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
                        <td></td>
                        <td>
                            <div className='d-flex bg-white border py-2 px-3 rounded-2 clr-dark-gray'>
                                {/* <p className='my-auto me-2'>Quantity: </p> */}
                                <p className='my-auto'>{ Number.parseInt(billQuantity) }</p>
                            </div>
                        </td>
                        <td></td>
                        <td>
                            <div className='d-flex bg-white border py-2 px-3 rounded-2 float-end w-100' style={{maxWidth: "200px"}}>
                                <p className='my-auto'>
                                    <span>&#8377; {Number.parseFloat(billTotal)}/-</span>
                                </p>
                            </div>
                        </td>
                        <td>
                            <span className="w-100"></span>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="position-fixed end-0 bottom-0 bg-white mb-3 pb-3 pe-3 me-3">
                <button className="me-2 btn btn-primary" disabled={keepButtonsDisabled} onClick={() => handleBillSave("pending")}>Pending <SaveSVG/></button>
                <button className="me-2 btn bg-blue-20 clr-dark-blue" disabled={keepButtonsDisabled} onClick={handleBillPrint}>Print <PrintSVG/></button>
                <button className="me-2 btn bg-gray-10 clr-dark-gray" disabled={keepButtonsDisabled} onClick={handleBillReset}>Reset <ResetSVG/></button>
                <PrintButton/>
            </div>

            <div className="d-none">
                <BillPrint items={rows} billNo={billNumber} billTotal={billTotal} billType="new_bill" ref={printableRef} />
            </div>

            { toastInfo["show"] && <NotificationToast message={toastInfo["message"]} type={toastInfo["type"]} delay={2000} toggleToastShow={toggleToastShow} /> }
        </div>
    );
}

export default Table;
