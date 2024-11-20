// Timer class caller
const timer = new PomoTimer();
// Focus listener
const docTitle = document.title;
window.onblur = function () {
   timer.setBlurred(true);
};
window.onfocus = function () {
   timer.setBlurred(false);
   document.title = docTitle;
};
// Disable drag and drop
window.ondragstart = function () {
   return false;
};
window.ondrop = function () {
   return false;
};
// Onload handler
window.addEventListener("load", async () => {
   /////////////// Onload changes ///////////////
   setTimerColor("var(--background-color)");
   document.querySelector("#timer-circle-progress").classList.add("timer-circle-progress-transition");
   document.querySelectorAll("form").forEach(form => form.reset());
   document.querySelector("#study-duration").value = 25;
   document.querySelector("#break-duration").value = 5;
   /////////////// User onload auto login ///////////////
   if (getCookie('username') !== null && getCookie('secureID') !== null) {
      const form = new FormData();
      form.append('requestType', 'getPomoScore');
      form.append('username', getCookie('username'));
      form.append('secureID', getCookie('secureID'));
      await fetch('assets/php/database.php', {
         method: 'POST',
         body: form
      })
         .then(response => {
            if (response.ok) {
               return response.json();
            } else if (response.status === 400) {
               console.log('Bad request');
            } else if (response.status === 500) {
               console.log('Internal server error');
            } else {
               console.log('Error with the response from the database');
            }
         })
         .then(data => {
            if (data) {
               if (data.success) {
                  setCookie('fullPomoScore', data.fullPomoScore);
                  setCookie('partialPomoScore', data.partialPomoScore);
                  setPomoCounter(data.fullPomoScore, data.partialPomoScore);
                  document.querySelector("#todo-create-button").classList.remove("disabled");
                  document.querySelector("#account-popup-login-page").classList.add("hide");
                  document.querySelector("#account-popup-user-page").classList.remove("hide");
                  document.querySelector('#welcome-user-heading').textContent = `Welcome back, ${getCookie('username')}!`;
                  loadTodos();
               } else {
                  deleteCookie('username');
                  deleteCookie('secureID');
                  deleteCookie('fullPomoScore');
                  deleteCookie('partialPomoScore');
               }
            }
         });
   }

   /////////////// Universal Popup functions ///////////////
   // Popup open listener and setter
   document.querySelectorAll("[data-popup-open-target]").forEach((element) => {
      const popupType = element.getAttribute("data-target-popup-type");
      switch (popupType) {
         case "todo-item-popup":
            element.addEventListener("click", () => {
               todoPopupOpenFunction(element);
            });
            break;
         case "information-popup":
            element.addEventListener("click", () => {
               popupOpenFunction(element);
               const flkty = Flickity.data(document.querySelector('.main-carousel'));
               for (let i = 0; i < 50; i++) {
                  flkty.resize();
               }
            });
            break;
         case "create-todo-popup":
            element.addEventListener("click", () => {
               if (getCookie('username') !== null) {
                  popupOpenFunction(element);
               } else {
                  popupOpenFunction(document.querySelector("#account-popup"));
               }
            });
            break;
         case "leaderboard-popup":
            element.addEventListener("click", () => {
               popupOpenFunction(element)
               loadLeaderboards();
            });
            break;
         default:
            element.addEventListener("click", () => {
               popupOpenFunction(element);
            });
            break;
      }
   });
   // Popup close listener and setter
   document.querySelectorAll("[data-popup-close-target]").forEach((element) => {
      element.addEventListener("click", () => {
         const popup = document.querySelector(`#${element.getAttribute("data-popup-close-target")}`);
         popup.style.animation = "popupCloseAnimation 0.5s forwards";
         setTimeout(function () {
            popup.style.display = "none";
         }, 500);
         document.body.style.overflow = "auto";
      });
   });

   /////////////// Todo popup functions ///////////////
   // Add todo button listener
   document.querySelector("#todo-add-task").addEventListener("click", async (event) => {
      event.preventDefault();
      const errorMessage = document.querySelector("#create-todo-error");
      if (!errorMessage.classList.contains("hide")) {
         errorMessage.classList.add("hide");
      }
      if (document.querySelector("#todo-input").value.trim() === "") {
         errorMessage.classList.remove("hide");
      } else {
         const todoInput = document.querySelector("#todo-input");
         const todoText = todoInput.value.trim();
         const loadingIcon = document.querySelector("#create-todo-loading-icon");
         loadingIcon.classList.remove("hide");
         const form = new FormData();
         form.append("requestType", "createTodo");
         form.append("username", getCookie('username'));
         form.append('secureID', getCookie('secureID'));
         form.append("taskContent", todoText);
         await fetch("assets/php/database.php",
            {
               method: "POST",
               body: form
            }
         )
            .then(response => {
               if (response.ok) {
                  return response.json();
               } else if (response.status === 400) {
                  console.log('Bad request');
               } else if (response.status === 500) {
                  console.log('Internal server error');
               } else {
                  console.log('Error with the response from the database');
               }
            })
            .then(data => {
               if (data) {
                  if (data.success) {
                     loadTodos();
                     todoInput.value = "";
                     popupCloseFunctionByID("todo-popup");
                  } else {
                     console.log("Error creating task: " + data);
                  }
               }
            })
            .catch(error => console.log(error));
         loadingIcon.classList.add("hide");
      }
   });
   // Todo item delete button
   document.querySelector("#todo-item-delete").addEventListener("click", async (event) => {
      event.preventDefault();
      const loadingIcon = document.querySelector("#todo-item-loading-icon");
      loadingIcon.classList.remove("hide");
      const form = new FormData();
      form.append("requestType", "deleteTodo");
      form.append("username", getCookie('username'));
      form.append('secureID', getCookie('secureID'));
      form.append("taskID", document.querySelector("#todo-item-popup").getAttribute("data-task-id-storage"));
      await fetch("assets/php/database.php",
         {
            method: "POST",
            body: form
         }
      )
         .then(response => {
            if (response.ok) {
               return response.json();
            } else if (response.status === 400) {
               console.log('Bad request');
            } else if (response.status === 500) {
               console.log('Internal server error');
            } else {
               console.log('Error with the response from the database');
            }
         })
         .then(data => {
            if (data) {
               if (data.success) {
                  loadTodos();
               } else {
                  console.log("Failed to delete todo: " + data);
               }
            }
         })
         .catch(error => console.log(error));
      loadingIcon.classList.add("hide");
      popupCloseFunctionByID("todo-item-popup");
   });
   // Todo Save button
   document.querySelector("#todo-item-save").addEventListener("click", async (event) => {
      event.preventDefault();
      const errorMessage = document.querySelector("#edit-todo-error");
      if (!errorMessage.classList.contains("hide")) {
         errorMessage.classList.add("hide");
      }
      if (document.querySelector("#task-input").value.trim() === "") {
         errorMessage.classList.remove("hide");
      } else {
         const loadingIcon = document.querySelector("#todo-item-loading-icon");
         loadingIcon.classList.remove("hide");
         const form = new FormData();
         form.append("requestType", "editTodo");
         form.append("username", getCookie('username'));
         form.append('secureID', getCookie('secureID'));
         form.append("taskID", document.querySelector("#todo-item-popup").getAttribute("data-task-id-storage"));
         form.append("taskContent", document.querySelector("#task-input").value.trim());
         await fetch("assets/php/database.php", {
            method: "POST",
            body: form
         })
            .then(response => {
               if (response.ok) {
                  return response.json();
               } else if (response.status === 400) {
                  console.log('Bad request');
               } else if (response.status === 500) {
                  console.log('Internal server error');
               } else {
                  console.log('Error with the response from the database');
               }
            })
            .then(() => {
               popupCloseFunctionByID("todo-item-popup");
               loadTodos();
            })
            .catch(error => console.error('Error saving changes to todo:', error));
         loadingIcon.classList.add("hide");
      }
   });
   // Todo input keyup listener
   document.querySelector("#task-input").addEventListener("keyup", () => {
      if (document.querySelector("#todo-item-popup").style.display === "flex") {
         document.querySelector("#todo-item-save").classList.remove("hide");
      }
   });

   /////////////// Leaderboard popup functions ///////////////
   // Leaderboard switch button
   document.querySelector("#leaderboard-switch-button").addEventListener("click", () => {
      if (document.querySelector("#leaderboard-all-time").classList.contains("hide")) {
         document.querySelector("#leaderboard-all-time").classList.remove("hide");
         document.querySelector("#leaderboard-weekly").classList.add("hide");
      } else {
         document.querySelector("#leaderboard-all-time").classList.add("hide");
         document.querySelector("#leaderboard-weekly").classList.remove("hide");
      }
   });

   /////////////// User popup functions ///////////////
   // Login page switch button
   document.querySelector("#go-to-registration").addEventListener("click", () => {
      // Remove all elements from the page
      document.querySelector("#account-popup-registration-page").classList.remove("hide");
      document.querySelector("#account-popup-login-page").classList.add("hide");
      if (!document.querySelector("#login-input-error").classList.contains("hide")) {
         document.querySelector("#login-input-error").classList.add("hide");
      }
   });
   // Login submit button
   document.querySelector("#login-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const loginErrorMessage = document.querySelector("#login-input-error");
      if (!loginErrorMessage.classList.contains("hide")) {
         loginErrorMessage.classList.add("hide");
      }
      const form = new FormData(event.target);
      const loadingIcon = document.querySelector("#account-popup-loading-icon");
      loadingIcon.classList.remove("hide");
      form.append('requestType', 'login');
      await fetch('assets/php/database.php', {
         method: 'POST',
         body: form
      }).then(response => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 400) {
            console.log('Bad request');
         } else if (response.status === 500) {
            console.log('Internal server error');
         } else {
            console.log('Error with the response from the database');
         }
      }).then(data => {
         if (data) {
            if (data.success) {
               if (getCookie('username') === null) {
                  document.querySelector("#todo-create-button").classList.remove("disabled");
               }
               setCookie('username', form.get('username'));
               setCookie('secureID', data.secureID);
               setCookie('fullPomoScore', data.fullPomoScore);
               setCookie('partialPomoScore', data.partialPomoScore);
               setPomoCounter(data.fullPomoScore, data.partialPomoScore);
               loadTodos();
               resetTimer();
               popupCloseFunctionByID("account-popup");
               document.querySelector("#account-popup-login-page").classList.add("hide");
               document.querySelector("#account-popup-user-page").classList.remove("hide");
               document.querySelector('#welcome-user-heading').textContent = `Welcome back, ${getCookie('username')}!`;
            } else if (data.code === 1) {
               loginErrorMessage.classList.remove("hide");
               const inputs = document.querySelectorAll("#login-form input");
               inputs.forEach(input => { input.classList.add("form-input-shake") });
               setTimeout(() => {
                  inputs.forEach(input => { input.classList.remove("form-input-shake") });
               }, 820);
            } else {
               console.log("Login failed: " + data);
            }
            event.target.reset();
         }
      }).catch(error => {
         console.error('Error:', error);
      });
      loadingIcon.classList.add("hide");
   });
   // Registration page switch button
   document.querySelector("#go-to-login").addEventListener("click", () => {
      // Remove all elements from the page
      document.querySelector("#account-popup-registration-page").classList.add("hide");
      document.querySelector("#account-popup-login-page").classList.remove("hide");
      if (!document.querySelector("#registration-username-error").classList.contains("hide")) {
         document.querySelector("#registration-username-error").classList.add("hide");
      }
      if (!document.querySelector("#registration-password-error").classList.contains("hide")) {
         document.querySelector("#registration-password-error").classList.add("hide");
      }
   });
   // Registration submit button
   document.querySelector("#registration-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const usernameErrorMessage = document.querySelector("#registration-username-error");
      if (!usernameErrorMessage.classList.contains("hide")) {
         usernameErrorMessage.classList.add("hide");
      }
      const usernameSpaceErrorMessage = document.querySelector("#registration-username-space-error");
      if (!usernameSpaceErrorMessage.classList.contains("hide")) {
         usernameSpaceErrorMessage.classList.add("hide");
      }
      const passwordErrorMessage = document.querySelector("#registration-password-error");
      if (!passwordErrorMessage.classList.contains("hide")) {
         passwordErrorMessage.classList.add("hide");
      }
      const passwordSpaceErrorMessage = document.querySelector("#registration-password-space-error");
      if (!passwordSpaceErrorMessage.classList.contains("hide")) {
         passwordSpaceErrorMessage.classList.add("hide");
      }
      const loadingIcon = document.querySelector("#account-popup-loading-icon");
      loadingIcon.classList.remove("hide");
      const form = new FormData(event.target);
      form.append('requestType', 'register');
      if (form.get('username').includes(" ")) {
         usernameSpaceErrorMessage.classList.remove("hide");
         const usernameInput = document.querySelector("#registration-form input[type='text']");
         usernameInput.classList.add("form-input-shake");
         setTimeout(() => {
            usernameInput.classList.remove("form-input-shake");
         }, 820);
      } else if (form.get('password').includes(" ")) {
         passwordSpaceErrorMessage.classList.remove("hide");
         const passwordInput = document.querySelectorAll("#registration-form input[type='password']");
         passwordInput.forEach(input => { input.classList.add("form-input-shake") });
         setTimeout(() => {
            passwordInput.forEach(input => { input.classList.remove("form-input-shake") });
         }, 820);
      } else {
         await fetch('assets/php/database.php', {
            method: 'POST',
            body: form
         }).then(response => {
            if (response.ok) {
               return response.json();
            } else if (response.status === 400) {
               console.log('Bad request');
            } else if (response.status === 500) {
               console.log('Internal server error');
            } else {
               console.log('Error with the response from the database');
            }
         }).then(data => {
            if (data) {
               if (data.success) {
                  if (getCookie('username') === null) {
                     document.querySelector("#todo-create-button").classList.remove("disabled");
                  }
                  setCookie('username', form.get('username'));
                  setCookie('secureID', data.secureID);
                  setCookie('fullPomoScore', 0);
                  setCookie('partialPomoScore', 0);
                  loadTodos();
                  resetTimer();
                  popupCloseFunctionByID("account-popup");
                  document.querySelector("#account-popup-registration-page").classList.add("hide");
                  document.querySelector("#account-popup-user-page").classList.remove("hide");
                  document.querySelector('#welcome-user-heading').textContent = `Welcome back, ${getCookie('username')}!`;
                  event.target.reset();
               } else if (data.code === 1) {
                  usernameErrorMessage.classList.remove("hide");
                  const usernameInput = document.querySelector("#registration-form input[type='text']");
                  console.log(usernameInput);
                  usernameInput.classList.add("form-input-shake");
                  setTimeout(() => {
                     usernameInput.classList.remove("form-input-shake");
                  }, 820);
               } else if (data.code === 2) {
                  passwordErrorMessage.classList.remove("hide");
                  const passwordInput = document.querySelectorAll("#registration-form input[type='password']");
                  passwordInput.forEach(input => { input.classList.add("form-input-shake") });
                  setTimeout(() => {
                     passwordInput.forEach(input => { input.classList.remove("form-input-shake") });
                  }, 820);
               } else {
                  console.log("Failed to register: " + data);
               }
            }
         })
            .catch(error => console.error('Error:', error));
      }
      loadingIcon.classList.add("hide");
   });
   // Change password submit button
   document.querySelector("#change-password-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const currentPasswordErrorMessage = document.querySelector("#user-current-password-error");
      if (!currentPasswordErrorMessage.classList.contains("hide")) {
         currentPasswordErrorMessage.classList.add("hide");
      }
      const confirmPasswordErrorMessage = document.querySelector("#user-confirm-password-error");
      if (!confirmPasswordErrorMessage.classList.contains("hide")) {
         confirmPasswordErrorMessage.classList.add("hide");
      }
      const passwordSpaceErrorMessage = document.querySelector("#user-confirm-password-space-error");
      if (!passwordSpaceErrorMessage.classList.contains("hide")) {
         passwordSpaceErrorMessage.classList.add("hide");
      }
      const passwordOriginalErrorMessage = document.querySelector("#user-confirm-password-original-error");
      if (!passwordOriginalErrorMessage.classList.contains("hide")) {
         passwordOriginalErrorMessage.classList.add("hide");
      }
      const loadingIcon = document.querySelector("#account-popup-loading-icon");
      loadingIcon.classList.remove("hide");
      const form = new FormData(event.target);
      form.append('username', getCookie('username'));
      form.append('secureID', getCookie('secureID'));
      form.append('requestType', 'updatePassword');
      if (form.get('newPassword').includes(" ") || form.get('confirmNewPassword').includes(" ")) {
         passwordSpaceErrorMessage.classList.remove("hide");
         const newPasswordInput = document.querySelector("#changePasswordNew");
         const confirmNewPasswordInput = document.querySelector("#changePasswordConfirm");
         newPasswordInput.classList.add("form-input-shake");
         confirmNewPasswordInput.classList.add("form-input-shake");
         setTimeout(() => {
            newPasswordInput.classList.remove("form-input-shake");
            confirmNewPasswordInput.classList.remove("form-input-shake");
         }, 820);
      } else {
         await fetch('assets/php/database.php', {
            method: 'POST',
            body: form
         })
            .then(response => {
               if (response.ok) {
                  return response.json();
               } else if (response.status === 400) {
                  console.log('Bad request');
               } else if (response.status === 500) {
                  console.log('Internal server error');
               } else {
                  console.log('Error with the response from the database');
               }
            })
            .then(data => {
               if (data) {
                  if (data.success) {
                     popupCloseFunctionByID("account-popup");
                  } else if (data.code === 1) {
                     currentPasswordErrorMessage.classList.remove("hide");
                     const currentPasswordInput = document.querySelector("#changePasswordCurrent");
                     currentPasswordInput.classList.add("form-input-shake");
                     setTimeout(() => {
                        currentPasswordInput.classList.remove("form-input-shake");
                     }, 820);
                  } else if (data.code === 2) {
                     confirmPasswordErrorMessage.classList.remove("hide");
                     const newPasswordInput = document.querySelector("#changePasswordNew");
                     const confirmNewPasswordInput = document.querySelector("#changePasswordConfirm");
                     newPasswordInput.classList.add("form-input-shake");
                     confirmNewPasswordInput.classList.add("form-input-shake");
                     setTimeout(() => {
                        newPasswordInput.classList.remove("form-input-shake");
                        confirmNewPasswordInput.classList.remove("form-input-shake");
                     }, 820);
                  } else if (data.code === 3) {
                     passwordOriginalErrorMessage.classList.remove("hide");
                     const newPasswordInput = document.querySelector("#changePasswordNew");
                     const confirmNewPasswordInput = document.querySelector("#changePasswordConfirm");
                     newPasswordInput.classList.add("form-input-shake");
                     confirmNewPasswordInput.classList.add("form-input-shake");
                     setTimeout(() => {
                        newPasswordInput.classList.remove("form-input-shake");
                        confirmNewPasswordInput.classList.remove("form-input-shake");
                     }, 820);
                  } else {
                     console.log("Failed to change password: " + data);
                  }
               }
            })
            .catch(error => console.error('Error:', error));
      }
      loadingIcon.classList.add("hide");
      event.target.reset();
   });
   // Logout button
   document.querySelector("#user-logout-button").addEventListener("click", (event) => {
      event.preventDefault();
      deleteCookie('username');
      deleteCookie('secureID');
      deleteCookie('fullPomoScore');
      deleteCookie('partialPomoScore');
      popupCloseFunctionByID("account-popup");
      resetTimer();
      resetPomoCounter();
      removeTodos();
      document.querySelector("#todo-create-button").classList.add("disabled");
      document.querySelector("#account-popup-user-page").classList.add("hide");
      document.querySelector("#account-popup-login-page").classList.remove("hide");
      if (!document.querySelector("#user-current-password-error").classList.contains("hide")) {
         document.querySelector("#user-current-password-error").classList.add("hide");
      }
      if (!document.querySelector("#user-confirm-password-error").classList.contains("hide")) {
         document.querySelector("#user-confirm-password-error").classList.add("hide");
      }
   });

   /////////////// Timer Buttons ///////////////
   // Start timer button
   let index = 0;
   let currentTime;
   document.querySelector("#timer-start-button").addEventListener("click", async () => {
      const studyDuration = document.querySelector("#study-duration").value;
      const breakDuration = document.querySelector("#break-duration").value;
      const times = [studyDuration, breakDuration, studyDuration, breakDuration, studyDuration, breakDuration, studyDuration, 15];
      let pomodoros = getCookie('fullPomoScore') || 0;
      let pomoProgress = getCookie('partialPomoScore') || 0;
      const form = new FormData();
      form.append('requestType', 'getPomoScore');
      form.append('username', getCookie('username'));
      form.append('secureID', getCookie('secureID'));
      await fetch('assets/php/database.php', {
         method: 'POST',
         body: form
      })
         .then(response => {
            if (response.ok) {
               return response.json();
            } else if (response.status === 400) {
               console.log('Bad request');
            } else if (response.status === 500) {
               console.log('Internal server error');
            } else {
               console.log('Error with the response from the database');
            }
         })
         .then(data => {
            if (data) {
               if (data.success) {
                  pomodoros = data.fullPomoScore;
                  setCookie('fullPomoScore', pomodoros);
                  pomoProgress = data.partialPomoScore;
                  setCookie('partialPomoScore', pomoProgress);
                  setPomoCounter(data.fullPomoScore, data.partialPomoScore);
               } else {
                  console.log("Failed to get pomo score: " + data);
               }
            }
         })
         .catch(error => console.error('Error:', error));
      if (!timer.isActive()) {
         if (timer.getCurrentPositionMS() === 0) {
            setTimerColor("var(--accent-color)");
            currentTime = times[index] * 60000;
            timer.setTimerLength(currentTime).startTimer();
         } else {
            timer.startTimer();
         }
         const halfWay = timer.timerLengthMS / 2;
         const quarterWay = timer.timerLengthMS / 4;
         const timeDisplay = setInterval(async () => {
            if (timer.getCurrentPositionMS() === -1000) {
               clearInterval(timeDisplay);
               timer.stopTimer();
               timer.setCurrentPositionMS(0);
               if (getNotificationPermission() && document.hasFocus() === false) {
                  const notification = new Notification("Pomo - Focus Tracker", {
                     title: "Pomo - Focus Tracker",
                     body: `${times[index] === 25 ? "Its time for your break comeback and start the timer" : "Your break has finished comeback!"}`,
                     lang: "en-GB",
                     icon: "assets/images/favi.webp"
                  });
                  notification.onclick = function () {
                     window.focus();
                     notification.close();
                  };
                  notification.onshow = function () {
                     setTimeout(() => {
                        notification.close();
                     }, 5000);
                  };
                  notification.onerror = function (error) {
                     console.log("Notification error: " + error);
                  };
               }
               if (index < 7) {
                  index++;
               } else {
                  index = 0;
                  document.querySelector("#pomodoro-counter").textContent = pomodoros;
               }
               if (pomoProgress < 8) {
                  pomoProgress++;
               } else {
                  pomoProgress = 0;
                  pomodoros++;
               }
               setPomoCounter(pomodoros, pomoProgress);
               setCookie('fullPomoScore', pomodoros);
               setCookie('partialPomoScore', pomoProgress);
               if (getCookie('username') !== null && getCookie('secureID') !== null) {
                  const form = new FormData();
                  form.append('requestType', 'updatePomoScore');
                  form.append('username', getCookie('username'));
                  form.append('secureID', getCookie('secureID'));
                  form.append('fullPomoScore', pomodoros);
                  form.append('partialPomoScore', pomoProgress);
                  await fetch('assets/php/database.php', {
                     method: 'POST',
                     body: form
                  })
                     .then(response => {
                        if (response.ok) {
                           return response.json();
                        } else if (response.status === 400) {
                           console.log('Bad request');
                        } else if (response.status === 500) {
                           console.log('Internal server error');
                        } else {
                           console.log('Error with the response from the database');
                        }
                     })
                     .then(data => {
                        if (data && !data.success) {
                           console.log("Failed to update pomo score: " + data);
                        }
                     })
                     .catch(error => {
                        console.error('Error updating pomo score:', error);
                     });
               }
            } else if (timer.getCurrentPositionMS() < quarterWay) {
               setTimerColor("var(--background-color)");
            } else if (timer.getCurrentPositionMS() < halfWay) {
               setTimerColor("orange");
            } else {
               void (0);
            }
         }, 1000);
      }
   });
   // Pause timer button
   document.querySelector("#timer-pause-button").addEventListener("click", () => {
      timer.stopTimer();
   });

   /////////////// Notification popup button ///////////////
   document.querySelector('svg#notification-popup-button').addEventListener('click', () => {
      if (!getNotificationPermission() && !isIOS()) {
         Notification.requestPermission();
      }
   });
});

