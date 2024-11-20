class PomoTimer{constructor(){this.timerLengthMS=null,this.currentPositionMS=null,this.timerActive=!1,this.alarmActive=!1,this.blurred=!1}setTimerLength(t){return this.timerLengthMS=t,this}getTimerLengthMS(){return this.timerLengthMS}setBlurred(t){return this.blurred=t,this}getCurrentPositionMS(){return this.currentPositionMS}setCurrentPositionMS(t){this.currentPositionMS=t}isActive(){return this.timerActive}startTimer(){0===this.getCurrentPositionMS()&&this.setCurrentPositionMS(this.timerLengthMS),this.timerActive=!0;const t=setInterval((()=>{if(this.isActive()){0!==this.getCurrentPositionMS()||this.alarmActive||(this.timerActive=!1);const t=0===this.getCurrentPositionMS()?"00:00":msToTime(this.getCurrentPositionMS());document.querySelector("#timer-text").innerHTML=t,setTimerProgress(this.getCurrentPositionMS()/this.timerLengthMS),this.blurred&&(document.title=t),this.currentPositionMS-=1e3}else clearInterval(t),this.timerActive=!1}),1e3)}stopTimer(){this.timerActive=!1}resetTimer(){this.timerLengthMS=null,this.currentPositionMS=0,this.timerActive=!1}}function msToTime(t){const e=Math.floor(t/1e3%60),i=Math.floor(t/6e4%60);return`${i<10?"0"+i:i}:${e<10?"0"+e:e}`}function setTimerProgress(t){const e=document.querySelector("#timer-progress");e&&(e.style.width=100*t+"%")}function setTimerColor(t){document.querySelector("#timer-circle-progress").style.stroke=null==t?"green":t}