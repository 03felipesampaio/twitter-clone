const express = require("express");

const db = require('./src/database');

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/public'));

const user = {
  id: 'guest123'
}

// *** Login page ***
app.get("/login", (req, res) => {

  res.render("login", {message: null});
});

// Create a new user
app.post('/login/create', (req, res) => {
  const userID = req.body.user;
  const command = `SELECT * FROM users WHERE user_id = $1`;
  const params = [userID];

  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    if(!response.rows.length){
      
      const body = req.body;
      user.id = body.user;
      db.addUser(body.user, body.name, body.descr);
      res.redirect("/");

    } else {

      console.log("Achei ", userID);

      res.redirect('/login', {message: {
          user : 'User ja está em uso'
        }
      });
    }

  });
});

app.post('/login/enter', (req, res) => {
  const userID = req.body.user;
  const command = `SELECT * FROM users WHERE user_id = $1`;
  const params = [userID];

  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    if(!response.rows.length){
      const body = req.body;
      const foundUser = response.rows[0].author
      user.id = foundUser;
      db.addUser(body.user, body.name, body.descr);
      res.redirect("/");

    } else {

      console.log("Nao achei", userID);

      res.redirect('/login', {message: {
          user : 'User ja está em uso'
        }
      });
    }

  })
});


// *** Home page ***
app.get("/", (req, res) => {
  if(!user.id) {
    res.redirect("/login");
    return;
  }


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


// *** POSTS ***

// Create a new post and add to the list
app.post("/", (req, res) => {
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

// Add like to a tweet
app.post('/tweets/:id/like', (req, res) => {
  db.toggleLike(user.id, req.params.id);

  res.redirect("/");
});

// Retweet
app.post('/tweets/:id/rt', (req, res) => {
  db.toggleRT(user.id, req.params.id);
  res.redirect('/');
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

    res.render('tweet', { author: { id:'teste123', name:'oi' }, tweet:response.rows[0] } );
  });
});

// *** USERS PAGE ***

// Get a users page
app.get("/users/:userID", (req, res) => {
  const command = `SELECT * FROM tweets INNER JOIN users ON author = user_id WHERE author = $1`;
  const params = [req.params.userID];

  db.query(command, params, (err, response) => {
    if (err) {
      console.error(err);
      return err;
    }

    const tweets = response.rows;
    const author = {
      user : tweets[0].author,
      name : tweets[0].name, 
      descr: tweets[0].descr 
    };

    res.render('user', {author: author, tweets: tweets.slice().reverse() });
  });
});



app.listen(3000, () => {
  console.log("Listening on 3000");
});