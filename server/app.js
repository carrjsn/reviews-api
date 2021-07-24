const express = require('express');
const models = require('../models/index.js');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/reviews', (req, res) => {
  // get reviews
  // query params: page, count, sort, product_id
  // let options = {
  //   page: req.query.page,
  //   count: req.query.count,
  //   sort: req.query.sort,
  //   id: req.query.product_id
  // }

  models.getReviews(req.query.product_id, (err, data) => {
    if (err) {
      console.log('error', err);
      res.sendStatus(400);
    } else {
      // make a new return object {
      let result = {
        product: Number(req.query.product_id),
        page: Number(req.query.page) || 1,
        count: Number(req.query.count),
        results: data
      }
      // console.log('data', result)
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
      // res.send()
    }
  });
});

module.exports = app;