/////////////// Timer functions ///////////////
/**
 * Set timer progress
 * @param {int} value
 */
function setTimerProgress(value) {
   document.querySelector("#timer-circle-progress").setAttribute.bind(document.querySelector("#timer-circle-progress"))("stroke-dasharray", `${(value * 283).toFixed(0)} 283`);
}
/**
 * Timer colour function
 * @param {String} input
 */
function setTimerColor(input) {
   document.querySelector("#timer-circle-progress").style.stroke = input == null ? "green" : input;
}
/**
 * Resets timer
 */
function resetTimer() {
   timer.resetTimer();
   document.querySelector("#timer-text").textContent = "25:00";
}

/////////////// Pomo Counter functions ///////////////
/**
 * Set pomo counter
 * @param {Integer} fullPomoScore
 * @param {Integer} partialPomoScore
 */
function setPomoCounter(fullPomoScore, partialPomoScore) {
   if (fullPomoScore > 99) {
      document.querySelector("#pomodoro-counter").textContent = "99+";
   } else {
      document.querySelector("#pomodoro-counter").textContent = fullPomoScore;
   }
   setPomoCounterProgress(12.5 * partialPomoScore);
}
/**
 * Reset pomo counter
 */
function resetPomoCounter() {
   document.querySelector("#pomodoro-counter").textContent = "0";
   setPomoCounterProgress(0);
}
const pomodoroCounterCircle = document.querySelector("#counter-circle");
const pomodoroCounterRadius = pomodoroCounterCircle.r.baseVal.value;
const pomodoroCounterCircumference = pomodoroCounterRadius * 2 * Math.PI;
pomodoroCounterCircle.style.strokeDasharray = `${pomodoroCounterCircumference} ${pomodoroCounterCircumference}`;
pomodoroCounterCircle.style.strokeDashoffset = `${pomodoroCounterCircumference}`;
/**
 * Pomo counter progress function
 * @param {Number} percent
 */
