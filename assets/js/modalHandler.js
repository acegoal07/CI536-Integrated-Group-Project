class ModalHandler {
   constructor() {
      this.modal = null;
   }

   /**
    * Open the modal
    * @param {String} modalId - The id of the modal to open
    * @param {Function} callback - The function to execute after opening
    * @returns {void}
    */
   async open(modalId, callback = null) {
      if (this.modal || !modalId) { return; }
      this.modal = document.querySelector(`#${modalId}`);
      if (callback) { callback(); }
      this.modal.style.animation = "popupOpenAnimation 0.5s forwards";
      this.modal.style.display = "flex";
      document.body.style.overflow = "hidden";
   }

   /**
    * Close the modal
    * @param {Function} callback - The function to execute after closing
    * @returns {void}
    */
   async close(callback = null) {
      if (!this.modal) { return; }
      this.modal.style.animation = "popupCloseAnimation 0.5s forwards";
      setTimeout(() => {
         this.modal.style.display = "none";
         if (callback) { callback(); }
         this.modal = null;
      }, 500);
   }

   /**
    * Get the modal element
    * @returns {HTMLElement} - The modal element
    */
   getModal() {
      return this.modal;
   }
}

window.addEventListener("load", () => {
   const ModalHandlerInstance = new ModalHandler();
   document.querySelectorAll(".modal-opener").forEach(modalOpener => {
      modalOpener.addEventListener("click", () => ModalHandlerInstance.open(modalOpener.getAttribute("modal-target")));
   });

   document.addEventListener('openModal', (opener) => {
      if (opener.detail.callback) {
         ModalHandlerInstance.open(opener.detail.target, opener.detail.callback);
      } else {
         ModalHandlerInstance.open(opener.detail.target);
      }
   });

   document.querySelectorAll(".modal-closer").forEach(modalCloser => {
      modalCloser.addEventListener("click", () => {
         if (!ModalHandlerInstance.getModal().contains(modalCloser)) { return; }
         ModalHandlerInstance.close()
      });
   });

   document.addEventListener('closeCurrentModal', (closer) => {
      if (closer.detail) {
         ModalHandlerInstance.close(closer.detail.callback);
      } else {
         ModalHandlerInstance.close();
      }
   });
});