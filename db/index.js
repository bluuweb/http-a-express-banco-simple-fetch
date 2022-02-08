const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.USER,
    host: "localhost",
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    port: process.env.PORTDB,
});

module.exports = pool;
