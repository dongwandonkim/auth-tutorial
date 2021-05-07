const express = require('express');
const router = new express.Router();
const User = require('../models/user');

//Create User
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const checkEmail = await User.checkIfEmailExist(user.email);

    if (checkEmail) {
      return res.status(400).send('Email is already taken'); //check if user's email already exist
    } else {
      await user.save();
      res.status(201).send(user);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.send(user);
  } catch (error) {
    res.status(400).send('Unable to login');
  }
});

//get a user
router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

//delete a user
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) return res.status(404).send('something went wrong');
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

//update a user
router.patch('/users/:id', async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const updates = Object.keys(body);
  console.log(updates);

  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    const user = await User.findById(_id);

    updates.forEach((update) => (user[update] = body[update]));

    await user.save();

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
