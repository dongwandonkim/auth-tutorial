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

router.get('/tasks', auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate('tasks').execPopulate();

    if (!req.user.tasks) return res.status(404).send('You dont have any tasks');
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send('This is not your task');
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//delete
router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task)
      return res
        .status(404)
        .send({ success: false, message: 'this is not your task' });
    res.send({ success: true, message: 'Task is deleted', task });
  } catch (error) {
    res.send(error);
  }
});

//update
router.patch('/tasks/:id', auth, async (req, res) => {
  const body = req.body;
  const updates = Object.keys(body);
  const allowedUpdates = ['description', 'completed'];
  const inValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!inValidOperation)
    return res.status(400).send({ error: 'Invalid updates' });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task)
      return res
        .status(404)
        .send({ success: false, message: 'this is not your task' });

    updates.forEach((update) => (task[update] = body[update]));

    await task.save();

    return res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
