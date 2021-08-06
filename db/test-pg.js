const { Pool } = require('pg');

var connectionString = "postgres://postgres:jasoncarr@localhost:5432/new";
const pool = new Pool({
  connectionString: connectionString
});

pool.connect();

module.exports = pool;