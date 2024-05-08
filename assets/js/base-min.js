const timer=new PomoTimer,docTitle=document.title;function setTimerProgress(e){document.querySelector("#timer-circle-progress").setAttribute.bind(document.querySelector("#timer-circle-progress"))("stroke-dasharray",`${(283*e).toFixed(0)} 283`)}function setTimerColor(e){document.querySelector("#timer-circle-progress").style.stroke=null==e?"green":e}window.onblur=function(){timer.setBlurred(!0)},window.onfocus=function(){timer.setBlurred(!1),document.title=docTitle},window.ondragstart=function(){return!1},window.ondrop=function(){return!1},window.addEventListener("load",(async()=>{if(getNotificationPermission()||isIOS()||Notification.requestPermission(),setTimerColor("var(--background-color)"),document.querySelector("#timer-circle-progress").classList.add("timer-circle-progress-transition"),null!==getCookie("username")){document.querySelector("#todo-create-button").classList.remove("disabled"),document.querySelector("#login-page").classList.add("hide"),document.querySelector("#user-page").classList.remove("hide"),document.querySelector("#welcome-user-heading").textContent=`Welcome back, ${getCookie("username")}!`;const e=new FormData;e.append("requestType","getPomoScore"),e.append("username",getCookie("username")),await fetch("assets/php/database.php",{method:"POST",body:e}).then((e=>{if(e.ok)return e.json()})).then((e=>{e.success&&(setCookie("fullPomoScore",e.fullPomoScore),setCookie("partialPomoScore",e.partialPomoScore),setPomoCounter(e.fullPomoScore,e.partialPomoScore))})),loadTodos()}document.querySelectorAll("[data-popup-open-target]").forEach((e=>{"todo-item-popup"===e.getAttribute("data-target-popup-type")?e.addEventListener("click",(()=>{todoPopupOpenFunction(e)})):"information-popup"===e.getAttribute("data-target-popup-type")?e.addEventListener("click",(()=>{popupOpenFunction(e);const t=Flickity.data(document.querySelector(".main-carousel"));for(let e=0;e<50;e++)t.resize()})):"create-todo-popup"===e.getAttribute("data-target-popup-type")?e.addEventListener("click",(()=>{null!==getCookie("username")?popupOpenFunction(e):popupOpenFunction(document.querySelector("#login-popup"))})):e.addEventListener("click",(()=>{popupOpenFunction(e)}))})),document.querySelectorAll("[data-popup-close-target]").forEach((e=>{e.addEventListener("click",(()=>{const t=document.querySelector(`#${e.getAttribute("data-popup-close-target")}`);t.style.animation="popupCloseAnimation 0.5s forwards",setTimeout((function(){t.style.display="none"}),500),document.body.style.overflow="auto"}))})),document.querySelector("#todo-add-task").addEventListener("click",(async e=>{e.preventDefault();const t=document.querySelector("#todo-input"),o=t.value,r=new FormData;r.append("requestType","createTodo"),r.append("username",getCookie("username")),r.append("taskContent",o),await fetch("assets/php/database.php",{method:"POST",body:r}).then((e=>{if(e.ok)return e.json()})).then((e=>{e.success&&(loadTodos(),t.value="",popupCloseFunctionByID("todo-popup"))})).catch((e=>{}))})),document.querySelector("#todo-item-delete").addEventListener("click",(async e=>{e.preventDefault();const t=new FormData;t.append("requestType","deleteTodo"),t.append("taskID",document.querySelector("#todo-item-popup").getAttribute("data-task-id-storage")),await fetch("assets/php/database.php",{method:"POST",body:t}).then((e=>{if(e.ok)return e.json()})).then((e=>{e.success&&loadTodos()})).catch((e=>{})),popupCloseFunctionByID("todo-item-popup")})),document.querySelector("#todo-item-save").addEventListener("click",(async e=>{e.preventDefault();const t=new FormData;t.append("requestType","editTodo"),t.append("taskID",document.querySelector("#todo-item-popup").getAttribute("data-task-id-storage")),t.append("taskContent",document.querySelector("#task-input").value),await fetch("assets/php/database.php",{method:"POST",body:t}).then((e=>{if(e.ok)return e.json()})).then((()=>{popupCloseFunctionByID("todo-item-popup"),loadTodos()})).catch((e=>{}))})),document.querySelector("#task-input").addEventListener("keyup",(()=>{"flex"===document.querySelector("#todo-item-popup").style.display&&document.querySelector("#todo-item-save").classList.remove("hide")})),document.querySelector("#leaderboard-switch-button").addEventListener("click",(()=>{document.querySelector("#leaderboard-all-time").classList.contains("hide")?(document.querySelector("#leaderboard-all-time").classList.remove("hide"),document.querySelector("#leaderboard-weekly").classList.add("hide")):(document.querySelector("#leaderboard-all-time").classList.add("hide"),document.querySelector("#leaderboard-weekly").classList.remove("hide"))})),document.querySelector("#go-to-registration").addEventListener("click",(()=>{document.querySelector("#registration-page").classList.remove("hide"),document.querySelector("#login-page").classList.add("hide"),document.querySelector("#login-input-error").classList.contains("hide")||document.querySelector("#login-input-error").classList.add("hide")})),document.querySelector("#login-form").addEventListener("submit",(async e=>{e.preventDefault();const t=document.querySelector("#login-input-error"),o=new FormData(e.target);o.append("requestType","login"),await fetch("assets/php/database.php",{method:"POST",body:o}).then((e=>{if(e.ok)return e.json()})).then((r=>{t.classList.contains("hide")||t.classList.add("hide"),r.success?(null===getCookie("username")&&document.querySelector("#todo-create-button").classList.remove("disabled"),setCookie("username",o.get("username")),setCookie("fullPomoScore",r.fullPomoScore),setCookie("partialPomoScore",r.partialPomoScore),setPomoCounter(r.fullPomoScore,r.partialPomoScore),loadTodos(),popupCloseFunctionByID("login-popup"),document.querySelector("#login-page").classList.add("hide"),document.querySelector("#user-page").classList.remove("hide"),document.querySelector("#welcome-user-heading").textContent=`Welcome back, ${getCookie("username")}!`,e.target.reset()):1===r.code&&t.classList.remove("hide")})).catch((e=>{}))})),document.querySelector("#go-to-login").addEventListener("click",(()=>{document.querySelector("#registration-page").classList.add("hide"),document.querySelector("#login-page").classList.remove("hide"),document.querySelector("#registration-username-error").classList.contains("hide")||document.querySelector("#registration-username-error").classList.add("hide"),document.querySelector("#registration-password-error").classList.contains("hide")||document.querySelector("#registration-password-error").classList.add("hide")})),document.querySelector("#registration-form").addEventListener("submit",(async e=>{e.preventDefault();const t=document.querySelector("#registration-username-error"),o=document.querySelector("#registration-password-error"),r=new FormData(e.target);r.append("requestType","register"),await fetch("assets/php/database.php",{method:"POST",body:r}).then((e=>{if(e.ok)return e.json()})).then((n=>{t.classList.contains("hide")||t.classList.add("hide"),o.classList.contains("hide")||o.classList.add("hide"),n.success?(null===getCookie("username")&&document.querySelector("#todo-create-button").classList.remove("disabled"),setCookie("username",r.get("username")),setPomoCounter(0,0),loadTodos(),popupCloseFunctionByID("login-popup"),document.querySelector("#registration-page").classList.add("hide"),document.querySelector("#user-page").classList.remove("hide"),document.querySelector("#welcome-user-heading").textContent=`Welcome back, ${getCookie("username")}!`,e.target.reset()):1===n.code?t.classList.remove("hide"):2===n.code&&o.classList.remove("hide")}))})),document.querySelector("#change-password-form").addEventListener("submit",(async e=>{e.preventDefault();const t=document.querySelector("#user-current-password-error"),o=document.querySelector("#user-confirm-password-error"),r=new FormData(e.target);r.append("username",getCookie("username")),r.append("requestType","updatePassword"),await fetch("assets/php/database.php",{method:"POST",body:r}).then((e=>{if(e.ok)return e.json()})).then((e=>{t.classList.contains("hide")||t.classList.add("hide"),o.classList.contains("hide")||o.classList.add("hide"),e.success?popupCloseFunctionByID("login-popup"):1===e.code?t.classList.remove("hide"):2===e.code&&o.classList.remove("hide")})).catch((e=>{})),popupCloseFunctionByID("login-popup"),e.target.reset()})),document.querySelector("#user-logout-button").addEventListener("click",(e=>{e.preventDefault(),deleteCookie("username"),deleteCookie("fullPomoScore"),deleteCookie("partialPomoScore"),popupCloseFunctionByID("login-popup"),resetPomoCounter(),loadTodos(),document.querySelector("#todo-create-button").classList.add("disabled"),document.querySelector("#user-page").classList.add("hide"),document.querySelector("#login-page").classList.remove("hide"),document.querySelector("#user-current-password-error").contains("hide")||document.querySelector("#user-current-password-error").classList.add("hide"),document.querySelector("#user-confirm-password-error").contains("hide")||document.querySelector("#user-confirm-password-error").classList.add("hide")}));let e=0;const t=[25,5,25,5,25,5,25,15];let o;document.querySelector("#timer-start-button").addEventListener("click",(()=>{let r=getCookie("fullPomoScore")||0,n=getCookie("partialPomoScore")||0;if(!timer.isActive()){0===timer.getCurrentPositionMS()?(setTimerColor("var(--accent-color)"),o=6e4*t[e],timer.setTimerLength(o).startTimer()):timer.startTimer();const s=timer.timerLengthMS/2,i=timer.timerLengthMS/4,a=setInterval((async()=>{if(-1e3===timer.getCurrentPositionMS()){if(clearInterval(a),timer.stopTimer(),timer.setCurrentPositionMS(0),getNotificationPermission()&&!1===document.hasFocus()){const o=new Notification(document.title,{title:document.title,body:""+(25===t[e]?"Its time for your break comeback and start the timer":"Your break has finished comeback!"),lang:"en-GB",icon:"assets/images/favi.webp"});o.onclick=function(){window.focus(),o.close()},o.onshow=function(){setTimeout((()=>{o.close()}),5e3)},o.onerror=function(e){}}e<7?e++:(e=0,document.querySelector("#pomodoro-counter").textContent=r),n<8?n++:(n=0,r++),setPomoCounter(r,n),setCookie("fullPomoScore",r),setCookie("partialPomoScore",n);const o=new FormData;o.append("requestType","updatePomoScore"),o.append("username",getCookie("username")),o.append("fullPomoScore",r),o.append("partialPomoScore",n),await fetch("assets/php/database.php",{method:"POST",body:o}).then((e=>{if(e.ok)return e.json()})).then((e=>{e.success})).catch((e=>{}))}else timer.getCurrentPositionMS()<i?setTimerColor("var(--background-color)"):timer.getCurrentPositionMS()<s&&setTimerColor("orange")}),1e3)}})),document.querySelector("#timer-pause-button").addEventListener("click",(()=>{timer.stopTimer()}))}));const setPomoCounter=(e,t)=>{document.querySelector("#pomodoro-counter").textContent=e,setPomoCounterProgress(12.5*t)},resetPomoCounter=()=>{document.querySelector("#pomodoro-counter").textContent="0",setPomoCounterProgress(0)},pomodoroCounterCircle=document.querySelector("#counter-circle"),pomodoroCounterRadius=pomodoroCounterCircle.r.baseVal.value,pomodoroCounterCircumference=2*pomodoroCounterRadius*Math.PI;function setPomoCounterProgress(e){pomodoroCounterCircle.style.strokeDashoffset=pomodoroCounterCircumference-e/100*pomodoroCounterCircumference}pomodoroCounterCircle.style.strokeDasharray=`${pomodoroCounterCircumference} ${pomodoroCounterCircumference}`,pomodoroCounterCircle.style.strokeDashoffset=`${pomodoroCounterCircumference}`;const loadTodos=async()=>{const e=new FormData;e.append("requestType","getTodos"),e.append("username",getCookie("username")),await fetch("assets/php/database.php",{method:"POST",body:e}).then((e=>e.json())).then((e=>{document.querySelector("#todo-list").querySelectorAll("*").forEach((e=>e.remove())),e.success&&e.todos&&e.todos.forEach((e=>{const t=document.createElement("div");t.classList.add("todo-item"),t.setAttribute("data-popup-open-target","todo-item-popup"),t.setAttribute("data-target-popup-type","todo-item-popup"),t.setAttribute("data-task-id",e.taskID);const o=document.createElement("div");o.classList.add("todo-item-container"),t.appendChild(o);const r=document.createElement("div");r.classList.add("todo-text"),r.textContent=e.taskContent,o.appendChild(r),t.addEventListener("click",(()=>todoPopupOpenFunction(t))),document.querySelector("#todo-list").appendChild(t)}))})).catch((e=>{}))};function popupCloseFunctionByID(e){const t=document.querySelector(`#${e}`);t.style.animation="popupCloseAnimation 0.5s forwards",setTimeout((function(){t.style.display="none"}),500),document.body.style.overflow="auto"}function popupOpenFunction(e){const t=document.querySelector(`#${e.getAttribute("data-popup-open-target")}`)||e;t.style.animation="popupOpenAnimation 0.5s forwards",t.style.display="flex",document.body.style.overflow="hidden"}function todoPopupOpenFunction(e){popupOpenFunction(e),document.querySelector("#task-input").value=e.querySelector(".todo-text").textContent.trim(),document.querySelector("#todo-item-popup").setAttribute("data-task-id-storage",e.getAttribute("data-task-id")),document.querySelector("#todo-item-save").classList.add("hide")}function msToTime(e){function t(e,t){return("00"+e).slice(-(t=t||2))}const o=(e=(e-e%1e3)/1e3)%60;return`${t((e=(e-o)/60)%60)}:${t(o)}`}function getNotificationPermission(){return!isIOS()&&"granted"===Notification.permission}function isIOS(){const e=navigator.userAgent.toLowerCase();return!(!/iphone/.exec(e)&&!/ipad/.exec(e))||!!["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platforms)}function setCookie(e,t,o="Strict"){const r=new Date;r.setTime(r.getTime()+31536e6),document.cookie=`${e}=${t||""}; expires=${r.toString()}; SameSite=${o}; path=/`}function deleteCookie(e,t="Strict"){document.cookie=`${e}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=${t}; path=/;`}function getCookie(e){const t=e+"=";for(let e of document.cookie.split(";")){for(;e.startsWith(" ");)e=e.substring(1,e.length);if(e.startsWith(t))return e.substring(t.length,e.length)}return null}