// Database made with PostgreSQL

const {Pool, Client} = require('pg');

// Get credentials
const pool = new Pool({
    user: 'felipe',
    database: 'twitter'
});

function addUser(ID, name, descr) {
    const command = 'INSERT INTO users VALUES ($1, $2, $3)' 
    const params = [ID, name, descr];

    pool.query(command, params, (err, res) => {
        if(err) {
            console.log("Erro no login");
            console.error(err);
        }
        
        return "DEU BOOOOOM";
    });
}


module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },

    addUser: addUser
}
