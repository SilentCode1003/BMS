var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');
const { KeyObject } = require('crypto');

var moment = require('moment');

var helper = require('./repository/customhelper');

var budgetAprrovePath = __dirname + '/data/budget/request/approved/';
var budgetPedingPath = __dirname + '/data/budget/request/pending/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('budgetsummary', {
    title: 'Budget Monitoring System', 
    reportTitle: 'BUDGET REQUEST SUMMARY', 
    moment: moment, 
    position: req.session.position,
    fullname: req.session.fullname,
    user: req.session.user
  });
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

        var data = helper.ReadJSONFile(filepath);

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

router.post('/LoadData', function (req, res, next) {
  try {
    var dataArr = [];
    var personel = req.body.personel;
    var targetDir = `${budgetAprrovePath}${personel}/`;


    //Get contents of personel's folder at /budget/approved folder
    fs.readdir(targetDir, function (err, folders) {
      if (err) console.log(`stage1: ${err}`);
      console.log(`stage 1 results: ${targetDir}:\n Contents: ${folders}\n\n`);

      folders.forEach(folder => {
        var targetDir2 = `${targetDir}${folder}/`;
        console.log(`stage 2 results: ${targetDir2}:\n Contents: ${folder}`);

        var totalbudget = 0;

        //Get contents of personel's folder at /budget/approved/personel folder
        fs.readdir(targetDir2, function (err, datas) {
          console.log(`stage 2 results: ${targetDir2}:\n Contents: ${datas}\n dataLength: ${datas.length}`);
          if (err) console.log(`stage2: ${err}`);

          var dataLenght = datas.length;
          var count = 0;
          datas.forEach(data => {

            var targetDir3 = `${targetDir2}${data}`;

            fs.readFile(targetDir3, 'utf8', function (err, jsStr) {
              if (err) console.log(`stage3: ${err}`);
              var jsData = JSON.parse(jsStr);
              count += 1;
              console.log(`stage 3 results: ${targetDir3}:\n Contents: ${jsStr}`);

              jsData.forEach(function (key, item) {
                totalbudget += parseFloat(key.budget);
              });

              if (count == dataLenght) {
                console.log(`Total Budget: ${totalbudget}`);
                console.log(`Status: length: ${dataLenght} count: ${count}`);

                dataArr.push({
                  date: folder,
                  personel: personel,
                  totalbudget: totalbudget
                });
              }

            });

          });

        });

      });

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

router.post('/RetrieveFiles', function (req, res, next) {
  try {
    var dataArr = [];
    var date = req.body.date;
    var personel = req.body.personel;

    var targetDir = `${budgetAprrovePath}/${personel}/${date}/`
    fs.readdir(targetDir, function (err, files) {
      console.log(`stage 1 results: ${targetDir}:\n Contents: ${files}`);

      if (err) console.log(`stage 1: ${err}`);

      files.forEach(file => {
        var filepath = `${targetDir}/${file}`;
        fs.readFile(filepath, 'utf8', function (err, jsStr) {
          if (err) console.log(`stage 2: ${err}`);
          console.log(`stage 2 results: ${filepath}:\n Contents: ${jsStr}`);

          var data = JSON.parse(jsStr);

          data.forEach(function (key, item) {
            dataArr.push({
              date: key.date,
              ticketnum: key.ticketnum,
              personel: key.personel,
              budget: key.budget
            });
          });
        })
      });

      setTimeout(function () {
        res.json({
          msg: 'success',
          date: date,
          personel: personel,
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