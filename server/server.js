const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

//Create User
app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//create task
app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.send(task);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.get('/users/:id', (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => {
      res.send(tasks);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then((task) => {
      if (!task) {
        return res.status(404).send();
      }
      res.send(task);
    })
    .catch((err) => {
      res.status(500).send();
    });
});

app.delete('/tasks/:id', (req, res) => {
  const _id = req.params.id;
  Task.findByIdAndDelete(_id)
    .then((task) => {
      if (!task) return res.status(404).send();
      res.send('Task is deleted');
      return Task.countDocuments({ completed: false });
    })
    .then((result) => {
      res.send(result + ' task(s) left to complete');
    })
    .catch((err) => {
      console.log(err);
    });
});

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
