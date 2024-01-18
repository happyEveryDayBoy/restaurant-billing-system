import "../../static/css/bill_print.css";

import { forwardRef } from "react";
import { useSelector } from "react-redux";
import getFormattedDate from "../../helpers/getFormattedDate";

const BillPrint = forwardRef((props, ref) => {
    const { billNo, billTotal, billQuantity, items, expense_date, fromDate, toDate, billType } = props;
    const outletInfo = useSelector(state => state.outletInfo.outlet);

	return (
		<div className="container_custom py-5 px-3 text-uppercase" ref={ref}>
			<h1>{outletInfo["outlet_name"]}</h1>
			<div className="address mb-1">
				<p className="mb-0">{outletInfo["outlet_address_1"]}</p>
				<p className="mb-0">{outletInfo["outlet_address_2"]}</p>
			</div>
			<div className="bill-details mb-3">
				{
					billType === "new_bill" || billType === "open_bill" ? 
						<div className="text-center">
							<span className="fw-bold me-3">{billNo || "BILL_NO"}</span>
							<span className="me-3">{getFormattedDate(new Date(), "dd-mm-yyyy HH:MM") || "dd/mm/yyyy"}</span>
							<span className="me-3">#01</span>
							<span className="me-3">Clerk A</span>
						</div> : ""
				}
				{
					billType === "sales" ? 
						<div>
							<span className="fw-bold">From:</span> {fromDate} 
							<span className="fw-bold ms-3">To:</span> {toDate}
						</div> : ""
				}
				{
					billType === "expense" ? <p className="fw-bold">Date: {expense_date || getFormattedDate()}</p> : ""
				}
			</div>
			<table className="mx-auto table table-borderless">
				<thead className="mx-auto text-center">
					<tr className="border-dashed">
						<th>{billType === "expense" ? "Expense Name" : "Sr. No." }</th>
						<th>{billType === "expense" ? "Merchant Name" : "Item Name" }</th>
						<th>Rate</th>
						<th>Quantity</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
                    {
                        items && items.map((item, index) => {
							if (item.amount && item.quantity && ((billType === "expense" && item.expense_name) || (item.item_name)))
								return (
									<tr className="mb-0" key={index}>
										<td>{billType === "expense" ? item.expense_name : (index+1)}</td>
										<td>{billType === "expense" ? item.merchant_name : item.item_name}</td>
										<td>&#8377; {item.price}</td>
										<td>{item.quantity}</td>
										<td>&#8377; {item.amount}</td>
									</tr>
								)
                        })
                    }
				</tbody>
				{/* <p className="border-top-dashed"></p> */}
				{
					(billType === "expense" || billType === "sales") ? 
						<tfoot className="border-top-dashed">
							<td></td>
							<td></td>
							<td></td>
							<td className="fw-bold">{Number.parseInt(billQuantity)}</td>
							<td className="fw-bold">&#8377; {Number.parseInt(billTotal).toFixed(2)}/-</td>
						</tfoot>
						: ""
				}
			</table>
			{!(billType === "expense" || billType === "sales") && <p className="fw-bold fs-2 border-top-dashed pt-2 pb-1">Total: {Number.parseInt(billTotal).toFixed(2)}</p>}
			<div className="thank-you fs-5">
				{
					(billType === "expense" || billType === "sales") ? 
						<p className="fst-italic mt-2">Powered by Arisan Global</p> : 
						<p className="text-uppercase">Thank you Visit again!</p>
				}
			</div>
		</div>
	);
});

export default BillPrint;
