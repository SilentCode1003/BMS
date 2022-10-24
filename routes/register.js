var express = require('express');
var router = express.Router();
var helper = require('./repository/customhelper')
const { users } = require('./controller/data');
const { isAuthAdmin } = require('./controller/authBasic');
// const pool = require('./controller/dbconnect');

var app = express();
app.use(setUser);

function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next();
};

var UserPath = __dirname + '/data/masters/users/';

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('registeruser', {
    title: 'Budget Monitoring System',
    position: req.session.position,
    fullname: req.session.fullname,
    user: req.session.user
  });
});

module.exports = router;

router.get('/LoadData', (req, res, next) => {
  try {
    var dataArr = [];
    var files = helper.GetFiles(UserPath);

    files.forEach(file => {
      var filepath = `${UserPath}${file}`
      var data = helper.ReadJSONFile(filepath);

      data.forEach((key, item) => {
        dataArr.push({
          idnumber: key.idnumber,
          fullname: key.fullname,
          password: key.password,
          position: key.position,
          assignedlocation: key.assignedlocation,

        });
      })
    });

    setTimeout(() => {
      res.json({
        msg: 'success',
        data: dataArr
      })
    }, 1000)
  }
  catch (err) {
    res.json({
      msg: err
    })
  }
});

router.post('/registeruser', async (req, res, next) => {
  try {

    var data = req.body.data;
    var fullname = req.body.fullname;
    var filename = `${UserPath}${fullname}.json`;

    helper.CreateJSON(filename, data);

    setTimeout(() => {
      res.json({
        msg: 'Success'
      })
    }, 1000)
  }
  catch (err) {
    res.json({
      msg: err
    });
  }
});