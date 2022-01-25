const cardModule = {

  base_url: null,

  setBaseUrl: url => {
    cardModule.base_url = url;
  },

  showAddCardModal: event => {
    // we get the value of data-list-id by using the reference to the clicked element
    const listId = event.target.closest('.is-one-quarter').getAttribute('data-list-id');
    const div = document.getElementById('addCardModal');
    // console.log(div.querySelector('input[name="list_id"]'));
    // we update the value attribute in the hidden field of the form
    div.querySelector('input[name="list_id"]').value = listId;
    div.classList.add('is-active');
  },

  handleAddCardForm: async event => {
    // we deactivate the default behaviour
    event.preventDefault();
    // we get the form info and save them into a FormData object
    const formData = new FormData(event.target);

    // we calculate the position of our new card
    // we select the new card based on the value of list_id we have in the formData object
    // to respect the selection syntax for an attribute, we have to specify the value of list_id as a string
    // [data-list-id=12] would be incorrect, we have to specify [data-list-id="12"]
    const position = document.querySelectorAll(`[data-list_id="${formData.get('list_id')}"] .box`).length;
    console.log('position : ', position);
    formData.set('position', position);

    try {
      // we wait for the DB to answer before going on
      // thanks to multer which was added to our API, we can directly pass the  formData object in the request's body, Express will know how to extract the info and place them in request.body
      const result = await fetch(`${cardModule.base_url}/cards`, {
        method: 'POST',
        body: formData
      });

      // we test whether the request succeeded (status 200) 
      if (result.ok) {
        const json = await result.json();
        cardModule.makeCardInDOM(json);
      } else {
        console.error('On a eu un pépin sur le serveur');
      }


    } catch (error) {
      console.error('Impossible d\'ajouter la carte', error);
    }
  },


  makeCardInDOM: data => {
    // we grab the card template
    const template = document.getElementById('cardTemplate');
    // we create a new node by cloning our template
    const node = document.importNode(template.content, true);
    // we set up the new card
    node.querySelector('.column').textContent = data.content;

    // we select the card container based on its CSS class
    const box = node.querySelector('.box');
    box.style.backgroundColor = data.color;
    box.setAttribute('data-card-id', data.id);

    // we hook an event listener on the <a> tag which contains the pencil icon
    const editLink = box.querySelector('.fa-pencil-alt').closest('a');
    editLink.addEventListener('click', cardModule.showCardTitleForm);

    //o we add an event listener to the <a> tag which contains the bin icon
    const deleteLink = box.querySelector('.fa-trash-alt').closest('a');
    deleteLink.addEventListener('click', cardModule.deleteCard);

    // we hook an event listener to watch for submit events of the edit form
    box.querySelector('form').addEventListener('submit', cardModule.handleCardTitleForm);
    // and for clicks on cancel button
    box.querySelector('button.cancel-edit-card').addEventListener('click', cardModule.closeCardEditForm);

    box.querySelector('.tag-associate-button-column').addEventListener('click', tagModule.showAssociateLabelForm);


    // we add the node at the right place in the DOM
    // we target the html element which has a data-list-id attribute whose value is the same as list_id in our form
    // in this element, we target the sub-element with '.panel-block' class: this element is supposed to contain the cards of a list
    // we add our new card in that element
    document.querySelector(`[data-list-id="${data.list_id}"] .panel-block`).appendChild(node);

  },

  deleteCard: async event => {
    // asking the user to confirm deletion
    if (!confirm('Supprimer cette carte ?')) {
      // if the user answers no, we exit the method without executing the rest of the code
      return;
    }

    // we will identify the card to delete based on our event.target
    const card = event.target.closest('.box');

    // we get the id of the card
    const cardId = card.getAttribute('data-card-id');

    // fetch reguest
    // DELETE /cards/:id
    try {

      const result = await fetch(`${cardModule.base_url}/cards/${cardId}`, {
        method: 'DELETE'
      });

      if (result.ok) {
        // if all went well, we delete the card in DOM
        card.remove();
      } else {
        // if not, we display an error message
        console.error('On a eu un pépin sur le serveur');
      }
    } catch (error) {
      console.error('Impossible de supprimer cette carte', error);
    }

  },

  showCardTitleForm: event => {
    // we target the container div of a card
    const div = event.target.closest('.box');
    // we hide the div containing the title of the card
    const title = div.querySelector('.column');
    title.classList.add('is-hidden');
    // we hide the action buttons
    div.querySelector('.card-actions-group').classList.add('is-hidden');

    // we display the edit form
    div.querySelector('form').classList.remove('is-hidden');
    // in the input of the form, we add the title of the card as value
    div.querySelector('[name="content"]').value = title.textContent;

  },

  handleCardTitleForm: async event => {
    // we deactivate the default behaviour to avoid page reload
    event.preventDefault();
    // we centralize the form data in a FormData object
    const formData = new FormData(event.target);

    // we check whether the user did type in something in the title field
    // if not, we exit the function and we display an error
    if (formData.get('content') === '') {
      console.error('Veuillez saisir un titre pour cette carte');
      // we use the keyword return to exit the function without running the rest of the code
      return;
    }

    const title = event.target.closest('.box').querySelector('.column');
    const div = event.target.closest('.box');

    try {
      // we update the card record in DB via request sent to our API
      const result = await fetch(`${cardModule.base_url}/cards/${event.target.closest('.box').getAttribute('data-card-id')}`, {
        method: 'PATCH',
        body: formData
      });

      if (result.ok) {
        const json = await result.json();
        if (json) {
          // the update was successful
          // we select the div which contains the title to update it
          title.textContent = formData.get('content');
          div.querySelector('.card-actions-group').classList.remove('is-hidden');
          cardModule.makeCardInDOM(json);
        } else {
          console.error('Aucune carte mise à jour');
        }
      } else {
        console.error('On a eu un pépin sur le serveur');
      }
    } catch (error) {
      console.error('Impossible de mettre la carte à jour', error);
    } finally {
      title.classList.remove('is-hidden');
      event.target.classList.add('is-hidden');
    }
  },
  closeCardEditForm: (event) => {
    const editForm = event.target.closest('form[method="PATCH"]');
    console.log(editForm);
    editForm.classList.add('is-hidden');
  }
}