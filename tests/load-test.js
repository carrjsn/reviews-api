import http from 'k6/http';
import { check } from 'k6';

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

const addReviewCheck = () => {
  // TODO: post review
};


export default function () {
  reviewsCheck();
  // metaCheck();
  // helpfulnessUpdateCheck();
  // reportReviewCheck();
  // addReviewCheck();

  // add more endpoint checks here
}

export let options = {

    scenarios: {
      constant_request_rate: {
        executor: 'constant-arrival-rate',
        rate: 1,
        timeUnit: '1s',
        duration: '1m',
        preAllocatedVUs: 20,
        maxVUs: 100,
      },
    }

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

    // scenarios: {
    //   constant_request_rate: {
    //     executor: 'constant-arrival-rate',
    //     rate: 1000,
    //     timeUnit: '1s',
    //     duration: '1m',
    //     preAllocatedVUs: 20,
    //     maxVUs: 500,
    //   },
    // }
};