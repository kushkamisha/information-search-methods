const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err) => console.error(`Unexpected error on idle client ${err}`));

const query = (queryString, params = []) => new Promise((resolve, reject) => pool
  .connect()
  .then((client) => client
    .query(queryString, params)
    .then((res) => {
      client.release(true);
      resolve(res.rows);
    })
    .catch((err) => {
      client.release(true);
      reject(err.stack);
    })));

module.exports = { pool, query };
