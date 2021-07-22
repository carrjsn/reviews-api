const express = require('express');
const app = require('../server/app.js');
const request = require('supertest');

// jest.setTimeout(10000);

describe('Add a review', () => {

  // example
  it('should be a test that passes', () => {
    expect(3 + 4).toBe(7);
  });

  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/reviews?product_id=123456');
    console.log(response.body.page);
    expect(response.statusCode).toBe(200);
  });

  // it('should respond with result data', async () => {
  //   const response = await request(app).get('/reviews?product_id=123456');
  //   expect(response.body.results);
  // });

  // it('should return one page if no page paramter provided', async () => {
  //   const response = await request(app).get('/reviews?product_id=123456');
  //   console.log(response.body.page);
  //   expect(response.body.page).toBe(1);
  // });

  // it('should return the correct number of pages of reviews', async () => {
  //   const response = await request(app).get('/reviews?product_id=123456&page=3');
  //   expect(response.body.page).toBe(3);
  // });

});

describe('Get reviews', () => {

});

describe('Get meta data', () => {

});

describe('Update helpfulness', () => {

});

describe('Report a review', () => {

});



