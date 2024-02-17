const { Pool } = require("pg");

const postgresql = new Pool({
  user: "postgres",
  host: "localhost",
  database: "suwit_game",
  port: 5432,
  password: "password",
});

module.exports = postgresql;
