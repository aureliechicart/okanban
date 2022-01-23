const app = {
  base_url: 'http://localhost:5050',

  // init function, laucnhed upon page load
  init: async function () {
    console.log('app.init !');

    //we dispatch the base_url info to the modules which need it
    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);
    tagModule.setBaseUrl(app.base_url);

    // upon page load, we want to get the existsing lists in DB
    // we declared the init method as async: we can wait for the getListsFromAPI function to finish its before running the next instructions
    await app.getListsFromAPI();
    // adding method that will handle the adding done by event listeners
    app.addListenerToActions();
  },

  addListenerToActions: () => {
    // on the add button of lists, we add an event listener to open the modal
    const button = document.getElementById('addListButton');
    button.addEventListener('click', listModule.showAddListModal);

    // we target the close and X buttons and the modal background to add an event listerner to them, which will close the modal
    const closeElements = document.querySelectorAll('.close, .modal-close, .modal-background');
    for (const closeElement of closeElements) {
      closeElement.addEventListener('click', app.hideModals);
    }

    // we target the add form of any list 
    const form = document.querySelector('#addListModal form');
    form.addEventListener('submit', app.handleAddListForm);

    // In the version without real data, we were adding an EventListener on all add card buttons for the hard-coded lists in the HTML
    // Now we go through the API to retrieve rela data, calling the method which will register all the listeners will happen after lists are generated in HTML
    // We have included adding the EventListener at the creation of the list, we don't need to add it here

    // we target the '+' buttons of any card
    // const addCardButtons = document.getElementsByClassName('button--add-card');
    // for (const button of addCardButtons) {
    //   button.addEventListener('click', app.showAddCardModal);
    // }

    // we target the add form of any card
    const cardForm = document.querySelector('#addCardModal form');
    cardForm.addEventListener('submit', app.handleAddCardForm);
  },


  handleAddListForm: event => {
    // to make sure listModule doesn't have to refer to app in its code, we leave the declaration fo the method in app
    // we delegate the list-specific processing to the module and we clode the modals form app 
    listModule.handleAddListForm(event);
    app.hideModals();
  },

  handleAddCardForm: event => {
    cardModule.handleAddCardForm(event);
    app.hideModals();
  },

  hideModals: () => {
    // we grab all elements with 'modal' class
    const modals = document.querySelectorAll('.modal');
    // we run a loop on the array and, for each element, we remove 'is-active' class
    for (const modal of modals) {
      modal.classList.remove('is-active');
    }
  },

  getListsFromAPI: async () => {
    try {
      const result = await fetch(`${app.base_url}/lists`);
      if (result.ok) {

        const json = await result.json();
        // with fetch, get an array of list objects
        // To create the lists in the DOM, we loop on this array and, for each element, we call the makeListInDOM method
        for (const list of json) {
          listModule.makeListInDOM(list);
          // for each element of the lists array, we use the cards property which contains a cards array for this list
          // we loop on this array and, for each element, we call the makeCardInDOM method
          for (const card of list.cards) {
            console.log(list.cards);
            cardModule.makeCardInDOM(card);
            // if we have elements in the tags property of the card, we loop through the array to create an element per tags
            if (card.tags) {
              for (const tag of card.tags) {
                tagModule.makeTagInDOM(tag, card.id);
              }
            }
          }
        }
      } else {
        console.error('Pépin au niveau du serveur');
      }
    } catch (error) {
      console.error('Impossible de charger les listes depuis l\'API', error);
    }
  }
}

// we hook an event listener on the document: when the loading is done, we launch app.init
document.addEventListener('DOMContentLoaded', app.init);