function setPomoCounterProgress(percent) {
   pomodoroCounterCircle.style.strokeDashoffset = pomodoroCounterCircumference - (percent / 100) * pomodoroCounterCircumference;
}

/////////////// Todo functions ///////////////
/**
 * Load todos
 */
async function loadTodos() {
   if (getCookie('username') === null || getCookie('secureID') === null) {
      return;
   }
   const form = new FormData();
   const loadingIcon = document.querySelector("#todo-list-loading-icon");
   loadingIcon.classList.remove("hide");
   form.append('requestType', 'getTodos')
   form.append('username', getCookie('username'));
   form.append('secureID', getCookie('secureID'));
   await fetch('assets/php/database.php', {
      method: 'POST',
      body: form
   })
      .then(response => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 400) {
            console.log('Bad request');
         } else if (response.status === 500) {
            console.log('Internal server error');
         } else {
            console.log('Error with the response from the database');
         }
      })
      .then(data => {
         if (data) {
            document.querySelector("#todo-list").querySelectorAll("*").forEach(n => n.remove());
            if (data.success) {
               if (data.todos) {
                  data.todos.forEach(todo => {
                     const divTodoItem = document.createElement('div');
                     divTodoItem.classList.add('todo-item');

                     const checkBoxLabel = document.createElement('label');
                     checkBoxLabel.classList.add('check-box-container');

                     const checkBoxInput = document.createElement('input');
                     checkBoxInput.type = 'checkbox';
                     checkBoxLabel.appendChild(checkBoxInput);

                     const checkBoxSpan = document.createElement('span');
                     checkBoxSpan.classList.add('checkmark');
                     checkBoxLabel.appendChild(checkBoxSpan);

                     divTodoItem.appendChild(checkBoxLabel);
                     checkBoxLabel.addEventListener('click', async () => {
                        const form = new FormData();
                        form.append("requestType", "deleteTodo");
                        form.append("username", getCookie('username'));
                        form.append('secureID', getCookie('secureID'));
                        form.append("taskID", todo.taskID);
                        await fetch("assets/php/database.php",
                           {
                              method: "POST",
                              body: form
                           }
                        )
                           .then(response => {
                              if (response.ok) {
                                 return response.json();
                              } else if (response.status === 400) {
                                 console.log('Bad request');
                              } else if (response.status === 500) {
                                 console.log('Internal server error');
                              } else {
                                 console.log('Error with the response from the database');
                              }
                           })
                           .then(data => {
                              if (data) {
                                 if (data.success) {
                                    loadTodos();
                                 } else {
                                    console.log("Failed to delete todo: " + data);
                                 }
                              }
                           })
                           .catch(error => console.log(error));
                     });
                     divTodoItem.appendChild(checkBoxLabel);

                     const divTodoItemContainer = document.createElement('div');
                     divTodoItemContainer.classList.add('todo-item-container');
                     divTodoItemContainer.setAttribute('data-popup-open-target', 'todo-item-popup');
                     divTodoItemContainer.setAttribute('data-target-popup-type', 'todo-item-popup');
                     divTodoItemContainer.setAttribute('data-task-id', todo.taskID);
                     divTodoItem.appendChild(divTodoItemContainer);

                     const divTodoItemText = document.createElement('div');
                     divTodoItemText.classList.add('todo-text');
                     divTodoItemText.textContent = todo.taskContent;
                     divTodoItemContainer.appendChild(divTodoItemText);

                     divTodoItemContainer.addEventListener("click", () => todoPopupOpenFunction(divTodoItemContainer));
                     document.querySelector('#todo-list').appendChild(divTodoItem);
                  });
               }
            } else {
               console.log('Failed to load todos: ' + data);
            }
         }
      })
      .catch(error => {
         console.error('Error:', error);
      });
   loadingIcon.classList.add("hide");
}
/**
 * Remove todos
 */
