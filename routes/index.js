var express = require('express');
var router = express.Router();

var app = express();
app.use(setUser);

const { users } = require('./controller/data')
const {notLogin} = require('./controller/authBasic')

/* GET home page. */
router.get('/', notLogin , function(req, res, next) {
  res.render('index', { title: 'Budget Monitoring System' });
});

module.exports = router;

function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next();
};
