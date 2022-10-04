var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');

var requestPendingPath = __dirname + '/data/budget/request/pending/';
var requestApprovePath = __dirname + '/data/budget/request/approved/';
var requestDenyPath = __dirname + '/data/budget/request/denied/';

var moment = require('moment');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('request', { title: 'Budget Monitoring System', moment: moment });
});

module.exports = router;

router.get('/LoadData', function (req, res, next) {
  var dataArr = [];

  try {
    console.log(requestPendingPath);
    fs.readdir(requestPendingPath, function (err, files) {
      if (err) {
        res.json({
          msg: 'error',
          data: err
        })
      }

      files.forEach(file => {
        var filepath = requestPendingPath + `${file}`;
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
              'date': key.date,
              'ticketnum': key.ticketnum,
              'personel': key.personel,
              'location': key.location,
              'budget': key.budget,
              'status': key.status
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

router.post('/register', function (req, res, next) {
  try {
    var date = req.body.date;
    var personel = req.body.personel;
    var data = req.body.data;
    console.log(data);

    var filename = requestPendingPath + `${date}_${personel}.json`;

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