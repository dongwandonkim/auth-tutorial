const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

//create task
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findById(_id);
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//delete
router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findByIdAndDelete(_id);
    if (!task) return res.status(404).send();
    res.send('Task is deleted');
  } catch (error) {
    res.send(error);
  }
});

//update
router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = ['description', 'completed'];
  const inValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!inValidOperation)
    return res.status(400).send({ error: 'Invalid updates' });

  try {
    const task = await Task.findById(_id);

    updates.forEach((update) => (task[update] = body[update]));

    await task.save();

    if (!task) return res.status(404).send();
    return res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
