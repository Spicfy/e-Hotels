const Pool = require("pg").Pool;
require('dotenv').config();


const pool = new Pool({
    user: "postgres",
    password: "Tyd.20020924",
    host: "localhost",
    port: 5432,
    database: "ehotel"
});


module.exports = pool;