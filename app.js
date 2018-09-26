var createError = require('http-errors');
var express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



//let Promise = require('bluebird');
//let mongodb = require('mongodb');
//let MongoClient = mongodb.MongoClient;
//let Collection = mongodb.Collection;
let MongoDB = require('mongodb-bluebird');



//Promise.promisifyAll(Collection.prototype);
//Promise.promisifyAll(MongoClient);
//const expressMongoDb = Promise.promisifyAll(require('express-mongo-db'));




// DOTENV ---------------------
const dotenv = require('dotenv');
dotenv.config();
//-----------------------------


// Route Initializer------------------------------------------
const indexRoute = require('./routes/index');
const Api = require('./routes/Api')(express,MongoDB);
//-------------------------------------------------


//DB dbInstance
//app.use(expressMongoDb(process.env.DB_CON));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
app.use('/', indexRoute);
app.use('/Api', Api);
// -----------------------------


//app.use('/', indexRoute);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
