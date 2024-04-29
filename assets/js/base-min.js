const timer=new PomoTimer,docTitle=document.title;function setTimerProgress(e){document.querySelector("#timer-circle-progress").setAttribute.bind(document.querySelector("#timer-circle-progress"))("stroke-dasharray",`${(283*e).toFixed(0)} 283`)}window.onblur=function(){timer.setBlurred(!0)},window.onfocus=function(){timer.setBlurred(!1),document.title=docTitle},window.ondragstart=function(){return!1},window.ondrop=function(){return!1},window.addEventListener("load",(async()=>{getNotificationPermission()||isIOS()||Notification.requestPermission(),setTimerColor("var(--background-color)"),document.querySelector("#timer-circle-progress").classList.add("timer-circle-progress-transition");const e=e=>{const t=document.querySelector(`#${e.getAttribute("data-popup-open-target")}`);t.style.animation="popupOpenAnimation 0.5s forwards",t.style.display="flex",document.body.style.overflow="hidden"},t=t=>{e(t),document.querySelector("#task-input").value=t.querySelector(".todo-text").textContent.trim(),document.querySelector("#todo-item-popup").setAttribute("data-task-id-storage",t.getAttribute("data-task-id")),document.querySelector("#todo-item-save").classList.add("hide")};document.querySelectorAll("[data-popup-open-target]").forEach((o=>{"todo-item-popup"===o.getAttribute("data-target-popup-type")?o.addEventListener("click",(()=>{t(o)})):"information-popup"===o.getAttribute("data-target-popup-type")?o.addEventListener("click",(()=>{(t=>{e(t);const o=document.querySelector(".main-carousel"),r=Flickity.data(o);for(let e=0;e<50;e++)r.resize()})(o)})):o.addEventListener("click",(()=>{e(o)}))}));const o=e=>{const t=document.querySelector(`#${e}`);t.style.animation="popupCloseAnimation 0.5s forwards",setTimeout((function(){t.style.display="none"}),500)};document.querySelectorAll("[data-popup-close-target]").forEach((e=>{e.addEventListener("click",(()=>{const t=document.querySelector(`#${e.getAttribute("data-popup-close-target")}`);t.style.animation="popupCloseAnimation 0.5s forwards",setTimeout((function(){t.style.display="none"}),500),document.body.style.overflow="auto"}))})),document.querySelector("#todo-add-task").addEventListener("click",(e=>{e.preventDefault();const r=document.querySelector("#todo-input"),n=r.value;if(""!==n.trim()){const e=document.createElement("div");e.classList.add("todo-item-container");const i=document.createElement("div");i.classList.add("todo-text"),i.textContent=n,e.appendChild(i);const s=document.createElement("div");s.setAttribute("data-popup-open-target","todo-item-popup"),s.setAttribute("data-target-popup-type","todo-item-popup"),s.setAttribute("data-task-id",""),s.classList.add("todo-item"),s.addEventListener("click",(e=>{t(e.target)})),s.appendChild(e),document.querySelector(".todo-list-container").appendChild(s),r.value="",o("todo-popup")}})),document.querySelector("#todo-item-delete").addEventListener("click",(async e=>{e.preventDefault();const t=new FormData;t.append("taskID",document.querySelector("#todo-item-popup").getAttribute("data-task-id-storage")),await fetch("assets/php/removeTodos.php",{method:"POST",body:t}).then((e=>e.json())).then((e=>{e.success&&r()})).catch((e=>{})),o("todo-item-popup")})),document.querySelector("#todo-item-save").addEventListener("click",(e=>{e.preventDefault(),o("todo-item-popup")})),document.querySelector("#task-input").addEventListener("keyup",(()=>{"flex"===document.querySelector("#todo-item-popup").style.display&&document.querySelector("#todo-item-save").classList.remove("hide")}));const r=async()=>{const e=new FormData;e.append("username",getCookie("username")),await fetch("assets/php/getTodos.php",{method:"POST",body:e}).then((e=>e.json())).then((e=>{document.querySelector("#todo-list").querySelectorAll("*").forEach((e=>e.remove())),e.todos&&e.todos.forEach((e=>{const o=document.createElement("div");o.classList.add("todo-item"),o.setAttribute("data-popup-open-target","todo-item-popup"),o.setAttribute("data-target-popup-type","todo-item-popup"),o.setAttribute("data-task-id",e.taskID);const r=document.createElement("div");r.classList.add("todo-item-container"),o.appendChild(r);const n=document.createElement("div");n.classList.add("todo-text"),n.textContent=e.taskName,r.appendChild(n),o.addEventListener("click",(e=>t(e.target))),document.querySelector("#todo-list").appendChild(o)}))})).catch((e=>{}))};null!==getCookie("username")&&r(),document.querySelector("#leaderboard-switch-button").addEventListener("click",(()=>{document.querySelector("#leaderboard-all-time").classList.contains("hide")?(document.querySelector("#leaderboard-all-time").classList.remove("hide"),document.querySelector("#leaderboard-weekly").classList.add("hide")):(document.querySelector("#leaderboard-all-time").classList.add("hide"),document.querySelector("#leaderboard-weekly").classList.remove("hide"))})),document.querySelector("#go-to-registration").addEventListener("click",(()=>{document.querySelector("#registration-page").classList.remove("hide"),document.querySelector("#login-page").classList.add("hide")})),document.querySelector("#login-form").addEventListener("submit",(async e=>{e.preventDefault(),await fetch("assets/php/login.php",{method:"POST",body:new FormData(e.target)}).then((e=>{if(e.ok)return e.json()})).then((t=>{!0===t.success&&(setCookie("username",t.username),r(),o("login-popup"),e.target.reset())})).catch((e=>{}))})),document.querySelector("#go-to-login").addEventListener("click",(()=>{document.querySelector("#registration-page").classList.add("hide"),document.querySelector("#login-page").classList.remove("hide")})),document.querySelector("#registration-form").addEventListener("submit",(e=>{e.preventDefault(),o("login-popup"),e.target.reset()}));let n=0,i=0;const s=[25,5,25,5,25,5,25,15];let c,a=0;document.querySelector("#timer-start-button").addEventListener("click",(()=>{if(!timer.isActive()){0===timer.getCurrentPositionMS()?(setTimerColor("var(--accent-color)"),c=1e3*s[i],timer.setTimerLength(c).startTimer()):timer.startTimer();const e=timer.timerLengthMS/2,t=timer.timerLengthMS/4,o=setInterval((()=>{if(-1e3===timer.getCurrentPositionMS()){if(clearInterval(o),timer.stopTimer(),timer.setCurrentPositionMS(0),getNotificationPermission()&&!1===document.hasFocus()){const e=new Notification("Pomo Timer",{title:"Pomo Timer",body:""+(25===s[i]?"Its time for your break comeback and start the timer":"Your break has finished comeback!"),lang:"en-GB",icon:"assets/images/favi.webp"});e.onclick=function(){window.focus(),e.close()},e.onshow=function(){setTimeout((()=>{e.close()}),5e3)},e.onerror=function(e){}}i<7?(i++,a+=12.5,setPomoCounterProgress(a)):(i=0,n++,a=0,document.querySelector("#pomodoro-counter").textContent=n)}else timer.getCurrentPositionMS()<t?setTimerColor("var(--background-color)"):timer.getCurrentPositionMS()<e&&setTimerColor("orange")}),1e3)}})),document.querySelector("#timer-pause-button").addEventListener("click",(()=>{timer.stopTimer()}))}));const pomodoroCounterCircle=document.querySelector("#counter-circle"),pomodoroCounterRadius=pomodoroCounterCircle.r.baseVal.value,pomodoroCounterCircumference=2*pomodoroCounterRadius*Math.PI;function setPomoCounterProgress(e){pomodoroCounterCircle.style.strokeDashoffset=pomodoroCounterCircumference-e/100*pomodoroCounterCircumference}function setTimerColor(e){document.querySelector("#timer-circle-progress").style.stroke=null==e?"green":e}function msToTime(e){function t(e,t){return("00"+e).slice(-(t=t||2))}const o=(e=(e-e%1e3)/1e3)%60;return`${t((e=(e-o)/60)%60)}:${t(o)}`}function getNotificationPermission(){return!isIOS()&&"granted"===Notification.permission}function isIOS(){const e=navigator.userAgent.toLowerCase();return!(!/iphone/.exec(e)&&!/ipad/.exec(e))||!!["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platforms)}pomodoroCounterCircle.style.strokeDasharray=`${pomodoroCounterCircumference} ${pomodoroCounterCircumference}`,pomodoroCounterCircle.style.strokeDashoffset=`${pomodoroCounterCircumference}`;const setCookie=function(e,t,o="Strict"){const r=new Date;r.setTime(r.getTime()+31536e6),document.cookie=`${e}=${t||""}; expires=${r.toString()}; SameSite=${o}; path=/`},deleteCookie=function(e){document.cookie=`${e}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`},getCookie=function(e){const t=e+"=";for(let e of document.cookie.split(";")){for(;e.startsWith(" ");)e=e.substring(1,e.length);if(e.startsWith(t))return e.substring(t.length,e.length)}return null};