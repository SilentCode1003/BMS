const mysql = require("mysql");
const model = require("../model/budgetmodel");
require("dotenv").config();
const crypt = require("./cryptography");

let password = "";
crypt.Decrypter(process.env._PASSWORD, (err, result) => {
  if (err) throw err;

  password = result;
  console.log(`${result} `);
});

const connection = mysql.createConnection({
  host: process.env._HOST,
  user: process.env._USER,
  password: password,
  database: process.env._DATABASE,
});

exports.CheckConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Error connection to MYSQL databases: ", err);
      return;
    }
    console.log("MySQL database connection established successfully!");
  });
};

exports.InsertMultiple = async (stmt, data, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, data, (err, results, fields) => {
      if (err) {
        callback(err.message, null);
      }
      callback(null, `Row inserted: ${results.affectedRows}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.Select = (sql, table, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      if (table == "MasterUser") {
        callback(null, model.MasterUser(results));
      }

      if (table == "MasterEmployee") {
        callback(null, model.MasterEmployee(results));
      }

      if (table == "BudgetRequestDetails") {
        callback(null, model.BudgetRequestDetails(results));
      }

      if (table == "MasterRoute") {
        callback(null, model.MasterRoute(results));
      }

      if (table == "BudgetRequestItems") {
        callback(null, model.BudgetRequestItems(results));
      }

      if (table == "MasterRoleType") {
        callback(null, model.MasterRoleType(results));
      }

      if (table == "MasterRoutePrice") {
        callback(null, model.MasterRoutePrice(results));
      }

      if (table == "MasterTransportation") {
        callback(null, model.MasterTransportation(results));
      }

      if (table == "ReimbursementDetails") {
        callback(null, model.ReimbursementDetails(results));
      }

      if (table == "MasterAccessType") {
        callback(null, model.MasterAccessType(results));
      }

      if (table == "MasterDepartment") {
        callback(null, model.MasterDepartment(results));
      }

      if (table == "MasterPosition") {
        callback(null, model.MasterPosition(results));
      }

      if (table == "ReimbursementItem") {
        callback(null, model.ReimbursementItem(results));
      }

      if (table == "MasterLocation") {
        callback(null, model.MasterLocation(results));
      }

      if (table == "MasterStore") {
        callback(null, model.MasterStore(results));
      }

      if (table == "EmployeeBudget") {
        callback(null, model.EmployeeBudget(results));
      }

      if (table == "EmployeeBudgetHistory") {
        callback(null, model.EmployeeBudgetHistory(results));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.StoredProcedure = (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.StoredProcedureResult = (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error.message, null);
      }
      callback(null, results[0]);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.Update = async (sql, callback) => {
  try {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log('Rows affected:', results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.UpdateMultiple = async (sql, data, callback) => {
  try {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        callback(error, null);
      }
      // console.log('Rows affected:', results.affectedRows);

      callback(null, `Rows affected: ${results.affectedRows}`);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.CloseConnect = () => {
  connection.end();
};

exports.Insert = (stmt, todos, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    // console.log(statement: ${stmt} data: ${todos});

    connection.query(stmt, [todos], (err, results, fields) => {
      if (err) {
        callback(err, null);
      }
      // callback(null, Row inserted: ${results});
      callback(null, `Row inserted: ${results.affectedRows}`);
      // console.log(Row inserted: ${results.affectedRows});
    });
  } catch (error) {
    callback(error, null);
  }
};

exports.SelectResult = (sql, callback) => {
  try {
    connection.connect((err) => {
      return err;
    });
    connection.query(sql, (error, results, fields) => {
      // console.log(results);

      if (error) {
        callback(error, null);
      }

      callback(null, results);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.InsertTable = (tablename, data, callback) => {
  if (tablename == "master_employee") {
    let sql = `INSERT INTO master_employee(
                    me_employeeid,
                    me_fullname,
                    me_username,
                    me_password,
                    me_location,
                    me_department,
                    me_position,
                    me_role,
                    me_status,
                    me_createdby,
                    me_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "budget_request_details") {
    let sql = `INSERT INTO budget_request_details(
            brd_requestby,
            brd_requestdate,
            brd_budget,
            brd_details,
            brd_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_user") {
    let sql = `INSERT INTO master_user(
            mu_fullname,
            mu_username,
            mu_password,
            mu_role,
            mu_accesstype,
            mu_status,
            mu_createdby,
            mu_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_route") {
    let sql = `INSERT INTO master_route(
        mr_location,
        mr_origin,
        mr_destination,
        mr_status,
        mr_createdby,
        mr_createddate) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "budget_request_items") {
    let sql = `INSERT INTO budget_request_items(
            bri_requestid,
            bri_requestby,
            bri_requestdate,
            bri_ticket,
            bri_store,
            bri_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_role_type") {
    let sql = `INSERT INTO master_role_type(
        mrt_rolename,
        mrt_createdby,
        mrt_createddate,
        mrt_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_route_price") {
    let sql = `INSERT INTO master_route_price(
        mrp_routecode,
        mrp_routedescription,
        mrp_currentprice,
        mrp_transportation,
        mrp_previousprice,
        mrp_updateby,
        mrp_updatedate,
        mrp_createdby,
        mrp_createddate,
        mrp_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_transportation") {
    let sql = `INSERT INTO master_transportation(
        mt_transportationname,
        mt_createdby,
        mt_createddate,
        mt_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "reimbursement_details") {
    let sql = `INSERT INTO reimbursement_details    (
        rd_reimburseby,
        rd_reimbursedate,
        rd_requestid,
        rd_details,
        rd_totalreimburse,
        rd_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_access_type") {
    let sql = `INSERT INTO master_access_type    (
        mat_accessname,
        mat_createdby,
        mat_createddate,
        mat_status) VALUES ?`;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_position") {
    let sql = `INSERT INTO master_position(
        mp_positionname,
        mp_createdby,
        mp_createddate,
        mp_status) VALUES ?`;
    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_department") {
    let sql = `INSERT INTO master_department(
              md_departmentname,
              md_createdby,
              md_createddate,
              md_status) VALUES ? `;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "reimbursement_items") {
    let sql = `INSERT INTO reimbursement_items(
                  ri_transactionid,
                  ri_requestid,
                  ri_reimbursementid,
                  ri_reiburseby,
                  ri_reimbursedate,
                  ri_ticket,
                  ri_store,
                  ri_origin,
                  ri_destination,
                  ri_fare,
                  ri_status) VALUES ? `;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_location") {
    let sql = `INSERT INTO master_location(
                      ml_locationname,
                      ml_createdby,
                      ml_createddate,
                      ml_status) VALUES ? `;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "master_store") {
    let sql = `INSERT INTO master_store(
                          ms_storecode,
                          ms_storename,
                          ms_address,
                          ms_email,
                          ms_contact,
                          ms_status,
                          ms_createdby,
                          ms_createddate) VALUES ? `;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "employee_budget") {
    let sql = `INSERT INTO employee_budget(
                            eb_employeeid,
                            eb_balance,
                            eb_status,
                            eb_createdby,
                            eb_createddate) VALUES ? `;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }

  if (tablename == "employee_budget_history") {
    let sql = `INSERT INTO employee_budget_history(
                            ebh_date,
                            ebh_employeeid,
                            ebh_amount,
                            ebh_status,
                            ebh_createdby,
                            ebh_createddate) VALUES ? `;

    this.Insert(sql, data, (err, result) => {
      if (err) {
        callback(err, null);
      }
      callback(null, result);
    });
  }
};

exports.isDataExist = (sql, tablename) => {
  return new Promise((resolve, reject) => {
    this.Select(sql, tablename, (err, result) => {
      if (err) reject(err);

      if (result.length != 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

exports.isDataExistCallback = (sql, tablename, callback) => {
  this.Select(sql, tablename, (err, result) => {
    if (err) callback(err, null);

    if (result.length != 0) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

exports.SelectResultPromise = (sql) => {
  return new Promise((resolve, reject) => {
    try {
      connection.connect((err) => {
        reject(err);
      });
      connection.query(sql, (error, results, fields) => {
        // console.log(results);

        if (error) {
          reject(error);
        }

        resolve(results);
      });
    } catch (error) {
      reject(error);
    }
  });
};
