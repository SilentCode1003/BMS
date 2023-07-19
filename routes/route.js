var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("route", { title: process.env._TITLE });
});

module.exports = router;
router.get("/load", (req, res) => {
  try {
    let sql = "select * from master_route";

    mysql.Select(sql, "MasterRoute", (err, result) => {
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
    let location = req.body.location;
    let origin = req.body.origin;
    let destination = req.body.destination;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createdate = helper.GetCurrentDatetime();
    let sql_check = `select * from master_route where mr_origin='${origin}' and mr_destination='${destination}'`;
    let data = [];

    mysql.Select(sql_check, "MasterRoute", (err, result) => {
      if (err) console.error("Error: ", err);

      if (result.length != 0) {
        return res.json({
          msg: "duplicate",
        });
      } else {
        data.push([
          location,
          origin,
          destination,
          status,
          createdby,
          createdate,
        ]);

        console.log(data);
        mysql.InsertTable("master_route", data, (err, result) => {
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

router.post("/getorigin", (req, res) => {
  try {
    let location = req.body.location;
    let sql = `select distinct(mr_origin) as origin from master_route where mr_location='${location}'`;

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

router.post("/getdestination", (req, res) => {
  try {
    let origin = req.body.origin;
    let sql = `select mr_destination as destination from master_route where mr_origin='${origin}'`;

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

router.post("/excelsave", (req, res) => {
  try {
    let data = req.body.data;
    let status = dictionary.GetValue(dictionary.ACT());
    let createdby = "CREATOR";
    let createddate = helper.GetCurrentDatetime();
    data = JSON.parse(data);
    let master_route = [];
    let master_route_price = [];
    let router_transporation = [];
    let counter = 0;

    data.forEach((key, item) => {
      let location = key.location;
      let origin = key.origin;
      let destination = key.destination;
      let modeoftransportation = key.modeoftransportation;
      let price = key.price;

      if (origin != undefined) {
        master_route.push([
          location,
          origin,
          destination,
          status,
          createdby,
          createddate,
        ]);

        router_transporation.push([
          origin,
          destination,
          modeoftransportation,
          price,
        ]);
      }
    });

    let master_route_refine = helper.removeDuplicateSets(master_route);
    mysql.InsertTable("master_route", master_route_refine, (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result);
    });

    let master_route_price_refine =
      helper.removeDuplicateSets(router_transporation);
    master_route_price_refine.forEach((item) => {
      let origin = item[0];
      let destination = item[1];
      let transportation = item[2];
      let price = item[3];

      var sql_check = `select mr_routecode as routecode
      from master_route
      where mr_origin='${origin}'
      and mr_destination='${destination}'`;

      mysql.SelectResult(sql_check, (err, result) => {
        if (err) console.error("Error: ", err);

        let routecode = result[0].routecode;
        let routedescription = `${origin} to ${destination}`;

        if (transportation == null) {
          console.log(`${transportation} ${origin} ${destination}`);
        }

        master_route_price.push([
          `${routecode}`,
          routedescription,
          `${price}`,
          transportation,
          "",
          "",
          "",
          createdby,
          createddate,
          status,
        ]);

        counter += 1;

        if (master_route_price_refine.length == counter) {
          mysql.InsertTable(
            "master_route_price",
            master_route_price,
            (err, result) => {
              if (err) console.error("Error: ", err);

              console.log(result);
              res.json({
                msg: "success",
              });
            }
          );
        }
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
