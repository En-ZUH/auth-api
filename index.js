'use strict';

const mongoose = require('mongoose');


const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect('mongodb://localhost:27017/food');
//mongoose.connect(process.env.MONGODB_URI, options);

require('./src/server').start(process.env.PORT);
