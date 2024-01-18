export default function getFormattedDate(today = new Date(), format = "yyyy-mm-dd") {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0')
    const minutes = String(today.getMinutes()).padStart(2, '0')
    
    switch (format) {
        case "yyyy-mm-dd":
            return `${year}-${month}-${day}`;
        case "dd-mm-yyyy":
            return `${day}-${month}-${year}`;
        case "dd-mon-yyyy": {
            const date = new Date(year, month-1, day);
            const formattedDate = date.toLocaleDateString('en-in', {
                day: 'numeric', month: 'short', year: 'numeric'
            }).replace(/ /g, '-');
            return formattedDate;
        }
        case "dd-mm-yyyy HH:MM": {
            return `${day}-${month}-${year} ${hours}:${minutes}`;
        }
        default:
            return `${year}-${month}-${day}`;
    }
}