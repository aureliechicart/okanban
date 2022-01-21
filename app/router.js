const express = require('express');
const path = require('path');

// inporting controllers
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');

const router = express.Router();

// Front route which returns index.html
router.get('/', (req, res) => {
  let filePath = path.join(__dirname, '../index.html');
  res.sendFile( filePath );
});

/** Lists */
router.get('/lists', listController.getAllLists);
router.get('/lists/:id', listController.getOneList);
router.post('/lists', listController.createList);
router.patch('/lists/:id', listController.modifyList);
router.put('/lists/:id?', listController.createOrModify);
router.delete('/lists/:id', listController.deleteList);

/* Cards */
router.get('/lists/:id/cards', cardController.getCardsInList);
router.get('/cards/:id', cardController.getOneCard);
router.post('/cards', cardController.createCard);
router.patch('/cards/:id', cardController.modifyCard);
router.put('/cards/:id?', cardController.createOrModify);
router.delete('/cards/:id', cardController.deleteCard);

module.exports = router;