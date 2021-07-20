const express = require('express');
// const db = require('../db/postgres.js');
const app = express();
const models = require('../models/index.js');


// Controllers
app.get('/reviews', (req, res) => {
  models.getReviews((err, data) => {
    if (err) {
      console.log('error');
    } else {
      console.log('data', data)
      // res.send(data);
    }
  });
});

app.post('/reviews', (req, res) => {
  // post a review
});

app.get('/reviews/meta', (req, res) => {
  // get meta info
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port http://localhost:${PORT}.`)
});