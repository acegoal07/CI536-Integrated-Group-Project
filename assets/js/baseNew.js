// Disable drag and drop
window.ondragstart = function () {
   return false;
};
window.ondrop = function () {
   return false;
};
// Onload handler
window.addEventListener("load", async () => {
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
   /////////////// Custom leaderboard opener ///////////////
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
   /////////////// Custom create todo modal opener ///////////////
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
});