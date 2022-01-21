const express = require('express');
const path = require('path');

// inporting controllers
const listController = require('./controllers/listController');

const router = express.Router();

// Front route which returns index.html
router.get('/', (req, res) => {
  let filePath = path.join(__dirname, '../index.html');
  res.sendFile( filePath );
});

/** Lists */
router.get('/lists', listController.getAllLists);

module.exports = router;