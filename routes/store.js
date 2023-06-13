var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("store", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_store";

    mysql.Select(sql, "MasterStore", (err, result) => {
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
    let storecode = req.body.storecode;
    let storename = req.body.storename;
    let address = req.body.address;
    let email = req.body.email;
    let contact = req.body.contact;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    let data = [];

    data.push([
      storecode,
      storename,
      address,
      email,
      contact,
      status,
      createdby,
      createddate,
    ]);

    console.log(data);
    mysql.InsertTable("master_store", data, (err, result) => {
      if (err) console.error(err);

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

router.post("/excelsave", (req, res) => {
  try {
    let data = req.body.data;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    data = JSON.parse(data);
    let counter = 0;
    let dup_data = "";
    master_store = [];

    data.forEach((key, item) => {
      // if (key.contact == null) console.log(`${key.storeno}`);

      let sql_check = `select * from master_store where ms_storecode='${key.storecode}' and ms_storename='${key.storename}'`;
      let isDuplicate = false;

      mysql
        .isDataExist(sql_check, "MasterStore")
        .then((result) => {
          if (result) {
            isDuplicate = true;
            dup_data += `${key.storecode} ${key.storename}'`;
          } else {
            master_store.push([
              key.storecode,
              key.storename,
              key.address,
              key.email,
              key.contact,
              status,
              createdby,
              createddate,
            ]);
          }

          counter += 1;

          if (data.length == counter) {
            if (master_store.length != 0) {
              console.log("Insert Data");
              mysql.InsertTable("master_store", master_store, (err, result) => {
                if (err) {
                  console.log(err);
                  return res.json({
                    msg: "error",
                    error: err,
                  });
                } else {
                  if (isDuplicate) {
                    return res.json({
                      msg: "duplicate",
                      data: dup_data,
                    });
                  }

                  res.json({
                    msg: "success",
                  });
                }
              });
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
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
