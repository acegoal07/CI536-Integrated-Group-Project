///////////////// Timer class //////////////////
class PomoTimer {
   constructor() {
      this.timerLengthMS = null;
      this.currentPositionMS = 0;
      this.timerActive = false;
      this.blurred = false;
   }

   /**
    * Gets the timer length in milliseconds
    * @param {int} msInput
    * @returns {PomoTimer}
    */
   setTimerLength(msInput) {
      this.timerLengthMS = msInput;
      return this;
   }

   /**
    * Gets the timer position in milliseconds
    * @returns {int}
    */
   getCurrentPositionMS() {
      return this.currentPositionMS;
   }

   /**
    * Gets the current position of the timer in seconds
    * @returns {int}
    */
   getCurrentPosition() {
      return (this.currentPositionMS / 1000) * 60;
   }

   /**
    * Sets the current position of the timer in milliseconds
    * @param {int} ms
    * @returns {PomoTimer}
    */
   setCurrentPositionMS(ms) {
      this.currentPositionMS = ms;
      return this;
   }

   /**
    * Checks whether the timer is active
    * @returns {boolean}
    */
   isActive() {
      return this.timerActive;
   }

   /**
    * Sets the blurred state of the timer
    * @param {boolean} bool
    * @returns {PomoTimer}
    */
   setBlurred(bool) {
      this.blurred = bool;
      return this;
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
               this.getCurrentPositionMS == 0
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