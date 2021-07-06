'use strict';
// 3rd party resoursec
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const multParse = multer();

// Esoteric resoursec
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const logger = require('./middleware/logger.js');
const authroutes = require('../../auth-server/src/auth/routes');


const v1Routes = require('./routes/v1.js');
const v2Routes = require('./routes/v2.js');
const { use } = require('../../auth-server/src/auth/routes');

//prepare express app
const app = express();

// app level middleware
app.use(cors());
app.use(morgan('dev'));
app.use(multParse.none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);

//routes
app.use(authroutes);
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);


app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    if (!port) { throw new Error("Missing Port"); }
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
