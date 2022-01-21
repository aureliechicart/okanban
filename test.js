require('dotenv').config();

const { List, Card } = require('./app/models/');

const run = async () => {
  try {
    // console.log('List.findAll');
    // let lists = await List.findAll({
    //   include: [
    //     {
    //       association: 'cards',
    //       include: [{
    //         association: 'tags'
    //       }]
    //     }
    //   ],
    //   order: [
    //     ['cards', 'position', 'ASC']
    //   ],
    // });
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
    lists.forEach( (list) => {
      let str = `La liste "${list.name}" contient les cartes : \n`;
      list.cards.forEach( (card) => {
        str += `\t- "${card.content}" avec les tags : ${card.tags.map(tag=>`"${tag.name}"`).join(',')}\n`;
      });
      console.log(str);
    });
  } catch (error) {
    console.trace(error);
  }

};

run();

const deleteList = async() => {
  try{
    const list = await List.findByPk(1);
    await list.destroy();
  }catch(error){
    console.error(error);
  }
}

// deleteList();