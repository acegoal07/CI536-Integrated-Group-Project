///////////////// Timer class //////////////////
class PomoTimer {
   constructor() {
      this.timerLengthMS = null;
      this.currentPositionMS = null;
      this.timerActive = false;
      this.alarmActive = false;
      this.blurred = false;
   }

   /**
    * Sets the timer length in milliseconds
    * @param {boolean} alarmActive - The alarm active value
    */
   setTimerLength(ms) {
      this.timerLengthMS = ms;
      return this;
   }

   /**
    * Gets the timer length in milliseconds
    * @returns {int} - The timer length in milliseconds
    */
   getTimerLengthMS() {
      return this.timerLengthMS;
   }

   /**
    * Sets the blurred value
    * @param {boolean} blurred - The blurred value
    * @returns {PomoTimer} - The PomoTimer instance
    */
   setBlurred(blurred) {
      this.blurred = blurred;
      return this
   }

   /**
    * Gets the timer length in milliseconds
    * @returns {int} - The timer length in milliseconds
    */
   getCurrentPositionMS() {
      return this.currentPositionMS;
   }

   /**
    * Sets the current position of the timer in milliseconds
    * @param {int} ms - The current position in milliseconds
    */
   setCurrentPositionMS(ms) {
      this.currentPositionMS = ms;
   }

   /**
    * Checks whether the timer is active
    * @returns {boolean}
    */
   isActive() {
      return this.timerActive;
   }

   /**
    * Starts the timer
    */
   startTimer() {
      if (this.getCurrentPositionMS() === 0) {
         this.setCurrentPositionMS(this.timerLengthMS);
      }
      this.timerActive = true;

      const timer = setInterval(() => {
         if (this.isActive()) {
            if (this.getCurrentPositionMS() === 0 && !this.alarmActive) {
               this.timerActive = false;
            }
            const actualValue =
               this.getCurrentPositionMS() === 0
                  ? "00:00"
                  : msToTime(this.getCurrentPositionMS());
            document.querySelector("#timer-text").innerHTML = actualValue;

            setTimerProgress(this.getCurrentPositionMS() / this.timerLengthMS);

            if (this.blurred) {
               document.title = actualValue;
            }
            this.currentPositionMS -= 1000;
         } else {
            clearInterval(timer);
            this.timerActive = false;
         }
      }, 1000);
   }

   /**
    * Stops the timer
    */
   stopTimer() {
      this.timerActive = false;
   }

   /**
    * Resets the timer to default values
    */
   resetTimer() {
      this.timerLengthMS = null;
      this.currentPositionMS = 0;
      this.timerActive = false;
   }
}

/**
 * Convert milliseconds to time format
 * @param {Number} duration - The time in milliseconds
 * @returns {String} - The time in format MM:SS
 */
function msToTime(duration) {
   const seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60);

   const minutesStr = (minutes < 10) ? "0" + minutes : minutes;
   const secondsStr = (seconds < 10) ? "0" + seconds : seconds;

   return `${minutesStr}:${secondsStr}`;
}

/**
 * Set the timer progress
 * @param {Float} progress - The progress of the timer
 */
function setTimerProgress(progress) {
   const progressBar = document.querySelector("#timer-progress");
   if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
   }
}

/**
 * Timer colour function
 * @param {String} input - The colour of the timer
 */
function setTimerColor(input) {
   document.querySelector("#timer-circle-progress").style.stroke = input == null ? "green" : input;
}