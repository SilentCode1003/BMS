var express = require('express');
var router = express.Router();

const helper = require('./repository/customhelper');
const mysql = require('./repository/budgetdb');
const dictionary = require('./repository/dictionary');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user', { title: 'Express' });
});

module.exports = router;

router.get('/load',(req,res)=>{
  try {
    
    let data=[];

    data.push({
      
    })

    res.json({
      msg:'success', 
      data:data
    })
  } catch (error) {
    res.json({
      msg:error
    })
  }
})