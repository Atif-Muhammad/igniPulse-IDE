const mysql = require('mysql2');

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    multipleStatements: true
});

module.exports = connection;
