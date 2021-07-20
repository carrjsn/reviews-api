const express = require('express');
const app = express();
const models = require('../models/index.js');


app.get('/reviews', (req, res) => {
  // get reviews
  // query params: page, count, sort, product_id
  let options = {
    page: req.query.page,
    count: req.query.count,
    sort: req.query.sort,
    id: req.query.product_id
  }

  models.getReviews((err, data) => {
    if (err) {
      console.log('error', err);
    } else {
      console.log('data', data)
      // res.send(data);
    }
  });
});

app.post('/reviews', (req, res) => {
  // post a review
  // query params
});

app.get('/reviews/meta', (req, res) => {
  // get meta info
  // use query params
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  // update db
  models.updateHelpfulness(req.params.review_id, (err) => {
    if (err) {
      console.log('error updating helpfulness')
    } else {
      console.log('success updating helpfulness')
      // res.send()
    }
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  // update db
  models.reportReview(req.params.review_id, (err) => {
    if (err) {
      console.log('error reporting review')
    } else {
      console.log('success reporting review')
      // res.send()
    }
  });
});


models.getReviews(145265, (err, data) => {
  if (err) {
    console.log('error');
  } else {
    console.log('data', data)
    // res.send(data);
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT}.`)
});