// Onload handler
window.addEventListener("load", async () => {
   /////////////// Onload changes ///////////////
   document.querySelector("#study-duration").value = 25;
   document.querySelector("#break-duration").value = 5;
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