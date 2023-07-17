var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("reimbursement", { title: process.env._TITLE });
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.DND());
    let sql = `select * from reimbursement_details where not rd_status='${status}'`;

    mysql.Select(sql, "ReimbursementDetails", (err, result) => {
      if (err) console.error("Error: ", err);

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
    let reimbursementby = req.body.reimburseby;
    let requestid = req.body.requestid;
    let details = req.body.details;
    let totalreimburse = req.body.totalreimburse;
    let status = dictionary.GetValue(dictionary.RBRD());
    let reimbursementdate = helper.GetCurrentDate();
    let reimbursement_details = [];
    let budget_request_detail = [reimbursementby, status];
    let sql_update_budget_request_detail =
      "update budget_request_detail set brd_status=? where brd_reimburseby=?";

    reimbursement_details.push([
      reimbursementby,
      reimbursementdate,
      requestid,
      details,
      totalreimburse,
      status,
    ]);

    mysql.InsertTable(
      "reimbursement_details",
      reimbursement_details,
      (err, result) => {
        if (err) console.error("Error: ", err);
        console.log(result);

        mysql.UpdateMultiple(
          sql_update_budget_request_detail,
          budget_request_detail,
          (err, result) => {
            if (err) console.error("Error: ", err);
            console.log(result);
            res.json({
              msg: "success",
            });
          }
        );
      }
    );
  } catch (error) {
    res.json({ msg: error });
  }
});

router.post("/gettotalreimburse", (req, res) => {
  try {
    let requestby = req.body.requestby;
    let status = dictionary.GetValue(dictionary.APD());
    let datefrom = helper.GetCurrentMonthFirstDay();
    let dateto = helper.GetCurrentMonthLastDay();
    let sql = `select sum(rd_totalreimburse) as total
        from reimbursement_details 
        where rd_status='${status}' 
        and rd_reimburseby='${requestby}' 
        and rd_reimbursedate between '${datefrom}' and '${dateto}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);
      let total = result[0].total == null ? 0 : result[0].total;
      let data = [];

      data.push({
        total: total,
      });

      console.log(total);

      res.json({
        msg: "success",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getreimburse", (req, res) => {
  try {
    let requestby = req.body.requestby;
    let status = dictionary.GetValue(dictionary.DND());
    let sql = `select * from reimbursement_details where not rd_status='${status}' and rd_reimburseby='${requestby}'`;

    console.log(requestby);

    mysql.Select(sql, "ReimbursementDetails", (err, result) => {
      if (err) console.error("Error: ", err);
      let data = [];

      console.log(`${requestby} ${status}`);

      result.forEach((key, item) => {
        let details = "";
        var detail = key.details;
        detail = JSON.parse(detail);

        // detail.forEach((key, item) => {
        //   details += `${key.ticketid} ${key.concern} ${key.issue} [${key.storename}], `;
        // });

        // data.push({
        //   requestid: key.requestid,
        //   requestby: key.requestby,
        //   requestdate: key.requestdate,
        //   budget: key.budget,
        //   details: details,
        //   status: key.status,
        // });
      });

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
