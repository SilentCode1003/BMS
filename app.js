var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var transportationRouter = require("./routes/transportation");
var routeRouter = require("./routes/route");
var positionRouter = require("./routes/position");
var accesstypeRouter = require("./routes/accesstype");
var locationRouter = require("./routes/location");
var departmentRouter = require("./routes/department");
var routepriceRouter = require("./routes/routeprice");
var storeRouter = require("./routes/store");
var employeeRouter = require("./routes/employee");
var roleRouter = require("./routes/role");
var budgetRouter = require("./routes/budget");
var historyRouter = require("./routes/history");

const mysql = require("./routes/repository/budgetdb");

var app = express();

//Check SQL Connection
mysql.CheckConnection();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/transportation", transportationRouter);
app.use("/route", routeRouter);
app.use("/position", positionRouter);
app.use("/accesstype", accesstypeRouter);
app.use("/department", departmentRouter);
app.use("/location", locationRouter);
app.use("/routeprice", routepriceRouter);
app.use("/store", storeRouter);
app.use("/employee", employeeRouter);
app.use("/role", roleRouter);
app.use("/history", historyRouter);
app.use("/budget", budgetRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
