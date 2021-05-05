const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const bcrytpt = require('bcryptjs');
const myFunction = async () => {
  const password = 'abcde12345';
  const hashedPassword = await bcrytpt.hash(password, 8);

  console.log(password);
  console.log(hashedPassword);

  const isMatch = await bcrytpt.compare(password, hashedPassword);
  console.log(isMatch);
};
myFunction();

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
