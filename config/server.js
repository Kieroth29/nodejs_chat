var express = require('express');
var cors = require('cors');
var session = require('express-session');
var consign = require('consign');
var bodyParser = require('body-parser');
var compression = require('compression');
var helmet = require('helmet');

var app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('./app/public'));

app.use(bodyParser.urlencoded({extended: true}));

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(helmet());

//app.use(cors());

consign()
    .include('app/routes')
    .then('app/models')
    .then('app/controllers')
    .then('config/db.js')
    .into(app);

module.exports = app;