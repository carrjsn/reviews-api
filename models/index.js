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
  updateHelpfulness: (id, callback) => {
    // update db: increment helpfulness for given review id
    db.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${id}`, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, 'helpfulness update successful')
      }
    });
    db.end()
  },
  reportReview: (id, callback) => {
    // update db: set review id reported to be true
    db.query(`UPDATE reviews SET reported = true WHERE id = ${id}`, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, 'review successfully reported')
      }
    });
    db.end()

  },
};