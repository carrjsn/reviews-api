import http from 'k6/http';
import { check } from 'k6';
// for resetting updated data after tests
// const db = require('../db/postgres.js');
// import db from '../db/postgres.js';

// keep id range higher, toward end of data set - last 10%
const min = 911111;
const max = 999999;

const reviewsCheck = () => {
  let randomId = Math.floor(Math.random() * (max - min) + min);
    let response = http.get(`http://localhost:3030/reviews/?product_id=${randomId}`);
    check(response, {
        "getreviews: is status 200": (response) => response.status === 200,
        "getreviews: is id the same we asked": (response) => {
            let id = Number(response.json("product"));
            return id === randomId;
        }
    })
}

const metaCheck = () => {
  let randomId = Math.floor(Math.random() * (max - min) + min);
    let response = http.get(`http://localhost:3030/reviews/meta/?product_id=${randomId}`);
    check(response, {
        "meta: is status 200": (response) => response.status === 200,
        "meta: is id the same as input": (response) => {
            let id = Number(response.json("product_id"));
            return id === randomId;
        }
    })

}

const reportReviewCheck = () => {
  let randomReviewId = Math.floor(Math.random() * (max - min) + min);
    let response = http.put(`http://localhost:3030/reviews/${randomReviewId}/report`);
    check(response, {
      "reportreview: is status 204": (response) => response.status === 204
    });
    // db.query(`UPDATE reviews SET reported = false WHERE id = ${randomReviewId}`);
}

const helpfulnessUpdateCheck = () => {
  let randomReviewId = Math.floor(Math.random() * (max - min) + min);
    let response = http.put(`http://localhost:3030/reviews/${randomReviewId}/helpful`);
    check(response, {
      "helpful: is status 204": (response) => response.status === 204
    });
    // db.query(`UPDATE reviews SET helpfulness = helpfulness - 1 WHERE id = ${randomId}`);
}


export default function () {
  // reviewsCheck();
  // metaCheck();
  helpfulnessUpdateCheck();
  // reportReviewCheck();
  // add more endpoint checks here
}

export let options = {
    // scenarios: {
    //   constant_request_rate: {
    //     executor: 'constant-arrival-rate',
    //     rate: 1000,
    //     timeUnit: '1s',
    //     duration: '10s',
    //     preAllocatedVUs: 800,
    //     maxVUs: 1000,
    //   },
    // },
    vus: 1,
    duration: '1s',

    // stages: [
    //   { duration: '10s', target: 100},
    //   { duration: '10s', target: 100},
    //   { duration: '10s', target: 0},
    // ],

    // thresholds: {
    //     http_req_failed: ['rate<0.02'],
    //     http_req_duration: ['p(95)<500'],
    // },
};