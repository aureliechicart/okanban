const listModule = {

  base_url: null,

  setBaseUrl: url => {
    listModule.base_url = url;
  },

  showAddListModal: () => {
    const div = document.getElementById('addListModal');
    div.classList.add('is-active');
  },

  handleAddListForm: async event => {
    // we deactivate the default behaviour to avoid page reload
    event.preventDefault();
    // we get the form data and save them into a FormData object
    // FormData can extract all the inputs inside a <form> element, whatever their nesting level in the html document
    const formData = new FormData(event.target);

    // we give a value to the position field in our new list
    const position = document.querySelectorAll('.is-one-quarter').length;
    formData.set('position', position);

    try {

      // we use fetch with POST method to send the info to the API and add the new list in DB
      const result = await fetch(`${listModule.base_url}/lists`, {
        method: 'POST',
        body: formData
      });

      if (result.ok) {
        const json = await result.json();
        listModule.makeListInDOM(json);
      } else {
        console.error('On a eu un pépin sur le serveur');
      }

    } catch (error) {
      console.error('Impossible d\'ajouter la liste', error);
    }
  },

  makeListInDOM: data => {
    // on we grab the template
    const template = document.getElementById('listTemplate');
    // we will create a new html node by cloning the template AND including all the elements it contains
    const node = document.importNode(template.content, true);

    // now we use the JSON object we recieved as a parameter to set up our new HTML element
    const h2 = node.querySelector('h2');
    h2.textContent = data.name;
    // we make the h2 react to double-click in order to display the edit form
    h2.addEventListener('dblclick', listModule.showListNameForm);

    // we watch for click events on cancel button
    node.querySelector('.cancel-edit-list-button').addEventListener('click', listModule.closeEditListForm);

    // we add an event listener for submit events on the edit form
    node.querySelector('form').addEventListener('submit', listModule.handleListNameForm);


    // we take advantage of the creation step to update the info stored in attributes with the data we got from the DB : name and list_id
    node.querySelector('.is-one-quarter').setAttribute('data-list-id', data.id);
    node.querySelector('[name="list-id"]').value = data.id

    // in the new list, we add the 'add card' feature
    // why? Because this feature is applied to existing lists when the page loads, and not on newly created lists
    node.querySelector('.button--add-card').addEventListener('click', cardModule.showAddCardModal);

    // we add an event listener on the X to trigger the deletion of the list
    node.querySelector('.fa-times').closest('a').addEventListener('click', listModule.deleteList);

    // we add the html node at the right place, in 1st position of the list of lists
    // we have to add a test to check if the page contains at least one list
    // if so, we can select it and use the before() method to place the new list
    // if not, we have to select the lists container and use the appendChild method to insert the first list
    const firstList = document.querySelector('.is-one-quarter');

    if (firstList) {
      firstList.before(node);
    } else {
      document.querySelector('.card-lists').appendChild(node);
    }

  },

  deleteList: async event => {
    // asking the user to confirm deletion in order to avoid unvoluntary operations before definitively deleting DB records
    if (!confirm('Supprimer cette liste et les cartes qu\'elle contient ?')) {
      return;
    }

    const list = event.target.closest('.is-one-quarter');
    const listId = list.getAttribute('data-list-id');

    //DELETE /lists/id

    try {
      const result = await fetch(`${listModule.base_url}/lists/${listId}`, {
        method: 'DELETE'
      });

      if (result.ok) {
        // we remove the list from the DOM
        list.remove();
      } else {
        console.error('On a eu un pépin sur le serveur');
      }

    } catch (error) {
      console.error('Impossible de supprimer cette liste', error);
    }

  },

  showListNameForm: event => {
    // we make sure the h2 is hidden, we get a reference to it in event.target
    event.target.classList.add('is-hidden');
    // to grab the form, we have to start from the h2, the only reference to an HTML element we have here
    //we use the closest() method which goes up in the HTML hierarchy until it finds an element which contains the form we are trying to target
    const form = event.target.closest('.column').querySelector('form');
    // we make sure the form is displayed (not hidden)
    form.classList.remove('is-hidden');
    // in the input, we add the h2 content as value
    form.querySelector('[name="name"]').value = event.target.textContent;
  },

  handleListNameForm: async event => {
    event.preventDefault();
    // we create a FormData object based on the form
    const formData = new FormData(event.target);

    // we check if the user did type in something in the name field
    // if not, we exit he function and we display an error
    if (formData.get('name') === '') {
      console.error('Veuillez saisir un nom pour cette liste');
      // we use the keyword return to exit the function without running the rest of the code
      return;
    }

    const h2 = event.target.closest('.is-one-quarter').querySelector('h2');

    // we will update the list info in DB using fetch
    try {
      // we update the list's name in the DB
      const result = await fetch(`${listModule.base_url}/lists/${formData.get('list-id')}`, {
        method: 'PATCH',
        body: formData
      });

      if (result.ok) {
        const json = await result.json();
        if (json) {
          h2.textContent = formData.get('name');
        } else {
          console.error('Mise à jour impossible, vérifiez les logs du serveur');
        }
      } else {
        console.error('On a eu pépin sur le serveur');
      }

    } catch (error) {
      console.error('Impossible de mettre la liste à jour', error);
    } finally {
      // we make sure the form is hidden
      event.target.classList.add('is-hidden');
      // we make the h2 visible again
      h2.classList.remove('is-hidden');

    }
  },
  closeEditListForm: (event) => {
    const listElement = event.target.closest('.column .is-one-quarter');

    // we hide the edit list name form
    const editForm = listElement.querySelector('form[method="PATCH"]');
    editForm.classList.add('is-hidden');
    // we make the list title visible again
    const h2 = listElement.querySelector('h2');
    h2.classList.remove('is-hidden');
  }
}