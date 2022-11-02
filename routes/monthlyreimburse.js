var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');
var helper = require('./repository/customhelper');

var fillingPath = __dirname + '/data/reimbursement/filling/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('monthlyreimburse',
    {
      title: 'Budget Monitoring System',
      reportTitle: 'REIMBURSEMENT MONTHLY SUMMARY',
      position: req.session.position,
      fullname: req.session.fullname,
      user: req.session.user
    });
});

module.exports = router;

router.post('/LoadData', function (req, res, next) {
  try {
    var dataArr = [];
    var personel = req.body.personel;
    var targetDir = `${fillingPath}${personel}/`;

    console.log(`Load data for ${personel}`);

    //Get contents of personel's folder at /budget/approved folder
    fs.readdir(targetDir, function (err, folders) {
      if (err) console.log(`stage1: ${err}`);
      console.log(`stage 1 results: ${targetDir}:\n Contents: ${folders}\n\n`);

      folders.forEach(folder => {
        var targetDir2 = `${targetDir}${folder}/`;
        console.log(`stage 2 results: ${targetDir2}:\n Contents: ${folder}`);

        var totalbudget = 0;
        var totalreimburse = 0;
        var remaining = 0;

        //Get contents of personel's folder at /budget/approved/personel folder
        fs.readdir(targetDir2, function (err, datas) {
          console.log(`stage 2 results: ${targetDir2}:\n Contents: ${datas}\n dataLength: ${datas.length}`);
          if (err) console.log(`stage2: ${err}`);

          var dataLenght = datas.length;
          var count = 0;
          datas.forEach(data => {
            var targetDir3 = `${targetDir2}${data}`;
            var jsData = helper.ReadJSONFile(targetDir3)
            count += 1;
            console.log(`stage 3 results: ${targetDir3}:\n Contents: ${jsData}`);

            jsData.forEach(function (key, item) {
              if (key.budget == 0) {

              }
              else {
                totalbudget += (parseFloat(key.budget) + parseFloat(key.pettycash));
              }

              key.data.forEach(function (key, item) {
                totalreimburse += parseFloat(key.cost);
              });
            });

            if (count == dataLenght) {
              console.log(`Total Budget: ${totalbudget}\nTotal Reimburse: ${totalreimburse}\nRemaining: ${remaining}`);
              console.log(`Status: length: ${dataLenght} count: ${count}`);
              remaining = totalbudget - totalreimburse;

              dataArr.push({
                date: folder,
                personel: personel,
                totalbudget: totalbudget,
                totalreimburse: totalreimburse,
                remaining: remaining
              });
            }

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

router.post('/LoadMonthlyFiles', function (req, res, next) {
  try {
    var dataArr = [];
    var personel = req.body.personel;
    var subfolder = req.body.subfolder;
    var targetDir = `${fillingPath}${personel}/${subfolder}/`;
    var activeFiles = helper.GetFiles(targetDir);

    activeFiles.forEach(file => {
      var targetDir2 = `${targetDir}${file}`;
      var data = helper.ReadJSONFile(targetDir2);

      data.forEach((key, items) => {
        var date = key.date;
        var budget = key.budget;
        var pettycash = key.pettycash;
        var totalbudget = parseFloat(budget) + parseFloat(pettycash);
        var totalcost = 0;
        var balance = 0;

        key.data.forEach((key, item) => {
          totalcost += parseFloat(key.cost);
        })

        balance = parseFloat(totalbudget) - parseFloat(totalcost);

        dataArr.push({
          date: date,
          personel: personel,
          pettycash: pettycash,
          budget: budget,
          totalbudget: totalbudget,
          totalcost: totalcost,
          balance: balance
        });
      });
    });

    setTimeout(() => {
      res.json({
        msg: 'success',
        data: dataArr
      })
    })

  } catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000);
  }
});

router.post('/GetMonthlyData', (req, res, next) => {
  try {
    var dataArr = [];
    var personel = req.body.personel;
    var subfolder = req.body.subfolder;
    var targetDir = `${fillingPath}${personel}/${subfolder}/`;
    var activeFiles = helper.GetFiles(targetDir);

    var totalbudget = 0
    var totalcost = 0;
    var balance = 0;

    activeFiles.forEach(file => {
      var targetDir2 = `${targetDir}${file}`;
      var data = helper.ReadJSONFile(targetDir2);
      data.forEach((key, items) => {
        totalbudget += parseFloat(key.budget) + parseFloat(key.pettycash);
        key.data.forEach((key, item) => {
          totalcost += parseFloat(key.cost);
        })
      });
    });

    balance = parseFloat(totalbudget) - parseFloat(totalcost);


    dataArr.push({
      totalbudget: totalbudget,
      totalcost: totalcost,
      balance: balance
    });

    console.log(dataArr);

    setTimeout(() => {
      res.json({
        msg: 'success',
        data: dataArr
      })
    })
  }
  catch (err) {
    setTimeout(() => {
      res.json({
        msg: err
      });
    });
  }
})