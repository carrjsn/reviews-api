const express = require('express');
const app = require('../server/app.js');
const request = require('supertest');
const db = require('../db/postgres.js');

// allow long queries to be tested
jest.setTimeout(50000);

describe('Add a review', () => {
  it('should add a review', () => {

  });
});

describe('Get reviews', () => {

  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/reviews?product_id=123456');
    expect(response.statusCode).toBe(200);
  });

  it('should return one page if no page paramter provided', async () => {
    const response = await request(app).get('/reviews?product_id=123456');
    expect(response.body.page).toBe(1);
  });

  it('should return the correct number of pages of reviews', async () => {
    const response = await request(app).get('/reviews?product_id=123456&page=3');
    expect(response.body.page).toBe(3);
  });

});

describe('Get meta data', () => {

  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/reviews/meta?product_id=121756');
    expect(response.statusCode).toBe(200);
  });

  it('recommended data should have true and false keys', async () => {
    const response = await request(app).get('/reviews/meta?product_id=121756');
    expect(response.body.recommended).toHaveProperty('true');
    expect(response.body.recommended).toHaveProperty('false');
  });

  it('should return meta data for recommended votes', async () => {
    const response = await request(app).get('/reviews/meta?product_id=121756');
    expect(response.body).toHaveProperty('recommended');
  });

  it('should return meta data for characteristics', async () => {
    const response = await request(app).get('/reviews/meta?product_id=121756');
    expect(response.body).toHaveProperty('characteristics');
  });

  it('should return meta data for review ratings', async () => {
    const response = await request(app).get('/reviews/meta?product_id=121756');
    expect(response.body).toHaveProperty('ratings');
  });

});

describe('Update helpfulness', () => {

  // add beforeEach to reset helpfulness change
  it('should respond with a 204 status code', async () => {
    const response = await request(app).put('/reviews/121756/helpful');
    expect(response.statusCode).toBe(204);
    // undo increment helpfulness
    await db.query('UPDATE reviews SET helpfulness = helpfulness - 1 WHERE id = 121756');
  });

  it('should add one to the helpfulness count of a review', async () => {
    const response = await request(app).get('/reviews?product_id=123456');
    let reviewHelpfulness = response.body.results[0].helpfulness;
    let reviewId = response.body.results[0].review_id;

    await request(app).put(`/reviews/${reviewId}/helpful`);
    const updatedResponse = await request(app).get('/reviews?product_id=123456');
    let updatedReviewHelpfulness = updatedResponse.body.results[0].helpfulness;
    expect(updatedReviewHelpfulness).toEqual(reviewHelpfulness + 1);
    // reset count
    await db.query(`UPDATE reviews SET helpfulness = helpfulness - 1 WHERE id = ${reviewId}`);
  });

});

describe('Report a review', () => {

  it('respond with a 204 status code', async () => {
    const response = await request(app).put('/reviews/121252/report');
    expect(response.statusCode).toBe(204);
    // db.query undo the report
    await db.query('UPDATE reviews SET reported = false WHERE id = 121252');
  });

  it('reported review should not be rendered on subsequent fetches', async () => {
    const response = await request(app).get('/reviews?product_id=121259');
    let reviewId = response.body.results[0].review_id;
    console.log(reviewId, 'reviewid');
    //report review
    await request(app).put(`/reviews/${reviewId}/report`);

    const updatedResponse = await request(app).get('/reviews?product_id=121259');
    const updatedReviews = updatedResponse.body.results;
    updatedReviews.forEach((review) => {
      expect(review.id).not.toEqual(reviewId);
    });
    // db.query undo the report - after each?
    await db.query(`UPDATE reviews SET reported = false WHERE id = ${reviewId}`);
  });

});



