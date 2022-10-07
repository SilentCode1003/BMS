var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');
var helper = require('./repository/customhelper');

var fillingPath = __dirname + '/data/reimbursement/filling/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('monthlyreimburse', { title: 'Budget Monitoring System', reportTitle: 'REIMBURSEMENT MONTHLY SUMMARY' });
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
              totalbudget += (parseFloat(key.budget) + parseFloat(key.pettycash));
              key.data.forEach(function(key, item){
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