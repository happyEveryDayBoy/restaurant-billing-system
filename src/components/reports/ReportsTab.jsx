import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react"
import { DateRangePicker } from "react-date-range";
import { addDays, endOfWeek, startOfMonth, startOfWeek, subWeeks } from "date-fns";
 
import expenseImage from "../../static/icons/expense.svg";
import salesImage from "../../static/icons/sales.svg";

import { useReportDownload } from "../../hooks/useReportDownload";
import getFormattedDate from "../../helpers/getFormattedDate";
import { useComponentBlur } from "../../hooks/useComponentBlur";
import { db } from "../../db";

export default function ReportsTab() {
	const isNavOpen = useSelector((state) => state.navbarState);
    const reportDownload = useReportDownload();

    const [salesFromValue, setSalesFromValue] = useState(getFormattedDate());
    const [salesToValue, setSalesToValue] = useState(getFormattedDate());
    const [dateToday, setDateToday] = useState()

    const dateRangePickerRef = useRef(null);
    const [hasClickedOutside, setHasClickedOutside] = useComponentBlur(dateRangePickerRef);

    const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState([{
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);
    const [activeRange, setActiveRange] = useState([0,0]);

    const renderStaticRangeLabel = (label) => {
        return <span>{label.label}</span>
    }

    useEffect(() => {
      setSalesToValue(getFormattedDate(dateRange[0].endDate));
      setSalesFromValue(getFormattedDate(dateRange[0].startDate));
    }, [dateRange])

    useEffect(() => {
        setDateToday(getFormattedDate())
    }, [])

    useEffect(() => {
        setDateToday(getFormattedDate())
    }, [])

    useEffect(() => {
      isDateRangePickerOpen && setHasClickedOutside(!hasClickedOutside);
      setTimeout(() => setIsDateRangePickerOpen(false), 200)
    }, [hasClickedOutside])

    useEffect(() => {
        if (activeRange[0] === 0 && activeRange[1] === 0) setTimeout(() => setIsDateRangePickerOpen(false), 200);
    }, [activeRange])

    const onRangeFocusChanged = (index) => {
        console.log(index);
        setActiveRange(index);
    }
    
    const onDateRangeChanged = (item) => {
        console.log(dateRange);
        setDateRange(prevDateRange => [item[prevDateRange[0].key]])
    }

    const handleRangeReportSubmit = (e) => {
        e.preventDefault();
        reportDownload(salesFromValue, salesToValue);
    }

    const handleMonthlyReportDownload = (e) => {
        reportDownload();
    }

    const handleSalesRecordErase = (e) => {
        e.preventDefault();
        db.sales
        .where('sales_date')
        .notEqual(getFormattedDate())
        .delete()
        .then(() => {
            console.log('Records deleted successfully.');
        })
        .catch(error => {
            console.error('Error deleting records:', error);
        });
    } 

	return (
		<section className={(isNavOpen ? "mr-nav-left ": "") + " p-4 transition-300ms"}>
            <form onSubmit={(e) => handleRangeReportSubmit(e)} className="d-flex justify-content-between">
                <div className="d-flex position-relative flex-grow-1">
                    <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                        <span htmlFor="bill_to_date" className="clr-gray">From</span>
                        <span type="button" className="py-2 rounded-3 clr-dark-gray form-control" id="bill_to_date" placeholder="Select to date" value={getFormattedDate(dateRange[0].startDate, "dd-mon-yyyy")} max={dateToday} min={salesFromValue} onClick={() => setIsDateRangePickerOpen(!isDateRangePickerOpen)} required>{getFormattedDate(dateRange[0].startDate, "dd-mon-yyyy")}</span>
                    </div>
                    <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                        <span htmlFor="bill_to_date" className="clr-gray">To</span>
                        <span type="button" className="py-2 rounded-3 clr-dark-gray form-control" id="bill_to_date" placeholder="Select to date" value={getFormattedDate(dateRange[0].endDate, "dd-mon-yyyy")} max={dateToday} min={salesFromValue} onClick={() => setIsDateRangePickerOpen(!isDateRangePickerOpen)} required>{getFormattedDate(dateRange[0].endDate, "dd-mon-yyyy")}</span>
                    </div>
                    {
                        isDateRangePickerOpen && 
                            <div ref={dateRangePickerRef} className="position-absolute top-100 border border-2 rounded-3 shadow-sm p-1 bg-white" style={{zIndex: 999}}>
                                <DateRangePicker
                                    onChange={item => onDateRangeChanged(item)}
                                    onRangeFocusChange={(index) => onRangeFocusChanged(index)}
                                    minDate={addDays(new Date(), -45)}
                                    maxDate={addDays(new Date(), 0)}
                                    ranges={dateRange}
                                    renderStaticRangeLabel={renderStaticRangeLabel}
                                    focusedRange={activeRange}
                                    staticRanges={[
                                        {
                                        label: 'Today',
                                        hasCustomRendering: true,
                                        range: () => ({
                                            startDate: new Date(),
                                            endDate: new Date(),
                                            key: "today"
                                        }),
                                        isSelected: () => {
                                            return dateRange[0]?.key === "today";
                                        }
                                        },
                                        {
                                            label: 'Yesterday',
                                            hasCustomRendering: true,
                                            range: () => ({
                                                startDate: new Date(),
                                                endDate: addDays(new Date(), -1),
                                                key: "yesterday"
                                            }),
                                            isSelected: () => {
                                                return dateRange[0]?.key === "yesterday";
                                            }
                                        },
                                        {
                                            label: 'This Week',
                                            hasCustomRendering: true,
                                            range: () => ({
                                                startDate: startOfWeek(subWeeks(new Date(), 0)),
                                                endDate: new Date(),
                                                key: "thisWeek"
                                            }),
                                            isSelected: () => {
                                                return dateRange[0]?.key === "thisWeek";
                                            }
                                        },
                                        {
                                            label: 'Previous Week',
                                            hasCustomRendering: true,
                                            range: () => ({
                                                startDate: startOfWeek(subWeeks(new Date(), 1)),
                                                endDate: endOfWeek(subWeeks(new Date(), 1)),
                                                key: "previousWeek"
                                            }),
                                            isSelected: () => {
                                                return dateRange[0]?.key === "previousWeek";
                                            }
                                        },
                                        {
                                            label: 'This Month',
                                            hasCustomRendering: true,
                                            range: () => ({
                                                startDate: startOfMonth(subWeeks(new Date(), 1)),
                                                endDate: new Date(),
                                                key: "thisMonth"
                                            }),
                                            isSelected: () => {
                                                return dateRange[0]?.key === "thisMonth";
                                            },
                                        }
                                    ]}
                                    />
                            </div>
                    }
                </div>
                {/* <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Outlet Name </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.outlet_name}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Outlet No. </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.outlet_no}</span>
                </div> */}
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow- position-relative">
                    <button type="submit" className="btn bg-blue-20 clr-dark-blue py-2 mt-auto">Download Report</button>
                </div>
            </form>
            <hr className="text-secondary" />
            <div className="order rounded-3 ps-0 p-4 mt-4 d-flex flex-wrap">
                <div className="mb-3 balance-card card rounded-3 p-3 flex-grow-1 me-2">
                    <div className="card-title fs-4 fw-500 d-flex justify-content-between align-items-center">
                        <span className="clr-dark-gray">Monthly Report</span>
                        <img src={expenseImage} alt="" height="32"/>
                    </div>
                    <div className="card-text fs-2 mt-3 fw-500 clr-dark-blue">
                        <button className="btn bg-blue-20 clr-dark-blue" onClick={handleMonthlyReportDownload}>Download monthly report</button>
                    </div>
                </div>
                <div className="mb-3 balance-card card rounded-3 p-3 flex-grow-1 mx-2">
                    <div className="card-title fs-4 fw-500 d-flex justify-content-between align-items-center">
                        <span className="clr-dark-gray">Erase Sales History</span>
                        <img src={salesImage} alt="" height="22"/>
                    </div>
                    <div className="card-text fs-2 mt-3 fw-500">
                        <button className="btn bg-red-20 clr-dark-red" onClick={handleSalesRecordErase}>Erase Sales History</button>
                    </div>
                </div>
            </div>
        </section>
	);
}
