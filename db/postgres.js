const { Pool } = require('pg');

var connectionString = "postgres://postgres:jasoncarr@localhost:5432/sdc_reviews";
const pool = new Pool({
  connectionString: connectionString
});

pool.connect();

module.exports = pool;


// const { Client } = require('pg');

// var connectionString = "postgres://postgres:jasoncarr@localhost:5432/sdc_reviews";
// const client = new Client({
//   connectionString: connectionString
// });

// client.connect();

// module.exports = client;
