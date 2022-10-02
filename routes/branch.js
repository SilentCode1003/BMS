var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');

var fillingPath = __dirname + '/data/masters/branch/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('branch', { title: 'Budget Monitoring System' });
});

module.exports = router;

router.post('/register', function (req, res, next) {
  try {
    var locationname = req.body.locationname;
    var data = req.body.data;
    console.log(data);

    var filename = fillingPath + `${locationname}.json`;

    console.log(filename);

    fs.writeFileSync(filename, data, function (err) {
      if (err) throw err;
      res.json({
        msg: 'error',
        data: err
      });
    });

    setTimeout(function () {
      res.json({
        msg: 'success'
      })
    }, 1000);


  }
  catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000)
  }
});

router.get('/LoadData', function (req, res, next) {
  var dataArr = [];

  try {
    console.log(fillingPath);
    fs.readdir(fillingPath, function (err, files) {
      if (err) {
        res.json({
          msg: 'error',
          data: err
        })
      }

      files.forEach(file => {
        var filepath = fillingPath + `${file}`;
        console.log(filepath);

        fs.readFile(filepath, 'utf8', function (err, jsStr) {
          if (err) {
            res.json({
              msg: 'error',
              data: err
            })
          }

          var data = JSON.parse(jsStr);

          data.forEach(function (key, item) {
            dataArr.push({
              locationname: key.locationname,
              locationaddress: key.locationaddress,
              googleaddress: key.googleaddress
            })
          });
        });
      })

      setTimeout(function () {
        res.json({
          msg: 'success',
          data: dataArr
        })
      }, 1000);

    });
  } catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000);
  }
});