const app = {

  // init function, laucnhed upon page load
  init: function () {
    console.log('app.init !');
    //adding method that will handle the adding done by event listeners
    app.addListenerToActions();
  },

  addListenerToActions: () => {
    // on the add button of lists, we add an event listener to open the modal
    const button = document.getElementById('addListButton');
    button.addEventListener('click', app.showAddListModal);
    console.log(button);

    // we target all the elements with class 'close' to add an event listerner to them, which will close the modal
    const closeButtons = document.querySelectorAll('.close');
    for (const closeButton of closeButtons) {
      closeButton.addEventListener('click', app.hideModals);
    }

    // we target the add form of any list 
    const form = document.querySelector('#addListModal form');
    console.log(form);
    form.addEventListener('submit', app.handleAddListForm);

    // we target the '+' buttons of any card
    const addCardButtons = document.getElementsByClassName('button--add-card');
    for (const button of addCardButtons) {
      button.addEventListener('click', app.showAddCardModal);
    }

    // we target the add form of any card
    const cardForm = document.querySelector('#addCardModal form');
    cardForm.addEventListener('submit', app.handleAddCardForm);

  },

  hideModals: () => {
    // we grab all elements with 'modal' class
    const modals = document.querySelectorAll('.modal');
    // we run a loop on the array and, for each element, we remove 'is-active' class
    for (const modal of modals) {
      modal.classList.remove('is-active');
    }
  },

  showAddListModal: () => {
    const div = document.getElementById('addListModal');
    div.classList.add('is-active');
  },

  showAddCardModal: event => {
    console.log('Je suis dans showAddCardModal');
    // we get the value of data-list-id by using the reference to the clicked element
    const listId = event.target.closest('.panel').getAttribute('data-list-id');
    console.log('List id : ', listId);
    const div = document.getElementById('addCardModal');
    // we update the value attribute in the hidden field of the form
    div.querySelector('[name="list_id"]').value = listId;
    div.classList.add('is-active');
  },

  handleAddListForm: event => {
    // we deactivate the default behaviour to avoid page reload
    event.preventDefault();
    // we get the form data and save them into a FormData object
    // FormData can extract all the inputs inside a <form> element, whatever their nesting level in the html document
    const formData = new FormData(event.target);
    // we call the makeListInDOM method and we pass the extracted form info as an argument
    app.makeListInDOM(formData);

    // we close all modals
    app.hideModals();

  },

  handleAddCardForm: event => {
    // we dactivate the default behaviour
    event.preventDefault();
    // we get the form info and save them into a FormData object
    const formData = new FormData(event.target);
    // we call the makeCardInDOM method and pass the data form as an argument
    app.makeCardInDOM(formData);
    // we close all modals
    app.hideModals();
  },

  makeListInDOM: data => {
    // we grab the template
    const template = document.getElementById('listTemplate');
    // we will create a new html node by cloning the template AND including all the elements it contains
    const node = document.importNode(template.content, true);
    // we create the new list based on the information the user typed in the form
    node.querySelector('h2').textContent = data.get('name');
    // in the new list, we add the 'add card' feature
    // why? Because this feature is applied to existing lists when the page loads, and not on newly created lists
    node.querySelector('.button--add-card').addEventListener('click', app.showAddCardModal);
    // we add the html node at the right place, in 1st position of the list of lists
    document.querySelector('.is-one-quarter').before(node);

  },

  makeCardInDOM: data => {
    // we grab the card template
    const template = document.getElementById('cardTemplate');
    // we create a new node by cloning our template
    const node = document.importNode(template.content, true);
    // we set up the new card
    node.querySelector('.column').textContent = data.get('name');
    // we add the node at the right place in the DOM
    // we target the html element which has a data-list-id attribute whose value is the same as list_id in our form
    // in this element, we target the sub-element with '.panel-block' class: this element is supposed to contain the cards of a list
    // we add our new card in that element
    document.querySelector(`[data-list-id="${data.get('list_id')}"] .panel-block`).appendChild(node);

  }

};

// we hook an event listener on the document: when the loading is done, we launch app.init
document.addEventListener('DOMContentLoaded', app.init);