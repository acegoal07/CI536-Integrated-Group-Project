/**
 * setCookie
 * Stores a cookie with the name and value that's provided
 * @param {String} name The name of the cookie
 * @param {any} value The value of the cookie
 * @param {"Strict" | "Lax" | "None"} [sameSite="Strict"] The type of SameSite to use
 * @param {Number} [expires=1] The number of days until the cookie expires
 * @param {Boolean} [httpOnly=false] Whether the cookie is HttpOnly
 */
function setCookie({ name, value, sameSite = "Strict", expires = 1, httpOnly = false }) {
   const date = new Date();
   date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
   const expiresStr = date.toUTCString();
   const httpOnlyStr = httpOnly ? "; HttpOnly" : "";
   document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value || "")}; expires=${expiresStr}; SameSite=${sameSite}; Secure; Path=/${httpOnlyStr}`;
}
/**
* deleteCookie
* Deletes the cookie with the provided name
* @param {String} name The name of the cookie
* @param {"Strict" | "Lax" | "None"} [sameSite="Strict"] The type of SameSite to use
*/
function deleteCookie({ name, sameSite = "Strict" }) {
   document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=${sameSite}; Secure; Path=/;`;
}
/**
* getCookie
* Gets the value of the cookie with the provided name
* @param {String} name The name of the cookie
* @returns {any} The value of the cookie
*/
function getCookie(name) {
   const nameEQ = `${encodeURIComponent(name)}=`;
   const cookies = document.cookie.split(';');
   for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
         return decodeURIComponent(cookie.substring(nameEQ.length));
      }
   }
   return null;
}

/**
 * extendCookie
 * Extends the lifespan of the cookie with the provided name
 * @param {String} name The name of the cookie
 * @param {Number} days The number of days to extend the cookie's lifespan
 * @param {"Strict" | "Lax" | "None"} [sameSite="Strict"] The type of SameSite to use
 * @param {Boolean} [httpOnly=false] Whether the cookie is HttpOnly
 */
function extendCookie({ name, days, sameSite = "Strict", httpOnly = false }) {
   const value = getCookie(name);
   if (value !== null) {
      setCookie({ name, value, sameSite, expires: days, httpOnly });
   }
}
