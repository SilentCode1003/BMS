const { json } = require('express');
var express = require('express');
var router = express.Router();

var helper = require('./repository/customhelper')

var UserPath = `${__dirname}/data/masters/users/`;

/* GET home page. */
router.get('/', function (req, res) {
  res.render('login', { title: 'Budget Monitoring System' });
});

module.exports = router;

router.post('/authentication', (req, res) => {
  try {
    var id = req.body.id;
    var password = req.body.password;
    var files = helper.GetFiles(UserPath);
    var message = "";

    message = "error";
    files.forEach(file => {
      
      var filename = `${UserPath}/${file}`;
      var data = helper.ReadJSONFile(filename);
      console.log(data);


      data.forEach((key, item) => {
        console.log(`user:${key.idnumber} password:${key.password}`)
        if (key.idnumber == id && key.password == password) {
          message = 'success';
          res.json({
            msg: 'success'
          }).render('index', { 
            title: 'Budget Monitoring System',
            position: 'Admin'
          });
        }
      })
    })
    console.log(message);

    if (message == "error"){
      res.json({
        msg: 'error'
      });
    }

   
  } catch (error) {
    res, json({
      msg: error
    })
  }
});
