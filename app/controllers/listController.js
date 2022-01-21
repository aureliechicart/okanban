const { List } = require('../models');

const listController = {
  getAllLists: async (req, res) => {
    try {
      const lists = await List.findAll({
        include: [
          // the aliases for associations are defined in the sequelize models catalog file (/app/models/index.js)
          {
            association: 'cards',
            include: [{
              association: 'tags'
            }]
          }
        ],
        order: [
          ['position', 'ASC'],
          ['cards', 'position', 'ASC']
        ]
      });
      console.log(lists);
      res.json(lists);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  },

  getOneList: async (req, res) => {
    try {
      const listId = req.params.id;
      const list = await List.findByPk(listId, {
        include: {
          association: 'cards',
          include: 'tags'
        },
        order: [
          ['cards', 'position', 'ASC']
        ]
      });
      if (list) {
        res.json(list);
      } else {
        res.status(404).json('Cant find list with id ' + listId);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createList: async (req, res) => {
    try {
      const { name, position } = req.body;
      // testing the presence of parameters
      const bodyErrors = [];
      if (!name) {
        bodyErrors.push('name can not be empty');
      }


      if (bodyErrors.length) {
        // if we get an error
        res.status(400).json(bodyErrors);
      } else {
        let newList = List.build({
          name,
          position
        });
        await newList.save();
        res.json(newList);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  modifyList: async (req, res) => {
    try {
      const listId = req.params.id;
      const list = await List.findByPk(listId);
      if (!list) {
        res.status(404).send('Cant find list with id ' + listId);
      } else {

        const { name, position } = req.body;
        // we only change the submitted parameters
        if (name) {
          list.name = name;
        }

        if (position) {
          list.position = position;
        }

        await list.save();

        res.json(list);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  createOrModify: async (req, res) => {
    try {
      let list;
      if (req.params.id) {
        list = await List.findByPk(req.params.id);
      }
      if (list) {
        await listController.modifyList(req, res);
      } else {
        await listController.createList(req, res);
      }
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  },

  deleteList: async (req, res) => {
    try {
      const listId = req.params.id;
      const list = await List.findByPk(listId);
      await list.destroy();
      res.json('OK');
    } catch (error) {
      console.trace(error);
      res.status(500).json(error.toString());
    }
  }
};


module.exports = listController;