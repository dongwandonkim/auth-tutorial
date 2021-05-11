const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');

const upload = multer({
  dest: 'avatar',
});

//Create a User
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const checkEmail = await User.checkIfEmailExist(user.email);

    if (checkEmail) {
      return res.status(400).send('Email is already taken'); //check if user's email already exist
    } else {
      await user.save();

      const token = await user.generateAuthToken();

      res.status(201).send({ user, token });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//get user profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

//user login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send('Unable to login');
  }
});

//user logout
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
//user logout all session
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
  res.send('upload completed');
});

//get a user
// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

//delete a user
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

//update a user
router.patch('/users/me', auth, async (req, res) => {
  const body = req.body;
  const updates = Object.keys(body); //get keys from body
  const allowedUpdates = ['name', 'email', 'password', 'age'];

  //check if updates's keys are allowed to update
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  }

  try {
    updates.forEach((update) => (req.user[update] = body[update]));

    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
