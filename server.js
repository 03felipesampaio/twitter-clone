// const twitter = require('./app');
const { static } = require("express");
const express = require("express");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));

class Tweet {
    constructor(id, author, name, content) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.date = new Date();
        this.content = content;

        this.likes = 0;
        this.rt = 0;
        this.comments = 0;
    }
}

let db = JSON.parse(fs.readFileSync('defaultTweets.json'));

let user = {
  author: 'user123',
  name: 'USER'
}

app.get("/", (req, res) => {
  let options = {weekday: 'long', month: 'long', day: 'numeric'};

  res.render("home", { tweets: db.tweets.slice().reverse(), options: options});
});

app.post("/", (req, res) => {
  let body = req.body;
  
  // Create a new post and add to the list
  let tweet = new Tweet(db.id++, user.author, user.name, body.content);
  db.tweets.push(tweet);

  res.redirect("/");
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
