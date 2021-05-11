const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const jwt = require('jsonwebtoken');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 5000;

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     res.send('GET request is disabled');
//   } else {
//     res.send('its not a GET request');
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(503).send('site is under Maintenance');
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// const pet = {
//   name: 'abugaru',
// };

// pet.toJSON = function () {
//   console.log(this);
//   return this;
// };

// console.log(JSON.stringify(pet));
