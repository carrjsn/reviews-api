const { Pool } = require('pg');
require('dotenv').config();

const DATABASE = process.env.NODE_ENV === 'test' ? 'testdb' : 'loadtestdb';
// sdc_reviews = production db

var connectionString = `postgres://postgres:jasoncarr@localhost:5432/${DATABASE}`;
const pool = new Pool({
  connectionString: connectionString
});

pool.connect();

module.exports = pool;
