import { useState, useEffect, useRef } from "react";

import * as bootstrap from "bootstrap";
const { Toast } = bootstrap;

export default function NotificationToast(props) {
    let { message, type, delay, toggleToastShow } = props;

    const toastRef = useRef();

    useEffect(() => {
        var myToast = toastRef.current
        myToast && myToast.addEventListener('hidden.bs.toast', function () {
            toggleToastShow();
        })

        var bsToast = bootstrap.Toast.getInstance(myToast)
        
        if (!bsToast) {
            bsToast = new Toast(myToast, {autohide: true, delay: delay || 3500})
        }

        bsToast.show();

    })

    const toastBorderStyle = {
        undefined: "",
        "success": "border-success",
        "warning": "border-warning",
        "error": "border-danger"
    }

    const toastTextStyle = {
        undefined: "",
        "success": "text-success",
        "warning": "text-warning",
        "error": "text-danger"
    }

    return (
        <div className="py-2">
            <div className="position-fixed bottom-0 end-0 ms-auto p-3" style={{zIndex: 11}}>
                <div id="liveToast" className={toastBorderStyle[type] + " toast hide w-100"} role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="1000" ref={toastRef}>
                    <div className="toast-body position-relative text-nowrap">
                        <span className={toastTextStyle[type] + " align-middle"}>{message}</span>
                        <button type="button" className="btn-close ms-2 align-middle" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        </div>
    )
}