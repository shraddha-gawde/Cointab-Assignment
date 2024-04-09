const express = require('express');
const axios = require('axios');
const { UserModel } = require('../models/users.models');
const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = response.data;
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

userRouter.get('/exists/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findByPk(userId);
      if (user) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    } catch (error) {
      console.error('Error checking if user exists:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  userRouter.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const userData = response.data;
        res.status(200).json(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  });

userRouter.post('/add', async (req, res) => {
    try {
      const userData = req.body;
      await UserModel.create(userData);
      res.status(201).json(userData)
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).send('Error adding user');
    }
  });


module.exports = { userRouter }

