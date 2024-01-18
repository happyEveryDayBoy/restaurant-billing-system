export default function getCookie(cookieName) {
    // const cookies = document.cookie.split('; ');

    // for (let i = 0; i < cookies.length; i++) {
    //     const cookie = cookies[i];
    //     const [name, value] = cookie.split('=');

    //     if (name === cookieName) {
    //         return decodeURIComponent(value);
    //     }
    // }

    if (new Date() < window.localStorage.getItem("userExpiresAt")) return null;
    return window.localStorage.getItem(cookieName);

    // return null;
}
