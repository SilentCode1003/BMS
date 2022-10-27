var express = require('express');
var router = express.Router();

var app = express();

const { users } = require('./controller/data')
const { isAuthAdmin } = require('./controller/authBasic');
const data = require('./controller/data');

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('index', {
    title: 'Budget Monitoring System',
    position: req.session.position,
    fullname: req.session.fullname,
    user: req.session.user
  });
});

module.exports = router;
