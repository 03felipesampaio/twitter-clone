// Database made with PostgreSQL

const {Pool, Client} = require('pg');

// Get credentials
const pool = new Pool({
    user: 'felipe',
    database: 'twitter'
});


module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    }
}
