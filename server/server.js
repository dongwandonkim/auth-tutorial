const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const jwt = require('jsonwebtoken');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// const Task = require('./models/task');

const main = async () => {
  // const task = await Task.findById('609a129142ea3f2ecdcec302');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);

  const user = await User.findById('609a114e6df6ad2e98aa468f');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
};
main();
