class pomoTimer{constructor(){this.timerLengthMS=null,this.currentPositionMS=0,this.timerActive=!1,this.blurred=!1,this.alarmActive=!1}setTimerLength(t){return this.timerLengthMS=t,this}getCurrentPositionMS(){return this.currentPositionMS}getCurrentPosition(){return this.currentPositionMS/1e3*60}setCurrentPositionMS(t){return this.currentPositionMS=t,this}isActive(){return this.timerActive}setBlurred(t){return this.blurred=t,this}startTimer(){0===this.getCurrentPositionMS()&&this.setCurrentPositionMS(this.timerLengthMS),this.timerActive=!0;const t=setInterval((()=>{if(this.isActive()){0!==this.getCurrentPositionMS()||this.alarmActive||(this.timerActive=!1);const t=0===this.getCurrentPositionMS?"00:00":msToTime(this.getCurrentPositionMS());document.querySelector("#timerText").innerHTML=t,setCircleDashArray(this.getCurrentPositionMS()/this.timerLengthMS),this.blurred&&(document.title=t),this.currentPositionMS-=1e3}else clearInterval(t),this.timerActive=!1}),1e3)}stopTimer(){this.timerActive=!1}playAlarm(){const t=new Audio("assets/sounds/digitalAlarm.wav");t.addEventListener("ended",(()=>{this.alarmActive=!1})),t.play(),this.alarmActive=!0,setInterval((()=>{this.alarmActive||t.pause()}),100)}}