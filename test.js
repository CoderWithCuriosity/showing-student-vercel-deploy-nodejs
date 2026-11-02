const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7839832',
    password: 'DWUfkPylkT',
    database: 'sql7839832',
    // waitForConnections: true,
    // connectionLimit: 20, 
    // queueLimit: 20
});

async function checkConnection() {
    const connection = await pool.getConnection();
    console.log('✅ Successfully connected to the MySQL database pool!');

    const [rows] = await pool.query('SELECT NOW() AS currentTime');
    console.log('🕒 Database Current Time:', rows[0].currentTime);
}
// checkConnection();

async function createUserTable() {
    try {
        await checkConnection()
        const [rows] = await pool.query(`CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
        console.log('Table created');
        console.log(rows);
    } catch (error) {
        console.log('an error occurred: ', error)
    }
}


async function checkTable() {
    try {
        await checkConnection()
        const [rows] = await pool.query(`SELECT * FROM users`);
        console.log(rows);
    } catch (error) {
        console.log('an error occurred: ', error)
    }
}
async function createUserTable() {
    try {
        await checkConnection()
        const [rows] = await pool.query(`CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
        console.log('Table created');
        console.log(rows);
    } catch (error) {
        console.log('an error occurred: ', error)
    }
}

// createUserTable();
checkTable()