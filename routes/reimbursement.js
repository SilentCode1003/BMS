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
    let reimburseby = req.body.reimburseby;
    let requestid = req.body.requestid;
    let details = req.body.details;
    let totalreimburse = req.body.totalreimburse;
    let status = dictionary.GetValue(dictionary.RBRD());
    let reimbursementdate = helper.GetCurrentDate();
    let reimbursement_details = [];
    let budget_request_detail = [status, requestid];
    let sql_update_budget_request_detail =
      "update budget_request_details set brd_status=? where brd_requestid=?";

    reimbursement_details.push([
      reimburseby,
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

router.post("/approve", (req, res) => {
  try {
    let reimburseid = req.body.reimburseid;
    let totalreimburse = parseFloat(req.body.totalreimburse);
    let reimburseby = req.body.reimburseby;
    let requestid = req.body.requestid;
    let reimbursementdate = helper.GetCurrentDate();
    let createdby = reimburseby;
    let createddate = helper.GetCurrentDatetime();
    let status_history = dictionary.GetValue(dictionary.RBRD());
    let status_budget = dictionary.GetValue(dictionary.DND());
    let status_reimburse = dictionary.GetValue(dictionary.APD());
    let balance = 0;
    let newBalance = 0;

    console.log(`${reimburseid}`);

    let sql_get_employee_budget = `select eb_balance as balance from employee_budget where eb_employeeid='${reimburseby}'`;

    mysql.SelectResult(sql_get_employee_budget, (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result);

      balance = parseFloat(result[0].balance == "0" ? 0 : result[0].balance);
      newBalance = balance - totalreimburse;

      let employee_budget = [newBalance, reimburseby];
      let update_employee_budget =
        "update employee_budget set eb_balance=? where eb_employeeid=?";

      mysql.UpdateMultiple(
        update_employee_budget,
        employee_budget,
        (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
        }
      );

      let employee_budget_history = [
        [
          reimbursementdate,
          reimburseby,
          totalreimburse,
          status_history,
          createdby,
          createddate,
        ],
      ];

      mysql.InsertTable(
        "employee_budget_history",
        employee_budget_history,
        (err, result) => {
          if (err) console.error("Error: ", err);
          console.log(result);
        }
      );

      let budget_request_details = [status_budget, requestid];
      let sql_update_budget_request_details =
        "update budget_request_details set brd_status=? where brd_requestid=?";

      mysql.UpdateMultiple(
        sql_update_budget_request_details,
        budget_request_details,
        (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);
        }
      );

      let reimbursement_details = [status_reimburse, reimburseid];
      let sql_update_reimbursement_details =
        "update reimbursement_details set rd_status=? where rd_reimburseid=?";

      mysql.UpdateMultiple(
        sql_update_reimbursement_details,
        reimbursement_details,
        (err, result) => {
          if (err) console.error("Error: ", err);

          console.log(result);

          res.json({
            msg: "success",
          });
        }
      );
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});
