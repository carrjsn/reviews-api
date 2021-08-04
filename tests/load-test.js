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


export default function () {
  // reviewsCheck();
  metaCheck();
  // add more endpoint checks here
}

export let options = {
    vus: 30,
    duration: '5s',
    // thresholds: {
    //     'failed requests': ['rate<0.02'],
    //     http_req_duration: ['p(95)<500'],
    //     http_reqs: ['count>6000']
    // },
};