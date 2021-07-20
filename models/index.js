const db = require('../db/postgres.js');

module.exports = {
  getMeta: () => {
    // query db for meta data
  },

  getReviews: (id, callback) => {
    // get reviews from db
    let queryString = `SELECT *, to_timestamp(date / 1000) FROM reviews WHERE product_id = ${id}`;

    // promises...
    db.query(queryString)
      .then((results) => {
        let reviews = results.rows;
        console.log('results promise', reviews)
        reviews.forEach((row) => {
          row.date = row.to_timestamp.toISOString();
          delete row.to_timestamp;
        });
        callback(null, reviews);

      })
      .catch((err) => {
        callback(err, null)
      })


    //callbacks...
    // db.query(queryString, (err, res) => {
    //   if (err) {
    //     callback(err, null);
    //   } else {
    //     callback(null, res);
    //   }
    //   db.end();
    // });
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
    db.end();
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