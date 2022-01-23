const app = {

  // initialization function, launched upon page load
  init: function () {
    console.log('app.init !');
  }

};

// we hook an event listener on the document: when the loading is done, we launch app.init
document.addEventListener('DOMContentLoaded', app.init );