var express = require('express');
var router = express.Router();
var list1 = [];
var list2 = [];
var list3 = [];
var list4 = [];

var n = 1;
var x = 0;
function AddRow(){

var AddRow = document.getElementById('user-table2');
var NewRow = AddRow.insertRow(n);

list1[x] = document.getElementById("fname").value; 
list2[x] = document.getElementById("lname").value; 
list3[x] = document.getElementById("position").value; 
list4[x] = document.getElementById("department").value; 

var cell1 = NewRow.inserCell(0);
var cell2 = NewRow.inserCell(1);
var cell3 = NewRow.inserCell(2);
var cell4 = NewRow.inserCell(3);

cell1.innerHTML = list1[x];
cell2.innerHTML = list2[x];
cell3.innerHTML = list3[x];
cell4.innerHTML = list4[x];


n++;
x++;


}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('transportation', { title: 'Express' });
});

module.exports = router;




router.get('/load',(req,res)=>{
  try {
    
    let data=[];

    data.push({
      firstname

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