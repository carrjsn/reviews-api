const express = require('express');
const app = require('../server/app.js');
const request = require('supertest');
const db = require('../db/postgres.js');

// allow long queries to be tested
jest.setTimeout(10000);


describe('Add a review', () => {

  // test post information
  const options = {
      product_id: 1,
      rating: 4,
      summary: 'test review',
      body: 'test review body',
      recommend: true,
      name: 'john',
      email: 'johndoe@email.com',
      photos: ['url1', 'url2'],
      characteristics: {
        '1': 3,
      }
  };

  // beforeAll(() => {
  //   return db.query('DELETE FROM reviews')
  //     .then(() => {
  //       return db.query('ALTER SEQUENCE reviews_id_seq RESTART WITH 1');
  //     })
  //     .then(() => {
  //       return db.query(`INSERT INTO products(name) VALUES ('test')`)
  //     })
  //     .then(() => {
  //       return db.query(`INSERT INTO characteristics(product_id, name) VALUES (1, 'testname1')`)
  //     })
  //     .catch((error) => {
  //       console.log('beforeAll error', error)
  //     });
  // });

  // afterAll(() => {
  //   return db.query('DELETE FROM photos')
  //     .then(() => {
  //       db.query('ALTER SEQUENCE photos_id_seq RESTART WITH 1')
  //     })
  //     .then(() => {
  //       db.query('DELETE FROM characteristics')
  //     })
  //     .then(() => {
  //       db.query('ALTER SEQUENCE characteristics_id_seq RESTART WITH 1')
  //     })
  //     .then(() => {
  //       db.query('DELETE FROM characteristic_reviews')
  //     })
  //     .then(() => {
  //       db.query('ALTER SEQUENCE characteristic_reviews_id_seq RESTART WITH 1')
  //     })
  //     // reset prodcuts
  //     .then(() => {
  //       db.query(`DELETE FROM products`)
  //     })
  //     .then(() => {
  //       db.query('ALTER SEQUENCE products_id_seq RESTART WITH 1')
  //     })
  //     .catch((error) => {
  //       console.log('afterAll error', error)
  //     });
  // });

  it('should respond with a 201 status code', async () => {
    await db.query(`INSERT INTO products(name) VALUES ('test')`);
    await db.query(`INSERT INTO characteristics(product_id, name) VALUES (1, 'testname1')`);
    const postResponse = await request(app).post('/reviews').send(options);
    expect(postResponse.statusCode).toBe(201);
  });

  it('should add a new review to the database', async () => {
    const responseBefore = await request(app).get('/reviews?product_id=1&count=100');
    const numReviewsBefore = responseBefore.body.results.length;
    await request(app).post('/reviews').send(options);
    const responseAfter = await request(app).get('/reviews?product_id=1&count=100');
    const numReviewsAfter = responseAfter.body.results.length;
    expect(numReviewsBefore + 1).toEqual(numReviewsAfter);
  });

  it('should add review photos to database', async () => {
    const postResponse = await request(app).post('/reviews').send(options);
    const insertId = postResponse.body;
    await db.query(`SELECT * FROM photos WHERE review_id = ${insertId}`)
      .then((results) => {
        expect(results.rows.length).toBeGreaterThan(0);
      })
  });

});

describe('Get reviews', () => {

  it('should respond with a 200 status code', async () => {
    const response = await request(app).get('/reviews?product_id=1');
    expect(response.statusCode).toBe(200);
  });

  xit('should return one page by default if no page paramter provided', async () => {
    const response = await request(app).get('/reviews?product_id=123456');
    expect(response.body.page).toBe(1);
  });

  xit('should return the correct number of pages if page count provided', async () => {
    const response = await request(app).get('/reviews?product_id=123456&page=3');
    expect(response.body.page).toBe(3);
  });

  xit('should return date in proper ISO format', async () => {
    const dateCheck = (str) => {
      if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
        return false;
      }
      var date = new Date(str);
      return date.toISOString()===str;
    }

    const response = await request(app).get('/reviews?product_id=123456');
    expect(dateCheck(response.body.results[0].date)).toBe(true)
  });

  xit('should return photos if review has any', async () => {
    const response = await request(app).get('/reviews?product_id=123456');
    expect(response.body.results[0].photos.length).toBeGreaterThan(0);
  });

});

xdescribe('Get meta data', () => {

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

xdescribe('Update helpfulness', () => {

  // add beforeEach to reset helpfulness change
  it('should respond with a 204 status code', async () => {
    const response = await request(app).put('/reviews/121756/helpful');
    expect(response.statusCode).toBe(204);
    // undo increment helpfulness
    await db.query('UPDATE reviews SET helpfulness = helpfulness - 1 WHERE id = 121756');
  });

  it('should add one to the helpfulness count of a review', async () => {
    // const response = await request(app).get('/reviews?product_id=123456');
    let response;
    await db.query('SELECT * FROM reviews WHERE product_id = 123456').then((results) => response = results.rows)

    let reviewHelpfulness = response[0].helpfulness;
    let reviewId = response[0].id;

    await request(app).put(`/reviews/${reviewId}/helpful`);
    // const updatedResponse = await request(app).get('/reviews?product_id=123456');
    let updatedResponse;
    await db.query('SELECT * FROM reviews WHERE product_id = 123456').then((results) => updatedResponse = results.rows)
    let updatedReviewHelpfulness = updatedResponse[0].helpfulness;
    expect(updatedReviewHelpfulness).toEqual(reviewHelpfulness + 1);
    // reset count
    await db.query(`UPDATE reviews SET helpfulness = helpfulness - 1 WHERE id = ${reviewId}`);
  });

});

xdescribe('Report a review', () => {

  it('respond with a 204 status code', async () => {
    const response = await request(app).put('/reviews/121252/report');
    expect(response.statusCode).toBe(204);
    // db.query undo the report
    await db.query('UPDATE reviews SET reported = false WHERE id = 121252');
  });

  it('reported review should not be rendered on subsequent fetches', async () => {
    let response;
    await db.query('SELECT * FROM reviews WHERE product_id = 121259').then((results) => response = results.rows)
    let reviewId = response[0].id;
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



