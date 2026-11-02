// const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 20,
//     queueLimit: 20
// });

// module.exports = pool;


const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     // waitForConnections: true,
//     // connectionLimit: 20, 
//     // queueLimit: 20
// });

const pool = mysql.createPool({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7839832',
    password: 'DWUfkPylkT',
    database: 'sql7839832',
    // waitForConnections: true,
    // connectionLimit: 20, 
    // queueLimit: 20
});

module.exports = pool;