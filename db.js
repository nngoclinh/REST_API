const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bookstore",
  password: "123",
  port: 5432,
});
module.exports = pool;
