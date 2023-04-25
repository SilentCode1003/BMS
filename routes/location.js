var express = require('express');
var router = express.Router();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('location', { title: 'Express' });
});

module.exports = router;
router.get('/load', (req, res) => {
  try {
    let sql = 'select * from master_location';

    mysql.Select(sql, 'MasterLocation', (err, result) => {
      if (err) {
        return res.json({
          msg: err
        })
      }

      console.log(result);
    
      res.json({
        msg: 'success',
        data: result
      })
    });
  } catch (error) {
    res.json({
      msg: error
    })
  }
})

router.post('/save', (req, res) => {
  try {
    let locationname = req.body.locationname;
    let createdby = 'CREATOR';
    let createddate = helper.GetCurrentDatetime();
    let data = [];

    console.log(`${locationname}, ${createdby} ${createddate}`);

    data.push([
      locationname,
      createdby,
      createddate
    ])

    console.log(data);
    mysql.InsertTable('master_location', data, (err, result) => {
      if (err) console.error(err);

      res.json({
        msg: 'success'
      })
    });

  } catch (error) {
    res.json({
      msg: error
    })
  }

})