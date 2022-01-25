const tagModule = {
  base_url: null,

  setBaseUrl: url => {
    tagModule.base_url = url;
  },
  makeTagInDOM: (tag, cardId) => {
    // Get the template
    const template = document.querySelector('#tagTemplateforCard');
    // we duplicate the HTML content from the template
    const newTag = document.importNode(template.content, true);
    // we update the tag name
    newTag.querySelector('.card__tag').textContent = tag.name;
    // we add the tag id as an attribute
    newTag.querySelector('.card__tag__column').setAttribute('data-tag-id', tag.id);

    newTag.querySelector('form input[name="card_id"]').value = cardId;
    newTag.querySelector('form input[name="id"]').value = tag.id;

    // upon click on the edit icon, we display the edit tag form
    newTag.querySelector('.card__tag').addEventListener('dblclick', tagModule.showEditTagForm);
    newTag.querySelector('form').addEventListener('submit', tagModule.handleEditTagForm);
    newTag.querySelector('.disassociate-tag').addEventListener('click', tagModule.handleDissociateTag);


    // we insert the tag in DOM within cards with which they are associated
    document.querySelector(`[data-card-id="${cardId}"] .card__tags`).appendChild(newTag);

    // we close the modal
    app.hideModals();

  },
  showAddTagForm: (event) => {
    console.log("ajout de label");
    // we get the add tag modal
    const tagModal = document.querySelector("#addTagModal");
    // we display the modal
    tagModal.classList.add('is-active');

  },
  showEditTagForm: (event) => {
    console.log(`Édition d'un tag`);

    // we get the tag which is to be modified
    const tagElement = event.target.closest('.card__tag__column');

    // we display the edit form for that tag
    tagElement.querySelector('form').classList.remove("is-hidden");

    const input = tagElement.querySelector('form input[name="name"]');
    // we make sure the form input is automatically in focus 
    input.focus();

    // we hide the title
    tagElement.querySelector('.card__tag').classList.add('is-hidden');
  },
  handleEditTagForm: async (event) => {
    event.preventDefault();
    console.log(`submit de l'édition d'un tag`);

    // we get the data from the form
    const formData = new FormData(event.target);
    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    const tagId = formData.get('id');
    const newTagTitle = formData.get('name');

    try {
      // we send a request to the API to save the title change in DB
      const requestParam = {
        method: 'PATCH',
        body: formData
      };
      const response = await fetch(`${app.base_url}/tags/${tagId}`, requestParam);

      if (!response.ok) {
        // if there is an error
        const error = await response.json();
        throw error;
      }

      // If it works, we change the span textcontent witht new name
      const tagElement = event.target.closest('.card__tag__column');
      tagElement.querySelector('.card__tag').textContent = formData.get('name');

      // we hide the form and we display the title again
      tagElement.querySelector('form').classList.add('is-hidden');
      tagElement.querySelector('.card__tag').classList.remove('is-hidden');

      // we modify the title in all cards which have this tag
      const tagInstances = document.querySelectorAll(`[data-tag-id="${tagId}"]`);
      for (const tagElement of tagInstances) {
        tagElement.textContent = newTagTitle;
      }

      // we modify it in the tags block
      // we clear the tags block and we get the new list of tags
      const tagsDivElement = document.querySelector(".tags__block");
      while (tagsDivElement.firstChild) {
        tagsDivElement.firstChild.remove()
      }
      tagModule.getTagsFromAPI();

    } catch (error) {
      console.log(error);
    }

  },
  handleAddTagForm: async (event) => {
    event.preventDefault();
    console.log(`Soumission de l'ajout d'un tag`);
    // we hide the error message if it has been triggered at the last opening
    document.querySelector(".tag-exists").classList.add("is-hidden");

    // we get data from the foem
    const formData = new FormData(event.target);
    formData.append('color', '#FFFFFF');

    // we display the key/value pairs
    // for (const pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    try {
      // we check if this tag already exists in DB
      const response = await fetch(`${app.base_url}/tags`);
      const tags = await response.json();
      const foundTag = tags.find(tag => {
        return tag.name === formData.get('name');
      });
      // If we find a tag with this name
      if (foundTag) {
        // we display an error message tot the user
        document.querySelector(".tag-exists").classList.remove("is-hidden");
      } else {
        // If not we add it in DB
        const requestParam = {
          method: 'POST',
          body: formData
        }
        // for (var pair of formData.entries()) {
        //   console.log(pair[0] + ', ' + pair[1]);
        // }

        const responseCreate = await fetch(`${app.base_url}/tags`, requestParam);
        // If the operation succeeds
        if (responseCreate.ok) {
          const tag = await responseCreate.json();
          // we add the tag in the DOM (tags block)
          // for that, we get the tag template 
          const template = document.querySelector('#tagTemplateforTagList');
          // we duplicate the HTML contained in the template
          const newTag = document.importNode(template.content, true);
          // we update the element text with the new tag name
          newTag.querySelector('.card__tag').textContent = tag.name;
          // we add the tag id as an attribute
          newTag.querySelector('.card__tag__column').setAttribute('data-tag-id', tag.id);
          newTag.querySelector('form input[name="card_id"]').value = tag.card_id;
          newTag.querySelector('form input[name="id"]').value = tag.id;
          // upon double-click on a tag, we display the tag edit form
          newTag.querySelector('.card__tag').addEventListener('dblclick', tagModule.showEditTagForm);
          newTag.querySelector('form').addEventListener('submit', tagModule.handleEditTagForm);
          newTag.querySelector('.delete-tag').addEventListener('click', tagModule.deleteTag);
          // we insert the new tag in DOM
          document.querySelector(".tags__block").appendChild(newTag);

          // we close the modal
          app.hideModals();
        }
        else {
          const error = await responseCreate.json();
          throw error;
        }
      }
    } catch (error) {
      console.log(error);
    }

  },
  getTagsFromAPI: async () => {
    // we get all the tags from DB
    try {
      const response = await fetch(`${app.base_url}/tags`);
      const tags = await response.json();
      for (const tag of tags) {
        // we get the template 
        const template = document.querySelector('#tagTemplateforTagList');
        // we duplicate the HTM contained in the template
        const newTag = document.importNode(template.content, true);
        // we update the element text with the new tag name
        newTag.querySelector('.card__tag').textContent = tag.name;
        // we add the tag id as an attribute
        newTag.querySelector('.card__tag__column').setAttribute('data-tag-id', tag.id);
        newTag.querySelector('form input[name="card_id"]').value = tag.card_id;
        newTag.querySelector('form input[name="id"]').value = tag.id;
        // upon double-click on a tag, we display the tag edit form
        newTag.querySelector('.card__tag').addEventListener('dblclick', tagModule.showEditTagForm);
        newTag.querySelector('form').addEventListener('submit', tagModule.handleEditTagForm);
        newTag.querySelector('.delete-tag').addEventListener('click', tagModule.deleteTag);

        // we insert the tag in the DOM (tags block)
        document.querySelector(".tags__block").appendChild(newTag);

      }
    } catch (error) {
      console.log(error);
    }
  },
  showAssociateLabelForm: async (event) => {
    // we reset the selection from last opening
    const tagsSelectElement = document.getElementById('select-tags');
    tagsSelectElement.setAttribute('default-value', 'default');

    // we get the value of data-list-id by using the reference to the clicked element
    const cardId = event.target.closest('.box').getAttribute('data-card-id');

    const associateTagModal = document.getElementById("associateTagModal");

    associateTagModal.querySelector('input[name="card-id"]').value = cardId;
    associateTagModal.classList.add('is-active');

    try {
      const response = await fetch(`${app.base_url}/tags`);
      const tags = await response.json();

      const selectElement = document.getElementById('label-select');
      // to avoid duplicates and to plan fro newly added tags,
      // we start by clearing the select element from all tags
      for (const childNode of selectElement.childNodes) {
        if (childNode.value !== 'default') {
          childNode.remove();
        }
      }


      for (const tag of tags) {
        const option = document.createElement('option');
        option.textContent = tag.name;
        option.setAttribute('value', tag.id);

        selectElement.appendChild(option);
      }

    } catch (error) {
      console.log(error);
    }
  },

  handleAssociateLabelForm: async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cardId = formData.get('card-id');

    for (var pair of formData.entries()) {
      // we loop through tag ids in formdata
      if (pair[0] === 'tag-id') {
        const tagId = parseInt(pair[1], 10);

        // we associate this tag with this card  in db
        const associateFormData = new FormData();
        associateFormData.append('tag_id', tagId);

        const requestParam = {
          method: 'POST',
          body: associateFormData
        }

        try {
          const response = await fetch(`${app.base_url}/cards/${cardId}/tags`, requestParam);
          if (response.ok) {
            const newAssociation = await response.json();

            const fullTag = newAssociation.tags.find(tag => tag.id === tagId);
            console.log('fullTag : ', fullTag);
            tagModule.makeTagInDOM(fullTag, cardId);

          }
          else {
            const error = await response.json();
            throw error;
          }

        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  handleDissociateTag: async (event) => {
    console.log("Dissociation d'un label");
    // we get the span element of the tag name
    const tagElement = event.target.closest('.card__tag__column');
    const tagId = tagElement.getAttribute("data-tag-id");
    const cardElement = event.target.closest('.box');

    const cardId = cardElement.getAttribute('data-card-id');
    // we send a fetch request with method DELETE
    try {
      const requestParam = {
        method: 'DELETE'
      };

      const response = await fetch(`${app.base_url}/cards/${cardId}/tags/${tagId} `, requestParam);

      if (!response.ok) {
        // If the operation doesn't succeed
        const error = await response.json();
        throw error;
      }

      // If the operation succeeds, we remove the tag from the DOM within this card
      const result = await response.json();
      tagElement.remove();

    } catch (error) {
      console.log(error);
    }
  },
  deleteTag: async (event) => {
    console.log("Suppression d'un label");
    // we get the span element of the tag name
    const tagElement = event.target.closest('.card__tag__column');
    const tagId = tagElement.getAttribute("data-tag-id");
    // we send a fetch request with method DELETE
    try {
      const requestParam = {
        method: 'DELETE'
      };
      const response = await fetch(`${app.base_url}/tags/${tagId}`, requestParam);
      if (!response.ok) {
        // if the operation fails
        const error = await response.json();
        throw error;
      }

      // If the operation succeeds, we remove the tag from the DOM  in the tags block
      tagElement.remove();

      // still in the DOM, we remove the tag from all cards it is associated to
      const tagsWithThisId = document.querySelectorAll(`[data-tag-id="${tagId}"]`);
      for (const tag of tagsWithThisId) {
        tag.remove();
      }

    } catch (error) {
      console.log(error);
    }

  }
};
