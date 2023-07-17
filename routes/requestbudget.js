var express = require("express");
var router = express.Router();
require("dotenv").config();

const helper = require("./repository/customhelper");
const mysql = require("./repository/budgetdb");
const dictionary = require("./repository/dictionary");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("requestbudget", { title: process.env._TITLE });
});

module.exports = router;

router.get("/load", (req, res) => {
  try {
    let status = dictionary.GetValue(dictionary.DND());
    let sql = `select * from budget_request_details where not brd_status='${status}' order by brd_requestid desc`;

    mysql.Select(sql, "BudgetRequestDetails", (err, result) => {
      if (err) console.error("Error: ", err);
      let data = [];

      result.forEach((key, item) => {
        let details = "";
        var detail = key.details;
        detail = JSON.parse(detail);

        detail.forEach((key, item) => {
          details += `${key.ticketid} ${key.concern} ${key.issue} [${key.storename}] <br/>`;
        });

        data.push({
          requestid: key.requestid,
          requestby: key.requestby,
          requestdate: key.requestdate,
          budget: key.budget,
          details: details,
          status: key.status,
        });
      });

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

router.post("/save", (req, res) => {
  try {
    let requestby = req.body.requestby;
    let requestdate = helper.GetCurrentDate();
    let transactiondate = helper.GetCurrentDatetime();
    let budget = req.body.budget;
    let details = req.body.details;
    let status = dictionary.GetValue(dictionary.REQB());
    let approve = dictionary.GetValue(dictionary.APD());
    let status_done = dictionary.GetValue(dictionary.DND());
    let status_cancelled = dictionary.GetValue(dictionary.CNL());
    let request_budget = [];
    let employee_budget_history = [];
    let sql_check = `select * from budget_request_details where brd_requestby='${requestby}' and not brd_status IN ('${status_done}','${status_cancelled}')`;

    console.log(details);

    mysql
      .isDataExist(sql_check, "BudgetRequestDetails")
      .then((result) => {
        console.log(result);
        if (result) {
          return res.json({
            msg: "notreimburse",
          });
        } else {
          request_budget.push([
            requestby,
            requestdate,
            budget,
            details,
            status,
          ]);
          employee_budget_history.push([
            requestdate,
            requestby,
            budget,
            status,
            requestby,
            transactiondate,
          ]);

          // console.log(request_budget);
          // console.log(employee_budget_history);
          mysql.InsertTable(
            "budget_request_details",
            request_budget,
            (err, result) => {
              if (err) console.error("Error: ", err);
              console.log(result);

              mysql.InsertTable(
                "employee_budget_history",
                employee_budget_history,
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
        }
      })
      .catch((error) => {
        res.json({
          msg: error,
        });
      });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/getrequest", (req, res) => {
  try {
    let requestby = req.body.requestby;
    let status_done = dictionary.GetValue(dictionary.DND());
    let status_cancelled = dictionary.GetValue(dictionary.CNL());
    let sql = `select * from budget_request_details where not brd_status in ('${status_done}','${status_cancelled}') and brd_requestby='${requestby}'`;

    console.log(requestby);

    mysql.Select(sql, "BudgetRequestDetails", (err, result) => {
      if (err) console.error("Error: ", err);
      let data = [];

      console.log(`${requestby} ${status_done}`);

      result.forEach((key, item) => {
        let details = "";
        var detail = key.details;
        detail = JSON.parse(detail);

        detail.forEach((key, item) => {
          details += `${key.ticketid} ${key.concern} ${key.issue} [${key.storename}], `;
        });

        data.push({
          requestid: key.requestid,
          requestby: key.requestby,
          requestdate: key.requestdate,
          budget: key.budget,
          details: details,
          status: key.status,
        });
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
    let requestid = req.body.requestid;
    let requestby = req.body.requestby;
    let budget = req.body.budget;
    let approve = dictionary.GetValue(dictionary.APD());

    let sql_budget_request_detail = `update budget_request_details 
                  set brd_status=? 
                  where brd_requestid=?`;
    let update_budget_request_detail = [approve, requestid];

    let sql_employee_budget = `update employee_budget set eb_balance=? where eb_employeeid=?`;
    let sql_check_employee_budget = `select eb_balance as balance from employee_budget where eb_employeeid='${requestby}'`;

    mysql.SelectResult(sql_check_employee_budget, (err, result) => {
      if (err) console.error("Error: ", err);
      console.log(result[0].balance);

      let current_balance = parseFloat(result[0].balance);
      let total_balance = parseFloat(budget) + current_balance;
      let update_employee_budget = [`${total_balance}`, requestby];

      mysql.UpdateMultiple(
        //employee_budget
        sql_employee_budget,
        update_employee_budget,
        (err, result) => {
          if (err) console.error("Error: ", err);
          console.log(result);

          mysql.UpdateMultiple(
            //budget_request_detail
            sql_budget_request_detail,
            update_budget_request_detail,
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
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/gettotalrequest", (req, res) => {
  try {
    let requestby = req.body.requestby;
    let status = dictionary.GetValue(dictionary.APD());
    let datefrom = helper.GetCurrentMonthFirstDay();
    let dateto = helper.GetCurrentMonthLastDay();
    let sql = `select sum(brd_budget) as total
         from budget_request_details 
         where brd_status='${status}' 
         and brd_requestby='${requestby}' 
         and brd_requestdate between '${datefrom}' and '${dateto}'`;

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

router.post("/getrequestdetail", (req, res) => {
  try {
    let requestid = req.body.requestid;
    let sql = `select brd_details as details from budget_request_details where brd_requestid='${requestid}'`;

    mysql.SelectResult(sql, (err, result) => {
      if (err) console.error("Error: ", err);
      var detailJson = JSON.parse(result[0].details);
      var storename = [];

      detailJson.forEach((key, item) => {
        storename.push({
          storename: key.storename,
        });
      });

      res.json({
        msg: "success",
        data: storename,
      });
    });
  } catch (error) {
    res.json({
      msg: error,
    });
  }
});

router.post("/cancel", (req, res) => {
  try {
    let requestid = req.body.requestid;
    let status = dictionary.GetValue(dictionary.CNL());
    let budget_request_details = [status, requestid];
    let sql_update = `update budget_request_details 
    set brd_status=? 
    where brd_requestid=?`;

    mysql.UpdateMultiple(sql_update, budget_request_details, (err, result) => {
      if (err) console.error("Error: ", err);

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
