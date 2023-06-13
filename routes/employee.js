var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");
const crypto = require("./repository/cryptography");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("employee", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_employee";

    mysql.Select(sql, "MasterEmployee", (err, result) => {
      if (err) {
        return res.json({
          msg: err,
        });
      }

      // console.log(result);

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
    let employeeid = req.body.employeeid;
    let fullname = req.body.fullname;
    let username = req.body.username;
    var password = req.body.password;
    let location = req.body.location;
    let department = req.body.department;
    let position = req.body.position;
    let role = req.body.role;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    let dup_data = "";
    let master_employee = [];
    let employe_budget = [];

    crypto.Encrypter(password, (err, result) => {
      if (err) console.error("Error: ", err);
      password = result;
      let sql_check = `select * from master_employee where me_employeeid='${employeeid}'`;

      mysql
        .isDataExist(sql_check, "MasterEmployee")
        .then((result) => {
          if (result) {
            dup_data += `${employeeid} '`;

            return res.json({
              msg: "duplicate",
              data: dup_data,
            });
          } else {
            master_employee.push([
              employeeid,
              fullname,
              username,
              password,
              location,
              department,
              position,
              role,
              status,
              createdby,
              createddate,
            ]);

            employe_budget.push([
              employeeid,
              0,
              status,
              createdby,
              createddate,
            ]);
          }

          mysql.InsertTable(
            "master_employee",
            master_employee,
            (err, result) => {
              if (err) console.error(err);

              mysql.InsertTable(
                "employee_budget",
                employe_budget,
                (err, result) => {
                  if (err) console.error(err);
                  res.json({
                    msg: "success",
                  });
                }
              );
            }
          );
        })
        .catch((error) => {
          res.json({
            msg: error,
          });
        });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/excelsave", (req, res) => {
  try {
    let data = req.body.data;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    data = JSON.parse(data);
    let counter = 0;
    let dup_data = "";
    let master_employee = [];
    let employe_budget = [];

    data.forEach((key, item) => {
      let username = key.employeeid;
      let password = "";

      // if (key.contact == null) console.log(`${key.storeno}`);

      crypto.Encrypter(username, (err, result) => {
        if (err) return res.json({ msg: err });
        password = result;
        let sql_check = `select * from master_employee where me_employeeid='${key.employeeid}'`;
        let isDuplicate = false;

        mysql
          .isDataExist(sql_check, "MasterEmployee")
          .then((result) => {
            if (result) {
              isDuplicate = true;
              dup_data += `${key.employeeid} '`;
            } else {
              master_employee.push([
                key.employeeid,
                key.fullname,
                username,
                password,
                key.location,
                key.department,
                key.position,
                key.role,
                status,
                createdby,
                createddate,
              ]);

              employe_budget.push([
                key.employeeid,
                0,
                status,
                createdby,
                createddate,
              ]);
            }

            counter += 1;

            if (data.length == counter) {
              if (master_employee.length != 0) {
                console.log("Insert Data");

                mysql.InsertTable(
                  "master_employee",
                  master_employee,
                  (err, result) => {
                    if (err) {
                      console.error(err);
                    } else {
                      mysql.InsertTable(
                        "employee_budget",
                        employe_budget,
                        (err, result) => {
                          if (err) console.error(err);

                          if (isDuplicate) {
                            return res.json({
                              msg: "duplicate",
                              data: dup_data,
                            });
                          } else {
                            return res.json({
                              msg: "success",
                            });
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                return res.json({
                  msg: "duplicate",
                  data: dup_data,
                });
              }
            }
          })
          .catch((error) => {
            return res.json({ msg: error });
          });
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
