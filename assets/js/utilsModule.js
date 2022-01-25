
const utilsModule = {
  hideModals: () => {
    // we grab all elements with 'modal' class
    const modals = document.querySelectorAll('.modal');
    // we run a loop on the array and, for each element, we remove 'is-active' class
    for (const modal of modals) {
      modal.classList.remove('is-active');
    }
  },
}

module.exports = utilsModule;