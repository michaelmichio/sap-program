const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

export default knex;

// Knex Konfigurasi: Anda telah mengonfigurasi Knex dengan benar dengan parameter yang diperlukan.
// Namun, perlu diperhatikan bahwa jika Anda akan menggunakan file ini di lingkungan Node.js yang mendukung sintaks ES6 (seperti Node.js 14+),
// Anda mungkin perlu mengubah baris export default knex; menjadi module.exports = knex;.
