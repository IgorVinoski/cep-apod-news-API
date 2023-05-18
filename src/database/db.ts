import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  pool: {
    min: 1,
    max: 50,
  },
});

export default db;