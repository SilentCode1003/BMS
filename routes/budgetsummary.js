var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');

var budgetAprrovePath = __dirname + '/data/budget/request/approved/';
var budgetPedingPath = __dirname + '/data/budget/request/pending/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('budgetsummary', { title: 'Budget Monitoring System', reportTitle: 'BUDGET REQUEST SUMMARY' });
});

module.exports = router;

router.get('/LoadPendingBudgetRequest', function (req, res, next) {

  var dataArr = [];

  try {
    console.log(budgetPedingPath);
    fs.readdir(budgetPedingPath, function (err, files) {
      if (err) {
        res.json({
          msg: 'error',
          data: err
        })
      }

      files.forEach(file => {
        var filepath = budgetPedingPath + `${file}`;
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
            });
            console.log(dataArr);
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

router.post('/approved', function (req, res, next) {
  try {
    var dataArr = [];
    var date = req.body.date;
    var personel = req.body.personel;
    var file = `${date}_${personel}.json`;
    var dateArr = date.split('-');
    var dateFile = `${dateArr[0]}${dateArr[1]}`
    var subfile = `${personel}/${dateFile}`
    var destionationFile = `${budgetAprrovePath}${subfile}/${file}`;
    var targetDir2 = budgetAprrovePath + `/${personel}`;
    var targetDir3 = budgetAprrovePath + `/${personel}/${dateFile}`;

    if (!fs.existsSync(targetDir2)) {
      fs.mkdirSync(targetDir2);
    }

    if (!fs.existsSync(targetDir3)) {
      fs.mkdirSync(targetDir3);
    }

    console.log(file);

    var filepath = budgetPedingPath + file;
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
          'status': 'APPROVED'
        });
        console.log(dataArr);
      });

      var updateData = JSON.stringify(dataArr, null, 2);
      console.log(updateData);

      //update data inside the file
      fs.writeFileSync(filepath, updateData, function (err) {
        if (err) throw err;
        res.json({
          msg: 'error',
          data: err
        });

      });

      //transfer to approved folder(from pending to approved)
      fs.renameSync(filepath, destionationFile);
      console.log(`Moved ${filepath} to ${destionationFile}`);

      setTimeout(function () {
        res.json({
          msg: 'success'
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