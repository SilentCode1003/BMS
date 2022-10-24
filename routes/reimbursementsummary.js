var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');
var helper = require('./repository/customhelper');

var targetPath = __dirname + '/data/reimbursement/filling/';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('reimbursementsummary', {
    title: 'Budget Monitoring System',
    position: req.session.position,
    fullname: req.session.fullname,
    user: req.session.user,
    reportTitle: 'REIMBURSEMENT FORM'
  });
});

module.exports = router;

router.post('/LoadData', function (req, res, next) {
  var personel = req.body.personel;
  var targetDir = targetPath + `/${personel}/`;
  var targetDir2 = targetPath + `/${personel}`;
  var activeFolder = helper.GetFolderList(targetDir);
  var dataArr = [];

  activeFolder.forEach(folder => {
    var targetDir3 = `${targetDir2}/${folder}/`;
    var activeFiles = helper.GetFiles(targetDir3);
    console.log(`Folder: ${targetDir3}\nFiles: ${activeFiles}`);
    activeFiles.forEach(file => {
      var filenameArr = file.split('.');
      var filenameArr2 = filenameArr[0].split('_');
      dataArr.push({
        date: filenameArr2[0],
        personel: filenameArr2[1]
      });
    });
  });


  console.log(activeFolder);

  setTimeout(() => {
    res.json({
      msg: 'success',
      data: dataArr
    })
  }, 1000)
});

router.post('/retrieveFile', function (req, res, next) {
  var filename = req.body.filename;
  var personel = req.body.personel;
  var subfolder = req.body.subfolder
  var filepath = `${targetPath}/${personel}/${subfolder}/${filename}`;
  var data = helper.ReadJSONFile(filepath);

  console.log(filepath);

  setTimeout(() => {
    res.json({
      msg: 'success',
      data: data
    })
  })
});