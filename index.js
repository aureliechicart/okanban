const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const router = require('./app/router');
const cors = require('cors');
const multer = require('multer');

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors('*'));

app.use(express.urlencoded({ extended: true }));
const mutipartParser = multer();
app.use(mutipartParser.none());

// we add a body sanitizer middleware
const bodySanitizer = require('./app/middleware/body-sanitizer');
app.use(bodySanitizer);

// we add the static assets
app.use(express.static(path.join(__dirname, "./assets/")));

app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT} ...`);
});