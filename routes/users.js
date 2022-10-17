var express = require('express');
var router = express.Router();

var app = express();
app.use(setUser);

const { users } = require('./controller/data')
const {authUser} = require('./controller/authBasic')


function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next();
};

/* GET users listing. */
router.get('/', authUser, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
