export default function setCookie(cookieName, cookieValue, expirationDays) {
    // let cookieString = `${encodeURIComponent(cookieName)}=${encodeURIComponent(cookieValue)}`;
  
    // if (expirationDays) {
    //   const expirationDate = new Date();
    //   expirationDate.setDate(expirationDate.getDate() + expirationDays);
  
    //   cookieString += `; expires=${expirationDate.toUTCString()}`;
    // }
  
    // document.cookie = cookieString;

    window.localStorage.setItem(cookieName, cookieValue);
    window.localStorage.setItem("userExpiresAt", new Date(new Date().setDate((new Date().getDate()+expirationDays))));
  }