const { Client } = require('pg');

var connectionString = "postgres://postgres:postgres@localhost:5432/postgres";
const client = new Client({
  connectionString: connectionString
});

client.connect();

module.exports = client;

