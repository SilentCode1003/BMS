var express = require("express");
var router = express.Router();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("department", { title: "Express" });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_department";

    mysql.Select(sql, "MasterDepartment", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      console.log(result);

      res.json({
        msg: "success",
        data: result,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/save", (req, res) => {
  try {
    let departmentname = req.body.departmentname;
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let data = [];

    data.push([departmentname, createdby, createddate, status]);

    console.log(data);
    mysql.InsertTable("master_department", data, (err, result) => {
      if (err) console.error(err);

      console.log(result);

      res.json({
        msg: "success",
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
