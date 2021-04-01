// const twitter = require('./app');
const express = require("express");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));

class Tweet {
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
}

app.get("/", (req, res) => {
  res.render("home", { tweets: db.tweets.slice().reverse()});
});

app.post("/", (req, res) => {
  let body = req.body;

  // Create a new post and add to the list
  let tweet = new Tweet(db.id++, user.author, user.name, body.content);
  db.tweets.push(tweet);

  res.redirect("/");
});

app.get("/user/:userID", (req, res) => {
  const userID = req.params.userID;

  const userTweets = db.tweets.filter(twt => twt.user.author === userID);

  let profile = userTweets[0].user;

  res.render('user', {user: profile, tweets: userTweets});
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
