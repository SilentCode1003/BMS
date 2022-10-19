#!/usr/bin/env node
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



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
