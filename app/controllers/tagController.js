const { Tag, Card } = require('../models');

const tagController = {
  getAllTags: async (req, res) => {
    try {
      const tags = await Tag.findAll();
      res.json(tags);
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  createTag: async (req, res) => {
    try {
      const { name, color } = req.body;
      let bodyErrors = [];
      if (!name) {
        bodyErrors.push('name can not be empty');
      }
      if (!color) {
        bodyErrors.push('color can not be empty');
      }

      if (bodyErrors.length) {
        res.status(400).json(bodyErrors);
      } else {
        let newTag = Tag.build({ name, color });
        await newTag.save();
        res.json(newTag);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  modifyTag: async (req, res) => {
    try {
      const tagId = req.params.id;
      const { name, color } = req.body;

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json('Can not find tag with id ' + tagId);
      } else {
        if (name) {
          tag.name = name;
        }
        if (color) {
          tag.color = color;
        }
        await tag.save();
        res.json(tag);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  createOrModify: async (req, res) => {
    try {
      let tag;
      if (req.params.id) {
        tag = await Tag.findByPk(req.params.id);
      }
      if (tag) {
        await tagController.modifyTag(req, res);
      } else {
        await tagController.createTag(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(error);
    }
  },

  deleteTag: async (req, res) => {
    try {
      const tagId = req.params.id;
      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        res.status(404).json('Can not find tag with id ' + tagId);
      } else {
        await tag.destroy();
        res.json('OK');
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  associateTagToCard: async (req, res) => {
    try {
      console.log(req.body);
      const cardId = req.params.id;
      const tagId = req.body.tag_id;

      let card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      if (!card) {
        return res.status(404).json('Can not find card with id ' + cardId);
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json('Can not find tag with id ' + tagId);
      }

      // we now associate both instances
      // thanks to Sequelize and mixins methods added to instances (here addTag and removeTag, see https://sequelize.org/master/class/lib/associations/belongs-to-many.js~BelongsToMany.html), we can manipulate the records of liaison table card_has_tag without having to write any SQL line
      // No need to create a model for this liaison table, everything is managed under the hood
      await card.addTag(tag);
      // unofrtunately the associations of the instance are not updated
      // we need to select the instance again to return the updated instance
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  removeTagFromCard: async (req, res) => {
    try {
      const { cardId, tagId } = req.params;

      let card = await Card.findByPk(cardId);
      if (!card) {
        return res.status(404).json('Can not find card with id ' + cardId);
      }

      let tag = await Tag.findByPk(tagId);
      if (!tag) {
        return res.status(404).json('Can not find tag with id ' + tagId);
      }

      await card.removeTag(tag);
      card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      res.json(card);

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  }
};

module.exports = tagController;