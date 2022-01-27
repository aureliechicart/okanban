const utilsModule = require('./utilsModule');

const tagModule = {
  base_url: null,

  setBaseUrl: url => {
    tagModule.base_url = url;
  },
  makeTagInDOM: (tag, cardId) => {
    // we get the template
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

    // we insert the tag in DOM within cards to which they are associated
    document.querySelector(`[data-card-id="${cardId}"] .card__tags`).appendChild(newTag);

    // we close the modal
    utilsModule.hideModals();

  },
  showAddTagForm: (_) => {
    // we get the add tag modal
    const tagModal = document.querySelector("#addTagModal");
    // we display the modal
    tagModal.classList.add('is-active');

  },
  showEditTagForm: (event) => {
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

    // we get the data from the form
    const formData = new FormData(event.target);
    const tagId = formData.get('id');
    const newTagTitle = formData.get('name');

    try {
      // we send a request to the API to save the title change in DB
      const requestParam = {
        method: 'PATCH',
        body: formData
      };
      const response = await fetch(`${tagModule.base_url}/tags/${tagId}`, requestParam);

      if (!response.ok) {
        // if there is an error
        const error = await response.json();
        throw error;
      }

      // If it works, we change the span textcontent with new name
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

      // to avoid duplicates elements in DOM, we clear the tags block, then we get the new list of tags
      const tagsDivElement = document.querySelector(".tags__block");
      while (tagsDivElement.firstChild) {
        tagsDivElement.firstChild.remove();
      }
      tagModule.getTagsFromAPI();

    } catch (error) {
      console.log(error);
    }

  },
  handleAddTagForm: async (event) => {
    event.preventDefault();
    // we hide the error message in case it had been triggered during the last opening
    document.querySelector(".tag-exists").classList.add("is-hidden");

    // we get data from the form
    const formData = new FormData(event.target);
    formData.append('color', '#FFFFFF');

    try {
      // we check if this tag already exists in DB
      const response = await fetch(`${tagModule.base_url}/tags`);
      const tags = await response.json();
      const foundTag = tags.find(tag => {
        return tag.name === formData.get('name');
      });
      // If we find a tag with this name
      if (foundTag) {
        // we display an error message to the user
        document.querySelector(".tag-exists").classList.remove("is-hidden");
      } else {
        // If not, we add it in DB
        const requestParam = {
          method: 'POST',
          body: formData
        }

        const responseCreate = await fetch(`${tagModule.base_url}/tags`, requestParam);
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
          utilsModule.hideModals();
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
      const response = await fetch(`${tagModule.base_url}/tags`);
      const tags = await response.json();
      for (const tag of tags) {
        // we get the template 
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

        // we insert the tag in the DOM (tags block)
        document.querySelector(".tags__block").appendChild(newTag);

      }
    } catch (error) {
      console.log(error);
    }
  },
  showAssociateLabelForm: async (event) => {
    // if it is not the first time this form is used, we need to clear the last selection
    const selectElement = document.getElementById('label-select');
    for (const option of selectElement.options) {
      if (option.value === 'default') {
        option.selected = true;
      } else {
        option.selected = false;
      }
    }

    // we get the value of data-list-id by using the reference to the clicked element
    const cardId = event.target.closest('.box').getAttribute('data-card-id');

    // we add it in a hidden input in the form
    const associateTagModal = document.getElementById("associateTagModal");
    associateTagModal.querySelector('input[name="card-id"]').value = cardId;
    // we make the modal visible
    associateTagModal.classList.add('is-active');

    try {
      // we get all tags in DB
      const response = await fetch(`${tagModule.base_url}/tags`);
      const tags = await response.json();

      // to avoid duplicates and to plan for newly added tags,
      // we check first if tag options are already present in the DOM
      // if so, we are going to make sur we add only new tags
      // that were not in DB at the last modal opening
      if (selectElement.children.length > 1) {
        // we transform the HTML Collectrion into an array so we can iterate through it
        const optionsArray = Array.from(selectElement.children);

        for (const tag of tags) {
          // if the tag from the DB is found in the DOM
          if (optionsArray.some(option => parseInt(option.value) === tag.id)) {
            // we don't do anything
            return;
          } else {
            // if not, it means this new tag needs to be inserted in DOM
            const option = document.createElement('option');
            option.textContent = tag.name;
            option.defaultSelected = false;
            option.setAttribute('value', tag.id);
            selectElement.appendChild(option);
          }
        }
      } else {
        // if it is the time the modal is opening, the drop down is empty in DOM
        // we can directly insert each tag from DB
        for (const tag of tags) {
          const option = document.createElement('option');
          option.textContent = tag.name;
          option.defaultSelected = false;
          option.setAttribute('value', tag.id);
          selectElement.appendChild(option);
        }
      }


    } catch (error) {
      console.log(error);
    }
  },

  handleAssociateLabelForm: async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const cardId = formData.get('card-id');
    console.log('carotte');

    for (var pair of formData.entries()) {
      // we loop through tag ids in formdata
      if (pair[0] === 'tag-id' && pair[1] !== 'default') {
        console.log('patate');
        const tagId = parseInt(pair[1], 10);

        // we check if this tag is already associated with this card
        try {
          const response = await fetch(`${tagModule.base_url}/cards/${cardId}`);
          console.log('poireau');
          if (response.ok) {
            console.log('chou');
            const card = await response.json();

            const foundTag = card.tags.find(tag => tag.id === tagId);
            console.log(foundTag);
            if (!foundTag) {
              //  if the association doesn't already exist, we can save it in DB
              // and add the tag in the DOM (card container)
              const associateFormData = new FormData();
              associateFormData.append('tag_id', tagId);

              const requestParam = {
                method: 'POST',
                body: associateFormData
              }
              const response = await fetch(`${tagModule.base_url}/cards/${cardId}/tags`, requestParam);
              if (response.ok) {
                const newAssociation = await response.json();

                // we need the full info on the tag to pass it on to the makeTagInDOM method
                const fullTag = newAssociation.tags.find(tag => tag.id === tagId);
                tagModule.makeTagInDOM(fullTag, cardId);
              }
              else {
                const error = await response.json();
                throw error;
              }
            } else {
              utilsModule.hideModals();
            }
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

      const response = await fetch(`${tagModule.base_url}/cards/${cardId}/tags/${tagId} `, requestParam);

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
    // we get the span element of the tag name
    const tagElement = event.target.closest('.card__tag__column');
    const tagId = tagElement.getAttribute("data-tag-id");
    // we send a fetch request with method DELETE
    try {
      const requestParam = {
        method: 'DELETE'
      };
      const response = await fetch(`${tagModule.base_url}/tags/${tagId}`, requestParam);
      if (!response.ok) {
        // if the operation fails
        const error = await response.json();
        throw error;
      }

      // If the operation succeeds, we remove the tag from the DOM (tags block)
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

module.exports = tagModule;
