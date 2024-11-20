/**
 * Notification permission getter
 * @returns {Boolean} Whether the user has granted notification permissions
 */
function getNotificationPermission() {
   if (isIOS()) {
      return false;
   }
   return Notification.permission === "granted";
}

/**
 * Check if the user is using an iOS device
 * @returns {Boolean} Whether the user is using an iOS device
 */
function isIOS() {
   const browserInfo = navigator.userAgent.toLowerCase();

   if (/iphone/.exec(browserInfo) || /ipad/.exec(browserInfo)) {
      return true;
   }

   return !![
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod"
   ].includes(navigator.platforms);
}

/**
 * Request notification permissions
 * @returns {void}
 */
function requestNotificationPermission() {
   if (!getNotificationPermission() && !isIOS()) {
      Notification.requestPermission();
   }
}