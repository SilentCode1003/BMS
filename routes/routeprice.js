var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("routeprice", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_route_price";

    mysql.Select(sql, "MasterRoutePrice", (err, result) => {
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
    let routecode = req.body.routecode;
    let routedescription = req.body.routedescription;
    let currentprice = req.body.currentprice;
    let transportation = req.body.transportation;
    let previousprice = "";
    let updateby = "CREATOR";
    let updatedate = helper.GetCurrentDatetime();
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    let status = dictionary.GetValue(dictionary.ACT());
    let data = [];
    let sql_check = `select * from master_route_price where mrp_routecode='${routecode}' and mrp_transportation='${transportation}'`;

    mysql.Select(sql_check, "MasterRoutePrice", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        //if exist
        previousprice = result[0].currentprice;
        let sql_update = `update master_route_price 
          set mrp_currentprice='${currentprice}', 
          mrp_previousprice='${previousprice}',
          mrp_updateby='${updateby}',
          mrp_updatedate='${updatedate}'
          where mrp_routecode='${routecode}' 
          and mrp_transportation='${transportation}'`;

        mysql.Update(sql_update, (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          return res.json({
            msg: "update",
          });
        });
      } else {
        data.push([
          routecode,
          routedescription,
          currentprice,
          transportation,
          "",
          "",
          "",
          createdby,
          createddate,
          status,
        ]);

        console.log(data);
        mysql.InsertTable("master_route_price", data, (err, result) => {
          if (err) console.error(err);

          return res.json({
            msg: "success",
          });
        });
      }
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getrouteprice", (req, res) => {
  try {
    let origin = req.body.origin;
    let destination = req.body.destination;
    let transportation = req.body.transportation;
    let sql = `select 
    mr_origin as origin, 
    mr_destination as destination,
    mrp_transportation as transportation,
    mrp_currentprice  as currentprice
    from master_route
    inner join master_route_price on mr_routecode = mrp_routecode
    where mr_origin = '${origin}'
    and mr_destination = '${destination}'
    and mrp_transportation = '${transportation}'
    order by mr_routecode`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);

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
