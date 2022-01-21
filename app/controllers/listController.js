const {List} = require('../models');

const listController = {
  getAllLists: async (req, res) => {
    try {
      const lists = await List.findAll({
        include: [
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

};


module.exports = listController;