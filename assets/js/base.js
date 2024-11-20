const PomoTimerInstance = new PomoTimer();


/////////////// Focus listener ///////////////
const docTitle = document.title;
window.onblur = function () {
   PomoTimerInstance.setBlurred(true);
};
window.onfocus = function () {
   PomoTimerInstance.setBlurred(false);
   document.title = docTitle;
};


/////////////// Disable drag and drop ///////////////
window.ondragstart = function () {
   return false;
};
window.ondrop = function () {
   return false;
};


/////////////// Onload handler ///////////////
window.addEventListener("load", async () => {


   /////////////// Onload changes ///////////////
   setTimerColor("var(--background-color)");
   document.querySelector("#timer-circle-progress").classList.add("timer-circle-progress-transition");
   document.querySelectorAll("form").forEach(form => form.reset());


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


   /////////////// leaderboard functions ///////////////
   // Leaderboard modal opener
   document.querySelector("#leaderboard-modal-opener").addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent('openModal', {
         detail: {
            target: 'leaderboard-popup',
            callback: async () => {
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
         }
      }));
   });
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


   /////////////// Create todo functions ///////////////
   // Create todo modal opener
   document.querySelector('#todo-create-button').addEventListener('click', () => {
      if (getCookie('username') !== null) {
         document.dispatchEvent(new CustomEvent('openModal', {
            detail: {
               target: 'create-todo-popup'
            }
         }));
      } else {
         document.dispatchEvent(new CustomEvent('openModal', {
            detail: {
               target: 'account-popup'
            }
         }));
      }
   });
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
                     document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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
      document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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
               document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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


   /////////////// Account functions ///////////////
   // Login page switch button
   document.querySelector("#go-to-registration").addEventListener("click", () => {
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
               document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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
                  document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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
                     document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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
      document.dispatchEvent(new CustomEvent('closeCurrentModal'));
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


   /////////////// Information functions ///////////////
   // Information modal opener
   document.querySelector("#information-modal-opener").addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent('openModal', {
         detail: {
            target: 'information-popup',
            callback: () => {
               console.log("Information modal opened");
               const flkty = Flickity.data(document.querySelector('.main-carousel'));
               for (let i = 0; i < 50; i++) {
                  flkty.resize();
               }
            }
         }
      }));
   });
});


/////////////// Todo functions ///////////////
/**
 * Load todos
 */
async function loadTodos() {
   if (getCookie('username') === null || getCookie('secureID') === null) { return; }
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
                     divTodoItemContainer.setAttribute('data-task-id', todo.taskID);
                     divTodoItem.appendChild(divTodoItemContainer);

                     const divTodoItemText = document.createElement('div');
                     divTodoItemText.classList.add('todo-text');
                     divTodoItemText.textContent = todo.taskContent;
                     divTodoItemContainer.appendChild(divTodoItemText);

                     divTodoItemContainer.addEventListener("click", () => {
                        document.dispatchEvent(new CustomEvent('openModal', {
                           detail: {
                              target: 'todo-item-popup',
                              callback: () => {
                                 document.querySelector("#task-input").value = element.querySelector(".todo-text").textContent.trim();
                                 document.querySelector("#todo-item-popup").setAttribute("data-task-id-storage", element.getAttribute("data-task-id"));
                                 document.querySelector("#todo-item-save").classList.add("hide");
                              }
                           }
                        }));
                     });
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

/////////////// Timer functions ///////////////
/**
 * Reset timer
 */
function resetTimer() {
   document.querySelector("#timer-text").textContent = "25:00";
   PomoTimerInstance.resetTimer();
}