function removeTodos() {
   document.querySelector("#todo-list").querySelectorAll("*").forEach(n => n.remove());
}

/////////////// Leaderboard functions ///////////////
/**
 * Load leaderboards
 */
async function loadLeaderboards() {
   const form = new FormData();
   form.append('requestType', 'getAllTimeLeaderboard');
   await fetch('assets/php/database.php', {
      method: 'POST',
      body: form
   })
      .then(response => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 400) {
            console.log('Bad request');
         } else if (response.status === 500) {
            console.log('Internal server error');
         } else {
            console.log('Error with the response from the database');
         }
      })
      .then(data => {
         if (data) {
            const leaderboard = document.querySelector("#leaderboard-all-time").querySelector("ul");
            leaderboard.querySelectorAll("*").forEach(n => n.remove());
            if (data.success) {
               if (data.leaderboard) {
                  data.leaderboard.forEach(user => {
                     const li = document.createElement('li');
                     li.classList.add('leaderboard-entry');
                     li.textContent = `${user.username} - ${user.fullPomoScore}`;
                     leaderboard.appendChild(li);
                  });
               }
            } else {
               console.log('Failed to load all time leaderboard: ' + data);
            }
         }
      })
      .catch(error => console.error('Error:', error));
   form.append('requestType', 'getWeeklyLeaderboard');
   await fetch('assets/php/database.php', {
      method: 'POST',
      body: form
   })
      .then(response => {
         if (response.ok) {
            return response.json();
         } else if (response.status === 400) {
            console.log('Bad request');
         } else if (response.status === 500) {
            console.log('Internal server error');
         } else {
            console.log('Error with the response from the database');
         }
      })
      .then(data => {
         if (data) {
            const leaderboard = document.querySelector("#leaderboard-weekly").querySelector("ul");
            leaderboard.querySelectorAll("*").forEach(n => n.remove());
            if (data.success) {
               if (data.leaderboard) {
                  data.leaderboard.forEach(user => {
                     const li = document.createElement('li');
                     li.classList.add('leaderboard-entry');
                     li.textContent = `${user.username} - ${user.scoreDifference}`;
                     leaderboard.appendChild(li);
                  });
               }
            } else {
               console.log('Failed to load weekly leaderboard: ' + data);
            }
         }
      })
      .catch(error => console.error('Error:', error));
}

