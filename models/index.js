const db = require('../db/postgres.js');

module.exports = {
  getMeta: () => {
    // query db for meta data
  },

  getReviews: (callback) => {
    // get reviews from db
    db.query('SELECT * FROM reviews limit 10', (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows)
      }
      db.end();
    });
  },

  addReview: () => {
    // add review insert into reviews table in db
  },
  updateHelpfulness: () => {
    // update db: increment helpfulness for given review id
  },
  reportReview: () => {
    // update db: set review id reported to be true
  },
};