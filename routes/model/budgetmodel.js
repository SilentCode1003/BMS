exports.MasterUser = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      fullname: key.mu_fullname,
      username: key.mu_username,
      password: key.mu_password,
      role: key.mu_role,
      accesstype: key.mu_accesstype,
      status: key.mu_status,
      createdby: key.mu_createdby,
      createddate: key.mu_createddate,
    });
  });

  return dataresult;
};

exports.MasterEmployee = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      employeecode: key.me_employeecode,
      employeeid: key.me_employeeid,
      fullname: key.me_fullname,
      location: key.me_location,
      department: key.me_department,
      position: key.me_position,
      role: key.me_role,
      status: key.me_status,
      createdby: key.me_createdby,
      createdby: key.me_createddate,
    });
  });

  return dataresult;
};

exports.BudgetRequestDetails = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      requestid: key.brd_requestid,
      requestby: key.brd_requestby,
      requestdate: key.brd_requestdate,
      budget: key.brd_budget,
      details: key.brd_details,
      status: key.brd_status,
    });
  });

  return dataresult;
};

exports.MasterRoute = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      routecode: key.mr_routecode,
      origin: key.mr_origin,
      destination: key.mr_destination,
      status: key.mr_status,
      createdby: key.mr_createdby,
      createddate: key.mr_createddate,
    });
  });

  return dataresult;
};

exports.BudgetRequestItems = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      transactionid: key.bri_transactionid,
      requestid: key.bri_requestid,
      requestby: key.bri_requestby,
      requestdate: key.bri_requestdate,
      ticket: key.bri_ticket,
      store: key.bri_store,
      status: key.bri_status,
    });
  });

  return dataresult;
};

exports.MasterRoleType = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      rolecode: key.mrt_rolecode,
      rolename: key.mrt_rolename,
      createdby: key.mrt_createdby,
      createddate: key.mrt_createddate,
      status: key.mrt_status,
    });
  });

  return dataresult;
};

exports.MasterRoutePrice = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      routerpricecode: key.mrp_routerpricecode,
      routecode: key.mrp_routecode,
      routedescription: key.mrp_routedescription,
      currentprice: key.mrp_currentprice,
      transportation: key.mrp_transportation,
      previousprice: key.mrp_previousprice,
      updateby: key.mrp_updateby,
      updatedate: key.mrp_updatedate,
      createdby: key.mrp_createdby,
      createddate: key.mrp_createddate,
      status: key.mrp_status,
    });
  });

  return dataresult;
};

exports.MasterTransportation = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      transportationcode: key.mt_transportationcode,
      transportationname: key.mt_transportationname,
      createdby: key.mt_createdby,
      createddate: key.mt_createddate,
      status: key.mt_status,
    });
  });

  return dataresult;
};

exports.ReimbursementDetails = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      reimbursementid: key.rd_reimburseid,
      reimbursementby: key.rd_reimburseby,
      reimbursementdate: key.rd_reimbursedate,
      requestid: key.rd_requestid,
      details: key.rd_details,
      totalreimburse: key.rd_totalreimburse,
      status: key.rd_status,
    });
  });

  return dataresult;
};

exports.MasterAccessType = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      accesscode: key.mat_accesscode,
      accessname: key.mat_accessname,
      createdby: key.mat_createdby,
      createddate: key.mat_createddate,
      status: key.mat_status,
    });
  });

  return dataresult;
};

exports.MasterDepartment = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      departmentcode: key.md_departmentcode,
      departmentname: key.md_departmentname,
      createdby: key.md_createdby,
      createddate: key.md_createddate,
      status: key.md_status,
    });
  });

  return dataresult;
};

exports.MasterPosition = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      positioncode: key.mp_positioncode,
      positionname: key.mp_positionname,
      createdby: key.mp_createdby,
      createddate: key.mp_createddate,
      status: key.mp_status,
    });
  });

  return dataresult;
};

exports.ReimbursementItem = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      transactionid: key.ri_transactionid,
      requestid: key.ri_requestid,
      reimbursementid: key.ri_reimbursementid,
      reimburseby: key.ri_reiburseby,
      reimbursedate: key.ri_reimbursedate,
      ticket: key.ri_ticket,
      store: key.ri_store,
      origin: key.ri_origin,
      destination: key.ri_destination,
      fare: key.ri_fare,
      status: key.ri_status,
    });
  });

  return dataresult;
};

exports.MasterLocation = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      locationcode: key.ml_locationcode,
      locationname: key.ml_locationname,
      createdby: key.ml_createdby,
      createddate: key.ml_createddate,
      status: key.ml_status,
    });
  });

  return dataresult;
};

exports.MasterStore = (data) => {
  let dataresult = [];

  data.forEach((key, item) => {
    dataresult.push({
      storecode: key.ms_storecode,
      storename: key.ms_storename,
      address: key.ms_address,
      email: key.ms_email,
      contact: key.ms_contact,
      status: key.ms_status,
      createdby: key.ms_createdby,
      createddate: key.ms_createddate,
    });
  });

  return dataresult;
};