/////////////// Popup functions ///////////////
/**
 * Popup close function by ID
 * @param {String} ID The ID of the popup to close
 */
function popupCloseFunctionByID(ID) {
   const popup = document.querySelector(`#${ID}`);
   popup.style.animation = "popupCloseAnimation 0.5s forwards";
   setTimeout(function () {
      popup.style.display = "none";
   }, 500);
   document.body.style.overflow = "auto";
}
/**
 * Popup open function
 * @param {HTMLElement} element The element that was clicked
 */
function popupOpenFunction(element) {
   const popup = document.querySelector(`#${element.getAttribute("data-popup-open-target")}`) || element;
   popup.style.animation = "popupOpenAnimation 0.5s forwards";
   popup.style.display = "flex";
   document.body.style.overflow = "hidden";
}
/**
 * Todo popup open function
 * @param {HTMLElement} element The element that was clicked
 */
function todoPopupOpenFunction(element) {
   popupOpenFunction(element);
   document.querySelector("#task-input").value = element.querySelector(".todo-text").textContent.trim();
   document.querySelector("#todo-item-popup").setAttribute("data-task-id-storage", element.getAttribute("data-task-id"));
   document.querySelector("#todo-item-save").classList.add("hide");
}

/////////////// Helper functions ///////////////
/**
 * Milliseconds to timestamp
 * @param {Number} s Milliseconds
 * @returns {String} Timestamp
 */
