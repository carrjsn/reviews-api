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

    // db.end();

  },

  getReviews: async (id, callback) => {
    // TODO: make arg options to handle id, page, count etc..
    // get reviews from db
    let queryString = `SELECT id AS review_id, rating, summary, recommend, response, body, to_timestamp(date / 1000) AS date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${id} AND reported = false`;

    await db.query(queryString)
      .then((results) => {
        let reviews = results.rows;

        reviews.forEach((row) => {
          row.date = row.date.toISOString();
          if (row.response === 'null') {row.response = null;}
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

    // db.end();

  },

  addReview: (options, callback) => {

    // add review insert into reviews table in db
    db.query(`INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES('${options.product_id}', '${options.rating}', '${options.date}', '${options.summary}', '${options.body}', '${options.recommend}', false, '${options.name}', '${options.email}', 'null', 0) RETURNING id`)
      .then( async (result) => {
        // get id of the row just inserted
        let insertId = result.rows[0].id

        // itereate over all photo url strings in options
        for (let url of options.photos) {
          // for each insert into photo table using the insertId = review_id
          await db.query(`INSERT INTO photos (review_id, url) VALUES ('${insertId}', '${url}')`)
            .then((result) => {
              // console.log('photo added');
            })
        }

        // pass 'return' insertId onto characteristics?
        return insertId;
      })
      .then( async (review_id) => {
        // characteristics?

        // itereate through key / values in characteristics
        for (let key in options.characteristics) {
          await db.query(`INSERT INTO characteristic_reviews (characteristic_id, review_id, value) VALUES ('${key}', '${review_id}', '${options.characteristics[key]}')`)
            .then((result) => {
              // console.log('characteristic join table updated');
            })
        }
        callback(null, review_id)
      })
      .catch((err) => {
        console.log('post review error', err);
        callback(err, null);
      })

    // db.end();
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
    // db.end();
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
    // db.end()
  },

};