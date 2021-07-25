const express = require('express');
const bodyParser = require('body-parser');
const models = require('../models/index.js');
const app = express();
require('dotenv').config();

app.use(bodyParser.json());

app.get('/reviews', (req, res) => {

  const pageSelected = Number(req.query.page) || 1;
  const countPerPage = Number(req.query.count) || 5;

  models.getReviews(req.query.product_id, (err, data) => {
    if (err) {
      console.log('error', err);
      res.sendStatus(400);

    } else {
      // sort data first
      if (req.query.sort === 'helpful') {
        data.sort((a, b) => b.helpfulness - a.helpfulness);
      } else if (req.query.sort === 'newest') {
        data.sort((a, b) => (a.date < b.date) ? 1 : (a.date > b.date) ? -1 : 0);
      } else {
        // relevant sort
        data.sort((a, b) => {
          if (a.helpfulness === b.helpfulness) {
            return (a.date < b.date) ? 1 : (a.date > b.date) ? -1 : 0;
          } else {
            return b.helpfulness - a.helpfulness;
          }
        });
      }

      // split data into 'pages' of 'count' reviews
      let pages = [];
      for (let i = 0; i < data.length; i = i + countPerPage) {
        pages.push(data.slice(i, i + countPerPage));
      }

      // set parent return object props
      let result = {
        product: req.query.product_id,
        page: pageSelected,
        count: countPerPage,
        results: pages[pageSelected - 1] || [] // -1 for actual index
      }

      res.status(200);
      res.json(result);
    }
  });
});

app.post('/reviews', (req, res) => {
  // body params
  let options = {
    product_id: req.body.product_id,
    rating: req.body.rating,
    date: Date.now(),
    summary: req.body.summary,
    body: req.body.body,
    recommend: req.body.recommend,
    name: req.body.name,
    email: req.body.email,
    photos: req.body.photos,
    characteristics: req.body.characteristics
  };

  models.addReview(options, (err, data) => {
    if (err) {
      console.log('error posting review');
      res.sendStatus(400);
    } else {
      console.log('success posting review');
      res.status(201);
      res.json(data);
    }
  });

});

app.get('/reviews/meta', (req, res) => {

  models.getMeta(req.query.product_id, (err, data) => {
    if (err) {
      console.log('error getting meta')
      res.sendStatus(400);
    } else {
      console.log('meta success')
      res.status(200);
      res.send(data);
    }
  });
});

app.put('/reviews/:review_id/helpful', (req, res) => {

  models.updateHelpfulness(req.params.review_id, (err) => {
    if (err) {
      console.log('error updating helpfulness')
      res.sendStatus(404);
    } else {
      console.log('success updating helpfulness')
      res.sendStatus(204)
    }
  });
});

app.put('/reviews/:review_id/report', (req, res) => {

  models.reportReview(req.params.review_id, (err) => {
    if (err) {
      console.log('error reporting review')
      res.sendStatus(404);
    } else {
      console.log('success reporting review')
      res.sendStatus(204);
    }
  });
});

module.exports = app;