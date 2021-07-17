const express = require('express');
const db = require('../db/postgres.js');
const app = express();

// make db queries within server
// - - - - - -
// db.query('SELECT * FROM reviews limit 10', (err, res) => {
//   console.log('db server log', (err, res));
//   db.end();
// });

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT}.`)
});