// Database made with PostgreSQL

module.exports = {
    query,
    addUser,
    toggleLike,
    toggleRT
}


const { Pool, Client } = require('pg');

// Get credentials
const pool = new Pool({
    user: 'felipe',
    database: 'twitter'
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

function query (text, params, callback) {
    return pool.query(text, params, callback);
}

function addUser(ID, name, descr) {
    const command = 'INSERT INTO users VALUES ($1, $2, $3)'
    const params = [ID, name, descr];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.log("Erro no login");
            console.error(err);
        }

        return "DEU BOOOOOM";
    });
}

function toggleLike(userID, tweetID) {
    const command = 'SELECT * FROM likes WHERE author = $1 AND tweet = $2';
    const params = [userID, tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error("Erro em like\n", err);
            return err;
        }

        if (!res.rows.length) {
            addLike(userID, tweetID);
        } else {
            removeLike(userID, tweetID);
        }
    });
}

function addLike(userID, tweetID) {
    let command = 'INSERT INTO likes VALUES ($1, $2)';
    let params = [userID, tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error("Erro em add like\n", err);
            return err;
        }
    });

    command = `UPDATE tweets SET likes = likes + 1 WHERE id = $1`;
    params = [tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error(err);
            return err;
        }
    });

    console.log("Liked");
}

function removeLike(userID, tweetID) {
    let command = 'DELETE FROM likes WHERE author = $1 AND tweet = $2';
    let params = [userID, tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error("Erro em remove like\n", err);
            return err;
        }
    });

    command = `UPDATE tweets SET likes = likes - 1 WHERE id = $1`;
    params = [tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error(err);
            return err;
        }
    });

    console.log("Removeu like");
}

function toggleRT(userID, tweetID) {
    const command = 'SELECT * FROM retweets WHERE author = $1 AND tweet_id = $2';
    const params = [userID, tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error("Erro em RT\n", err);
            return err;
        }

        if (!res.rows.length) {
            addRT(userID, tweetID);
        } else {
            removeRT(userID, tweetID);
        }
    });
}

function addRT(userID, tweetID) {
    let command = 'INSERT INTO retweets(author, tweet_id) VALUES ($1, $2)';
    let params = [userID, tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error("Erro em add like\n", err);
            return err;
        }
    });

    command = `UPDATE tweets SET rts = rts + 1 WHERE id = $1`;
    params = [tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error(err);
            return err;
        }
    });

    console.log("ADD RT");
}

function removeRT(userID, tweetID) {
    let command = 'DELETE FROM retweets WHERE author = $1 AND tweet_id = $2';
    let params = [userID, tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error("Erro em remove rt\n", err);
            return err;
        }
    });

    command = `UPDATE tweets SET rts = rts - 1 WHERE id = $1`;
    params = [tweetID];

    pool.query(command, params, (err, res) => {
        if (err) {
            console.error(err);
            return err;
        }
    });

    console.log("Removeu rt");
}