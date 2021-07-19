const express = require('express');
// const db = require('../db/postgres.js');
const app = express();
const models = require('../models/index.js');

// make db queries within server
// - - - - - -
// db.query('SELECT * FROM reviews limit 10', (err, res) => {
//   console.log('db server log', (err, res));
//   db.end();
// });

// make controllers here
app.get('/reviews', (req, res) => {
  models.getReviews((err, data) => {
    if (err) {
      console.log('error');
    } else {
      console.log('data', data)
      // res.sendStatus(200);
      // res.send(data);
    }
  });
});

// app.get('/reviews/meta', (req, res) => {

// });

models.getReviews((err, data) => {
  if (err) {
    console.log('error');
  } else {
    console.log('data', data)
    // res.sendStatus(200);
    // res.send(data);
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT}.`)
});