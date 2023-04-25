var express = require('express');
var router = express.Router();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('routeprice', { title: 'Express' });
});

module.exports = router;
router.get('/load', (req, res) => {
  try {
    let sql = 'select * from master_route_price';

    mysql.Select(sql, 'MasterRoutePrice', (err, result) => {
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
    let routerpricecode = req.body.routerpricecode;
    let currentprice = req.body.currentprice;
    let previousprice = req.body.previousprice;
    let updateby = req.body.updateby;
    let updatedate = helper.GetCurrentDatetime();
    let createdby = 'CREATOR';
    let createddate = helper.GetCurrentDatetime();
    let data = [];

    console.log(`${routerpricecode}, ${currentprice}, ${previousprice}, ${updateby}, ${updatedate}, ${createdby}, ${createdate}`);

    data.push([
      routerpricecode,
      currentprice,
      previousprice,
      updateby,
      updatedate,
      createdby,
      createddate
    ])

    console.log(data);
    mysql.InsertTable('master_route_price', data, (err, result) => {
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