import "../nav/nav.css"


import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Table from "./TableRows";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';

import { addDays, endOfWeek, startOfMonth, startOfWeek, subWeeks } from "date-fns";
import { DateRangePicker } from "react-date-range";
import getFormattedDate from "../../helpers/getFormattedDate";

import { useComponentBlur } from "../../hooks/useComponentBlur";
import getSalesDetails from "../../helpers/getSalesDetails";

export default function SalesTab() {
    const isNavOpen = useSelector(state => state.navbarState);
    const outletInfo = useSelector(state => state.outletInfo.outlet)

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


    const [salesDetails, setSalesDetails] = useState(null);

    const renderStaticRangeLabel = (label) => {
        return <span>{label.label}</span>
    }

    useEffect(() => {
        getSalesDetails(salesFromValue, salesToValue).then(result => {
            console.log(result);
            setSalesDetails(result)
        }).catch(e => setSalesDetails(null));
    }, [salesFromValue, salesToValue])

    useEffect(() => {
      setSalesToValue(getFormattedDate(dateRange[0].endDate));
      setSalesFromValue(getFormattedDate(dateRange[0].startDate));
    }, [dateRange])

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

    useEffect(() => {
        console.log("RANGE: ", dateRange);
    }, [dateRange])

    return (
        <section className={isNavOpen ? "p-4 mr-nav-left transition-300ms" : "p-4 transition-300ms"}>
            <form onSubmit={(e) => e.preventDefault()} className="d-flex justify-content-between">
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
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Outlet Name </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.outlet_name}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1">
                    <span className="clr-gray">Outlet No. </span>
                    <span className="border px-3 py-2 rounded-3 clr-dark-gray">{outletInfo.outlet_no}</span>
                </div>
                <div className="me- d-flex flex-column pe-3 py-2 flex-grow-1 position-relative">
                    <button type="submit" className="btn bg-blue-20 clr-dark-blue py-2 mt-auto">Submit</button>
                </div>
            </form>
            { salesDetails != null ? 
                <Table salesDetails={salesDetails} fromDate={salesFromValue} toDate={salesToValue} /> : 
                <div className="mt-4 clr-dark-gray">Please select date range to continue</div> }
        </section>
    );
}
