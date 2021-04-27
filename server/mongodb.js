const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      return console.error('Unable to connect to database!', err);
    }

    const db = client.db(databaseName);
    // db.collection('users').insertOne(
    //   {
    //     name: 'Kim',
    //     age: 27,
    //   },
    //   (err, result) => {
    //     if (err) {
    //       return console.error('unable to insert');
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // db.collection('users').insertMany(
    //   [
    //     {
    //       name: 'cindy',
    //       age: 40,
    //     },
    //     {
    //       name: 'jeannie',
    //       age: 38,
    //     },
    //   ],
    //   (err, result) => {
    //     if (err) return console.log('unable to inster this time');
    //     console.log(result.ops);
    //   }
    // );

    db.collection('tasks').insertMany(
      [
        {
          description: 'Learn mongodb',
          completed: false,
        },
        {
          description: 'get a job',
          completed: false,
        },
        {
          description: 'learn MERN stack',
          completed: false,
        },
      ],
      (err, result) => {
        if (err) return console.log('unable to insert data this time');

        console.log(result.ops);
      }
    );

    console.log('Connected correctly');
  }
);
