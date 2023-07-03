var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");
const crypt = require("./repository/cryptography");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("login", { title: process.env._TITLE });
});

module.exports = router;

router.post("/employeelogin", (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    crypt.Encrypter(password, (err, encrypted) => {
      if (err) console.error("Error: ", err);

      let sql = `select * from master_employee where me_username='${username}' and  me_password='${encrypted}'`;

      mysql.Select(sql, "MasterEmployee", (err, result) => {
        if (err) console.error("Error: ", err);
        console.log(result);

        if (result.length != 0) {
          res.json({
            msg: "success",
            data: result,
          });
        } else {
          res.json({
            msg: "incorrect",
          });
        }
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
