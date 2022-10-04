var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');

var targetPath = __dirname + '/data/reimbursement/filling/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('reimbursementsummary', { title: 'Budget Monitoring System', reportTitle: 'REIMBURSEMENT FORM' });
});

module.exports = router;

router.post('/LoadData', function (req, res, next) {
  var personel = req.body.personel;
  var targetDir = targetPath + `/${personel}/`;
  var targetDir2 = targetPath + `/${personel}`;

  if (!fs.existsSync(targetDir2)) {
    fs.mkdirSync(targetDir2);
  }

  console.log(targetDir);

  var data_arr = [];
  fs.readdir(targetDir, (err, files) => {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      });
    }

    files.forEach(file => {
      console.log(file);
      var rawTxt = file.split('.');
      console.log(rawTxt);
      var txt = rawTxt[0].split('_');
      console.log(txt);
      data_arr.push({
        'date': txt[0],
        'personel': txt[1]
      });
    });
  });

  setTimeout(function () {
    res.json({
      msg: 'success',
      data: data_arr
    });
  }, 1000);
});

router.post('/retrieveFile', function (req, res, next) {
  var filename = req.body.filename;
  var personel = req.body.personel;

  var filepath = targetPath + `/${personel}/${filename}`;
 
  console.log(filepath);

  fs.readFile(filepath, 'utf8', function (err, jsStr) {
    if (err) {
      res.json({
        msg: 'error',
        data: err
      })
    }
    const data = JSON.parse(jsStr);

    console.log(data);
    res.json({
      msg: 'success',
      data: data
    })
  });
});