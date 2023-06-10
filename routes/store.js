var express = require('express');
var router = express.Router();
require('dotenv').config();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('store', { title: process.env._TITLE });
});

module.exports = router;
router.get('/load', (req, res) => {
  try {
    let sql = 'select * from master_store';

    mysql.Select(sql, 'MasterStore', (err, result) => {
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
    let storecode = req.body.storecode;
    let storename = req.body.storename;
    let address = req.body.address;
    let email = req.body.email;
    let contact = req.body.contact;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = 'CREATOR';
    let createddate = helper.GetCurrentDatetime();
    let data = [];

    console.log(`${storecode}, ${storename},  ${address}, ${email}, ${contact}, ${status}, ${createdby} ${createddate}`);

    data.push([
      storecode,
      storename,
      address,
      email,
      contact,
      status,
      createdby,
      createddate
    ])

    console.log(data);
    mysql.InsertTable('master_store', data, (err, result) => {
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