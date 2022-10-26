#!/usr/bin/env node
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);
const { TextEncoder, TextDecoder } = require("util");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var personelRouter = require('./routes/personel');
var branchRouter = require('./routes/branch');
var fillingRouter = require('./routes/filling');
var reimbursementsummaryRouter = require('./routes/reimbursementsummary');
var requestRouter = require('./routes/request');
var budgetsummaryRouter = require('./routes/budgetsummary');
var positionRouter = require('./routes/position');
var transportationRouter = require('./routes/transportation');
var monthlyreimburseRouter = require('./routes/monthlyreimburse');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register')

var app = express();

//mongodb
mongoose.connect('mongodb://localhost:27017/BMS')
  .then((res) => {
    console.log("MongoDB Connected!");
  });

  const store = new MongoDBSession({
    uri: 'mongodb://localhost:27017/BMS',
    collection: 'BMSSessions',
  });

//Session
app.use(
  session({
    secret: "5L Secret Key",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/personel', personelRouter);
app.use('/branch', branchRouter);
app.use('/filling', fillingRouter);
app.use('/reimbursementsummary', reimbursementsummaryRouter);
app.use('/request', requestRouter);
app.use('/budgetsummary', budgetsummaryRouter);
app.use('/position', positionRouter);
app.use('/transportation', transportationRouter);
app.use('/monthlyreimburse', monthlyreimburseRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
