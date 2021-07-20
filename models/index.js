const db = require('../db/postgres.js');

module.exports = {
  getMeta: async (productId, callback) => {
    // query db for meta data

    let ratings = {};
    let recommended = {
      false: 0,
      true: 0
    };
    let characteristics = {};

    // ratings: select rating from reviews where product_id = ${id}
    await db.query(`SELECT rating FROM reviews WHERE product_id = ${productId}`)
      .then((data) => {
        // return string not int ?
        data.rows.forEach((row) => {
          if (!ratings[row.rating]) {
            ratings[row.rating] = 1;
          } else {
            ratings[row.rating]++;
          }
        })
      })
      .catch((error) => {
        console.log('ratings model error', error)
        // callback error
      });

    // recommended: select count(*) from reviews where recommend = true and product_id = ${id}
    await db.query(`SELECT recommend FROM reviews WHERE product_id = ${productId}`)
      // return string not int?
      .then((data) => {
        data.rows.forEach((row) => recommended[row.recommend]++);
      })
      .catch((error) => {
        console.log('recommend error', error);
      });


    // characteristics:
    // get characeristic names, id for the given product_id
    await db.query(`SELECT name, id FROM characteristics WHERE product_id = ${productId}`)
    .then( async (data) => {
      for (let row of data.rows) {
        // then get the corresponding average score for each characteristic for the given characteristic_id
          characteristics[row.name] = { id: row.id};
          await db.query(`SELECT ROUND(AVG(characteristic_reviews.value) * 2) / 2 FROM characteristics INNER JOIN characteristic_reviews ON characteristic_reviews.characteristic_id = characteristics.id WHERE characteristics.product_id = ${productId} AND characteristics.id = ${row.id}`)
            .then((data) => {
              let characteristicRatingAvg = data.rows[0]['?column?'];
              characteristics[row.name].value = characteristicRatingAvg;
            })
        }
        return;
      })
      .then(() => {
        let result = {
          product_id: productId,
          ratings,
          recommended,
          characteristics
        };
        callback(null, result)
      })
      .catch((error) => {
        console.log('char error', error);
        callback(error, null);
      });


  },

  getReviews: (id, callback) => {
    // TODO: make arg options to handle id, page, count etc..
    // get reviews from db
    let queryString = `SELECT *, to_timestamp(date / 1000) FROM reviews WHERE product_id = ${id} AND reported = false`;

    db.query(queryString)
      .then((results) => {
        let reviews = results.rows;
        // convert date on each result object, remove extra props
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