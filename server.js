const express = require("express");
const fs = require("fs");

const db = require('./src/database');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const user = {
  id: 'guest123'
}

app.get("/", (req, res) => {
  const command = 'select tweet_id, author, name, date, content, rts, likes, cmnts from tweets inner join users on author = user_id'
  db.query(command, [], (err, response) => {
    if (err) {
      return err;
    }
    const tweets = response.rows;

    // res.status(200).send(tweets);
    res.render("home", { tweets: tweets.slice().reverse()});
  });
});

app.post("/", (req, res) => {
  let body = req.body;

  // Create a new post and add to the list
  const command = 'INSERT INTO tweets() VALUES ($1, $2, $3)';
  const params = [req.body];
  db.query(command, [], (err, response) => {
    if (err) {
      return err;
    }
    const tweets = response.rows;

    // res.status(200).send(tweets);
    res.render("home", { tweets: tweets.slice().reverse()});
  });

  res.redirect("/");
});

app.get("/users/:userID", (req, res) => {
  const userID = req.params.userID;

  const userTweets = db.tweets.filter(twt => twt.user.author === userID);

  let profile = userTweets[0].user;

  res.render('user', { user: profile, tweets: userTweets });
});

app.post("/save", (req, res) => {
  // Save file with tweets
  let data = JSON.stringify(db);
  fs.writeFileSync('defaultTweets.json', data);
  res.redirect('/');
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