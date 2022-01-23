const tagModule = {
  base_url: null,

  setBaseUrl: url => {
      tagModule.base_url = url;
  },
  makeTagInDOM: (tag, cardId) => {
      const div = document.createElement('div');
      div.classList.add('tag');
      div.style.backgroundColor = tag.color;
      div.textContent = tag.name;
      div.setAttribute('data-tag-id', tag.id);
      div.setAttribute('data-card-id', cardId);
      document.querySelector(`.box[data-card-id="${cardId}"] .tags`).appendChild(div);
  }
  // in order to associate a card and a tag: /cards/:cardId/tags/tagId

} 