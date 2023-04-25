var express = require('express');
var router = express.Router();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('role', { title: 'Express' });
});

module.exports = router;
router.get('/load', (req, res) => {
  try {
    let sql = 'select * from master_role_type';

    mysql.Select(sql, 'MasterRoleType', (err, result) => {
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
    let rolename = req.body.rolename;
    let createdby = 'CREATOR';
    let createdate = helper.GetCurrentDatetime();
    let data = [];

    console.log(`${rolename}, ${createdby} ${createdate}`);

    data.push([
      rolename,
      createdby,
      createdate
    ])

    console.log(data);
    mysql.InsertTable('master_role_type', data, (err, result) => {
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