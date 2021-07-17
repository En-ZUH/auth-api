'use strict';
// 3rd party resoursec
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const multer = require('multer');
// const multParse = multer();

// Esoteric resoursec
const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
const logger = require('./middleware/logger.js');
const authroutes = require('./routes/router');


const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');
const { use } = require('../src/routes/router');

//prepare express app
const app = express();

// app level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//// app.use(multParse.none());

//test
app.get('/', (req, res) => {
  res.status(200).send('live!')
})
//routes
app.use(logger);
app.use(authroutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

//catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app: app,
  start: port => {
    if (!port) { throw new Error("Missing Port"); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
