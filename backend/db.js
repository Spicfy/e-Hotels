const Pool = require("pg").Pool;
require('dotenv').config();


const pool = new Pool({
    user: "postgres",
    password: "B4776920$",
    host: "localhost",
    port: 5432, 
    database: "ehotel"
});
module.exports = pool;