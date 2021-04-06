const express = require("express");

const db = require('./src/database');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const user = {
  id: 'guest123'
}

// Home page
app.get("/", (req, res) => {
  const columns = 'id, author, name, date, content, rts, likes, cmmnts'
  const command = `SELECT ${columns} FROM tweets inner join users on author = user_id`;
  db.query(command, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }
    const tweets = response.rows;
    res.render("home", { tweets: tweets.slice().reverse()});
  });
});

app.get('/teste', (req, res) => {
  res.render('teste');
})

app.post("/", (req, res) => {
  // Create a new post and add to the list
  const command = 'INSERT INTO tweets(author, content) VALUES ($1, $2)';
  const params = [user.id, req.body.content];
  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    console.log('INSERTED 0 1');
    res.redirect("/");
  });
});

// Get a users page
app.get("/users/:userID", (req, res) => {
  // Create a new post and add to the list
  const rows = 'id, author, name, date, content, rts, likes, cmmnts';
  const command = `SELECT ${rows} FROM tweets inner join users on author = $1`;
  const params = [req.params.userID];

  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    const tweets = response.rows;

    // console.log(tweets[0].likes);

    res.render('user', {tweets: tweets });
  });
});

// Search for a tweet
app.get("/tweets/:id", (req, res) => {
  const command = `SELECT * FROM tweets WHERE id = $1`;
  const params = [req.params.id];

  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    const tweet = response.rows;

    // console.log(tweets[0].likes);

    res.send(tweet);
  });
});

// Add like to a tweet
app.post('/tweets/:id/like', (req, res) => {
  const command = `UPDATE tweets SET likes = likes + 1 WHERE id = $1`;
  const params = [req.params.id];

  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    console.log(response);
    res.status(200).send({message: 'LIKED TWEET'});
  });

});

// Retweet
app.post('/tweets/:id/rt', (req, res) => {
  let command_ = `UPDATE $1 SET $2 = $3 + 1 WHERE $4 = $5`;
  let params = ['tweets', 'rts', 'rts', 'id', req.params.id];

  // *** LEMBRAR DE FAZER UMA TRANSACAO RT -> ADD RT TABLE ***
  db.query(command_, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    console.log('RT');
  });

  command_ = `INSERT INTO retweets(tweet_id, author) VALUES($1, $2)`;
  params = [req.params.id, user.id];

  // *** LEMBRAR DE FAZER UMA TRANSACAO RT -> ADD RT TABLE ***
  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    console.log('RT SALVO');
    res.status(200).send({message: 'RT adicionado com sucesso'});
  });


});

// Delete a tweet
app.post('/delete/:tweetID', (req, res) => {
  const command = 'DELETE FROM tweets WHERE id = $1';
  const params = [req.params.tweetID];
  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    console.log('DELETED');
    res.redirect("/");
  });

});

app.listen(3000, () => {
  console.log("Listening on 3000");
});





/* class Tweet {
  constructor(id, author, name, content) {

    this.user = {
      author: author,
      name: name
    }
    this.id = id;
    this.date = new Date();
    this.content = content;

    this.likes = 0;
    this.rt = 0;
    this.comments = 0;
  }

  get time() {
    const options = { month: 'long', day: 'numeric' };
    return (new Date(this.date)).toLocaleString('en-US', options)
  }
}

let db = JSON.parse(fs.readFileSync('defaultTweets.json'));

let user = {
  author: 'user123',
  name: 'Guest'
} */