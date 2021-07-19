const db = require('../db/postgres.js');

module.exports = {
  getMeta: () => {

  },

  getReviews: (callback) => {
    db.query('SELECT * FROM reviews limit 10', (err, res) => {
      // console.log('db server log', (err, res));
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows)
      }
      db.end();
    });
  },

  addReview: () => {

  },
  updateHelpfulness: () => {

  },
  reportReview: () => {

  },
};