const db = require('../db/postgres.js');

module.exports = {
  getMeta: () => {
    // query db for meta data
  },

  getReviews: (id, callback) => {
    // get reviews from db
    let queryString = `SELECT *, to_timestamp(date / 1000) FROM reviews WHERE product_id = ${id} AND reported = true`;

    db.query(queryString)
      .then((results) => {
        let reviews = results.rows;
        // convert date
        reviews.forEach((row) => {
          row.date = row.to_timestamp.toISOString();
          row.review_id = row.id;
          delete row.to_timestamp;
          delete row.product_id;
          delete row.id;
          delete row.reviewer_email;
          row.photos = [];
        });
        return reviews;
      })
      .then(async (reviews) => {
        // get photos from photo table for each review
        for (let review of reviews) {
          await db.query(`SELECT id, url FROM photos WHERE review_id = ${review.review_id}`)
            .then((results) => review.photos = results.rows)
        }
        return reviews;
      })
      .then((reviews) => {
        callback(null, reviews);
      })
      .catch((err) => {
        callback(err, null)
      })

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