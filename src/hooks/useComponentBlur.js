import { useEffect, useState } from "react";

export const useComponentBlur = (ref) => {
    const [hasClickedOutside, setHasClickedOutside] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setHasClickedOutside(true);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return [hasClickedOutside, setHasClickedOutside];
}