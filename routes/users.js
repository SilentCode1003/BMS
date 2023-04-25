var express = require('express');
var router = express.Router();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('user', { title: 'Express' });
});

module.exports = router;
router.get('/load', (req, res) => {
  try {
    let sql = 'select * from master_user';

    mysql.Select(sql, 'MasterUser', (err, result) => {
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
    let fullname = req.body.fullname;
    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;
    let accesstype = req.body.accesstype;
    let createdby = 'CREATOR';
    let createdate = helper.GetCurrentDatetime();
    let data = [];

    console.log(`${fullname}, ${username}, ${password}, ${role}, ${accesstype}, ${createdby}, ${createdate}`);

    data.push([
      fullname,
      username,
      password,
      role,
      accesstype,
      createdby,
      createdate
    ])

    console.log(data);
    mysql.InsertTable('master_user', data, (err, result) => {
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