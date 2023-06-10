var express = require('express');
var router = express.Router();
require('dotenv').config();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('employee', { title: process.env._TITLE });
});

module.exports = router;
router.get('/load', (req, res) => {
  try {
    let sql = 'select * from master_employee';

    mysql.Select(sql, 'MasterEmployee', (err, result) => {
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
    let employeecode = req.body.employeecode;
    let employeeid = req.body.employeeid;
    let fullname = req.body.fullname;
    let location= req.body.location;
    let department = req.body.department;
    let position= req.body.position;
    let role = req.body.role;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = 'CREATOR';
    let createdate = helper.GetCurrentDatetime();
    let data = [];

    console.log(`${employeecode}, ${employeeid}, ${fullname}, ${location}, ${department}, ${position}, ${role}, ${status}, ${createdby} ${createdate}`);

    data.push([
      employeecode,
      employeeid,
      fullname,
      location,
      department,
      position,
      role,
      status,
      createdby,
      createdate
    ])

    console.log(data);
    mysql.InsertTable('master_employee', data, (err, result) => {
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