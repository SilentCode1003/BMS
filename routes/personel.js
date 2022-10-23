var express = require('express');
var router = express.Router();

const { create } = require('xmlbuilder2');
var xml2js = require('xml2js');
var fs = require('fs');

var fillingPath = __dirname + '/data/masters/personel/';
var locationsPath = __dirname + '/data/masters/branch/';
var positionsPath = __dirname + '/data/masters/position/';
var transportationPath = __dirname + '/data/masters/transportation/';
var app = express();
app.use(setUser);

const { users } = require('./controller/data')
const {isAuthAdmin} = require('./controller/authBasic')


function setUser(req, res, next) {
  const userId = req.body.userId
  if (userId) {
    req.user = users.find(user => user.id === userId)
  }
  next();
};

/* GET home page. */
router.get('/', isAuthAdmin, function (req, res, next) {
  res.render('personels', { title: 'Budget Monitoring System' });
});

module.exports = router;

router.post('/register', function (req, res, next) {
  try {
    var idnumber = req.body.idnumber;
    var fullname = req.body.fullname;
    var data = req.body.data;
    console.log(data);

    var filename = fillingPath + `${idnumber}_${fullname}.json`;

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

router.get('/locations', function (req, res, next) {
  var dataArr = [];
  try {
    fs.readdir(locationsPath, function (err, files) {
      files.forEach(file => {
        var dataRaw = file.split('.');
        dataArr.push(dataRaw[0]);
      })
    });

    console.log(dataArr);

    setTimeout(function () {
      res.json({
        msg: 'success',
        data: dataArr
      })
    }, 1000);

  } catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000);
  }
})

router.get('/positions', function (req, res, next) {
  var dataArr = [];
  try {
    fs.readdir(positionsPath, function (err, files) {
      files.forEach(file => {
        var dataRaw = file.split('.');
        dataArr.push(dataRaw[0]);
      })
    });

    console.log(dataArr);

    setTimeout(function () {
      res.json({
        msg: 'success',
        data: dataArr
      })
    }, 1000);

  } catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000);
  }
})

router.get('/personels', function (req, res, next) {
  var dataArr = [];
  try {
    fs.readdir(fillingPath, function (err, files) {
      files.forEach(file => {
        var dataRaw = file.split('.');
        var dataRaw2 = dataRaw[0].split('_');
        console.log(dataRaw2);
        dataArr.push(dataRaw2[1]);
      })
    });

    console.log(dataArr);

    setTimeout(function () {
      res.json({
        msg: 'success',
        data: dataArr
      })
    }, 1000);

  } catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000);
  }
})

router.get('/transportations', function (req, res, next) {
  var dataArr = [];
  try {
    fs.readdir(transportationPath, function (err, files) {
      files.forEach(file => {
        var dataRaw = file.split('.');
        dataArr.push(dataRaw[0]);
      })
    });

    setTimeout(function () {
      res.json({
        msg: 'success',
        data: dataArr
      })
    }, 1000);

  } catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      })
    }, 1000);
  }
})

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
              idnumber: key.idnumber,
              fullname: key.fullname,
              position: key.position,
              assignedlocation: key.assignedlocation,
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

router.post('/getPersonel', function (req, res, next) {
  try {
    var dataArr = [];
    var personel = req.body.personel;

    fs.readdir(fillingPath, function (err, files) {
      if (err) throw err;
      console.log(files);

      files.forEach(file => {
        if (file.includes(personel)) {
          var filepath = `${fillingPath}${file}`;

          fs.readFile(filepath, function (err, jsStr) {
            if (err) throw err;

            console.log(`path: ${filepath}\nContent: ${jsStr}`)

            var data = JSON.parse(jsStr);

            data.forEach(function (key, item) {
              dataArr.push({
                'id': key.idnumber,
                'personel': key.fullname,
                'position': key.position,
                'location': key.assignedlocation
              })
              console.log(dataArr);
            });

            setTimeout(function () {
              res.json({
                msg: 'success',
                data: dataArr
              });
            }, 1000);

          })
        }
      })
    });

  }
  catch (err) {
    setTimeout(function () {
      res.json({
        msg: err
      });
    }, 1000);
  }
});