function msToTime(s) {
   function pad(n, z) {
      z = z || 2;
      return ("00" + n).slice(-z);
   }
   const ms = s % 1000;
   s = (s - ms) / 1000;
   const secs = s % 60;
   s = (s - secs) / 60;
   const mins = s % 60;
   return `${pad(mins)}:${pad(secs)}`;
}
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
 * setCookie
 * Stores a cookie with the name and value that's provided
 * @param {String} name The name of the cookie
 * @param {any} value The value of the cookie
 * @param {"Strict" | "Lax" | "None"} SameSite The type of SameSite to use
 * @param {Number} expires The number of days until the cookie expires
 */
function setCookie(name, value, SameSite = "Strict", expires = 1) {
   const date = new Date();
   date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
   document.cookie = `${name}=${value || ""}; expires=${date.toString()}; SameSite=${SameSite}; secure=true; path=/`;
}
/**
 * deleteCookie
 * Deletes the cookie with the provided name
 * @param {String} name The name of the cookie
 * @param {"Strict" | "Lax" | "None"} SameSite The type of SameSite to use
 */
function deleteCookie(name, SameSite = "Strict") {
   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=${SameSite}; secure=true; path=/;`;
}
/**
 * getCookie
 * Get's the value of the cookie with the provided name
 * @param {String} name The name of the cookie
 * @returns {any} The value of the cookie
 */
function getCookie(name) {
   const nameEQ = name + "=";
   for (let cookie of document.cookie.split(';')) {
      while (cookie.startsWith(' ')) {
         cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.startsWith(nameEQ)) {
         return cookie.substring(nameEQ.length, cookie.length);
      }
   }
   return null;
}