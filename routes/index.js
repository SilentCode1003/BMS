var express = require('express');
var router = express.Router();

var app = express();

const { users } = require('./controller/data')
const { authPage, authUser } = require('./controller/authBasic');
const data = require('./controller/data');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Budget Monitoring System', position: 'Admin'});
});

module.exports = router;
