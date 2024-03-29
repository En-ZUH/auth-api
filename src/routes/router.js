'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../models/users');
const basicAuth = require('../middleware/basic.js')
const bearerAuth = require('../middleware/bearer.js')
const permissions = require('../middleware/acl.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
    //console.log('Message:', e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

authRouter.get('/users', bearerAuth, permissions('read'), async (req, res, next) => {
  try {
    const users = await User.find({});
    const list = users.map(user => user.username);
    res.status(200).json(list);
  } catch (e) {
    next(e);
  }
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  try {
    res.status(200).send('Welcome to the secret area');
  } catch (e) {
    next(e);
  }
});

module.exports = authRouter;
