var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');

var fillingPath = __dirname + '/data/reimbursement/filling/';

function xmlFileToJs(filename, cb) {
  var filepath = path.normalize(path.join(__dirname + '/data/establishment/', filename));
  fs.readFile(filepath, 'utf8', function (err, xmlStr) {
    if (err) throw (err);
    xml2js.parseString(xmlStr, {}, cb);
  });
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('filling', {
    title: 'Budget Monitoring System',
    position: req.session.position,
    fullname: req.session.fullname,
    user: req.session.user
  });
});

module.exports = router;

router.post('/save', function (req, res, next) {
  try {
    console.log(req.body);
    var personel = req.body.personel;
    var date = req.body.date;
    var data = req.body.data;
    var dateArr = date.split('-');
    var year = dateArr[0];
    var month= dateArr[1];

    var targetDir = fillingPath + personel;
    var targetDir2 = `${targetDir}/${year}${month}`

    console.log(targetDir);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }

    if (!fs.existsSync(targetDir2)) {
      fs.mkdirSync(targetDir2);
    }



    try {
      let fullFileNameFinal = `${targetDir2}/${date}_${personel}.json`;
      fs.writeFileSync(fullFileNameFinal, data, function (err) {
        if (err) throw err;
        res.json({
          msg: 'error',
          data: err
        });
      });
    }
    catch (err) {
      console.log(err);
    }


    setTimeout(function () {
      res.json({
        msg: 'success'
      })
    }, 1000);


  }
  catch (err) {
    console.log(err);
    throw err;
  }

});