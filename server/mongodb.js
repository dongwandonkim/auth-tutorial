// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

//generating new id
// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp()); //ObjectID First 4-byte has timestamp value

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      return console.error('Unable to connect to database!', err);
    }

    const db = client.db(databaseName);

    // db.collection('users').findOne(
    //   { _id: new ObjectID('60878cda2ef90738a59d594a') },
    //   (err, user) => {
    //     if (err) return console.log('couldnt find a user');
    //     console.log(user);
    //   }
    // );

    // db.collection('users').updateOne(
    //   { _id: new ObjectID('60878cda2ef90738a59d594a') },
    //   {
    //     $inc: {
    //       age: 5,
    //     },
    //   }
    // ).then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // db.collection('tasks')
    //   .updateMany(
    //     { completed: false },
    //     {
    //       $set: {
    //         completed: true,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    db.collection('users')
      .deleteMany({ age: 32 })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);
