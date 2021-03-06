var createError = require('http-errors');
var express = require('express');
const app = express();
app.disable('x-powered-by');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let MongoDB = require('mongodb-bluebird');
let Passport = require('passport');
let express_graphql = require('express-graphql');
let { buildSchema } = require('graphql');




let routeInit = {
  express: express,
  MongoDB: MongoDB,
  Passport: Passport
}



// DOTENV ---------------------
const dotenv = require('dotenv');
dotenv.config();
//-----------------------------


// Route Initializer------------------------------------------
const cv = require('./routes/cv')(routeInit);
//-------------------------------------------------


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');





// Use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// CORS -------------------------------
app.use(function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Options');

    req.method === 'OPTIONS' ?
    res.sendStatus(200) :
    next();
});
//-------------------------------------




// ROUTE DEFINITIONS-----------------------
app.use('/cv', cv);
// -----------------------------



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //next(createError(404));
  res.status(404).send("<h1>404 Not Found!</h1>");
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
