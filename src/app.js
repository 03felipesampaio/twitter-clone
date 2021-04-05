const express = require('express');

const app = express();

// API routes
const routes = require('./routes');

// Parse the contents of the form
app.use(express.urlencoded({extended: true}));
// EJS
app.set("view engine", "ejs");
// CSS and Images
app.use(express.static(__dirname + '/public'));
// Routes
app.use(routes);


module.exports = {app};