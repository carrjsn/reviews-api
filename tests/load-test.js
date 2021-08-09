import http from 'k6/http';
import { check } from 'k6';

// aim id range to last 10%
// db review max = 1000011 - should remain constant
const minProductId = 911111;
const maxProductId = 999999;

const reviewsCheck = () => {
  let randomId = Math.floor(Math.random() * (maxProductId - minProductId) + minProductId);
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
  let randomId = Math.floor(Math.random() * (maxProductId - minProductId) + minProductId);
    let response = http.get(`http://localhost:3030/reviews/meta/?product_id=${randomId}`);
    check(response, {
        "meta: is status 200": (response) => response.status === 200,
        "meta: is id the same as input": (response) => {
            let id = Number(response.json("product_id"));
            return id === randomId;
        }
    })

}

// aim id range to last 10%
// db review max = 5774952 - subject to change after posts
const minReviewId = 5333333;
const maxReviewId = 5774444;

const reportReviewCheck = () => {
  let randomReviewId = Math.floor(Math.random() * (maxReviewId - minReviewId) + minReviewId);
    let response = http.put(`http://localhost:3030/reviews/${randomReviewId}/report`);
    check(response, {
      "reportreview: is status 204": (response) => response.status === 204
    });
    // db.query(`UPDATE reviews SET reported = false WHERE id = ${randomReviewId}`);
}

const helpfulnessUpdateCheck = () => {
  let randomReviewId = Math.floor(Math.random() * (maxReviewId - minReviewId) + minReviewId);
    let response = http.put(`http://localhost:3030/reviews/${randomReviewId}/helpful`);
    check(response, {
      "helpful: is status 204": (response) => response.status === 204
    });
    // db.query(`UPDATE reviews SET helpfulness = helpfulness - 1 WHERE id = ${randomId}`);
}

const addReviewCheck = () => {
  // TODO: post review
  let randomProductId = Math.floor(Math.random() * (maxProductId - minProductId) + minProductId);
  var url = `http://localhost:3030/reviews`;
  var payload = JSON.stringify({
    product_id: randomProductId,
    rating: 4,
    summary: 'test review',
    body: 'test review body',
    recommend: true,
    name: 'john',
    email: 'johndoe@email.com',
    photos: ['url1', 'url2'],
    characteristics: {
      // TODO: how to get appropriate char ids that are relevant to random generated product id?
      // max char id = 3347679
      '3347444': 3,
    }
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = http.post(url, payload, params);
  check(response, {
    "postreview: is status 201": (response) => response.status === 201
  });
};


export default function () {
  // reviewsCheck();
  // metaCheck();
  // helpfulnessUpdateCheck();
  reportReviewCheck();
  // addReviewCheck();

  // add more endpoint checks here
}

export let options = {

    // scenarios: {
    //   constant_request_rate: {
    //     executor: 'constant-arrival-rate',
    //     rate: 1,
    //     timeUnit: '1s',
    //     duration: '1m',
    //     preAllocatedVUs: 20,
    //     maxVUs: 100,
    //   },
    // }

    // scenarios: {
    //   constant_request_rate: {
    //     executor: 'constant-arrival-rate',
    //     rate: 10,
    //     timeUnit: '1s',
    //     duration: '1m',
    //     preAllocatedVUs: 20,
    //     maxVUs: 100,
    //   },
    // }

    // scenarios: {
    //   constant_request_rate: {
    //     executor: 'constant-arrival-rate',
    //     rate: 100,
    //     timeUnit: '1s',
    //     duration: '1m',
    //     preAllocatedVUs: 20,
    //     maxVUs: 100,
    //   },
    // }

    scenarios: {
      constant_request_rate: {
        executor: 'constant-arrival-rate',
        rate: 1000,
        timeUnit: '1s',
        duration: '1m',
        preAllocatedVUs: 20,
        maxVUs: 500,
      },
    }

};