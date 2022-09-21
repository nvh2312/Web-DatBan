var modelUsers = require("../models/users");
var fs = require("fs");
var jwt = require("jsonwebtoken");
let database = require("../models/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function addUs(req, res) {
  const checkPhone = await modelUsers.fetchSingleUser(req.body.phone);
  if (checkPhone) {
    res.json({
      message: "Phone đã tồn tại ",
    });
  } else {
    let encryptedPassword = "";
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      encryptedPassword = hash;
      const us = {
        phone: req.body.phone,
        password: encryptedPassword,
        email: req.body.email,
        name: req.body.name,
        balance: req.body.balance,
        role: req.body.role,
      };

      try {
        const newUser = modelUsers.addUser(us);
        res.json({
          message: "Tạo tài khoản thành công",
        });
      } catch (error) {
        throw error;
      }
    });
  }
}

exports.getAllUser = async (req, res, next) => {
  let data = await modelUsers.fetchAllUser();
  return res.render("manage-user", {
    data,
  });
};
exports.addUser = async (req, res, next) => {
  addUs(req, res);
};
exports.checkPhone = async (req, res, next) => {
  let check = false;
  let phone = req.body.phone;
  let data = await modelUsers.fetchSingleUser(phone);
  if (data) check = true;
  res.json(check);
};
exports.fetchSingleUser = async (req, res, next) => {
  let phone = req.body.phone;
  let data = await modelUsers.fetchSingleUser(phone);
  res.json({
    data: data,
  });
};
exports.checkLogin = async (req, res, next) => {
  let phone = req.body.phone;
  let data = await modelUsers.fetchSingleUser(phone);
  if (!data) {
    res.json({ message: "Số điện thoại này chưa được đăng ký" });
  } else {
    const pass = req.body.password;
    bcrypt.compare(pass, data.password, function (err, result) {
      if (result) {
        let privateKey = fs.readFileSync("./key/private.pem");
        const token = jwt.sign({ id: data.id, phone ,role: data.role}, privateKey, {
          algorithm: "RS256",
        });
        res.json({ message: "Đăng nhập thành công", token: token ,role: data.role});
      } else res.json({ message: "Mật khẩu không chính xác" });
    });
  }
};
exports.getUser = function (request, response, next) {
  let draw = request.query.draw;

  let start = request.query.start;

  let length = request.query.length;

  let order_data = request.query.order;
  let column_name = "";
  let column_sort_order = "";

  if (typeof order_data == "undefined") {
    column_name = "user.id";

    column_sort_order = "desc";
  } else {
    column_index = request.query.order[0]["column"];

    column_name = request.query.columns[column_index]["data"];

    column_sort_order = request.query.order[0]["dir"];
  }

  //search data

  let search_value = request.query.search["value"];
  let search_query = `AND (user.name LIKE '%${search_value}%' 
  OR user.phone LIKE '%${search_value}%' 
  OR user.email LIKE '%${search_value}%' 
  OR user.id LIKE '%${search_value}%'
  OR user.balance LIKE '%${search_value}%'
  )`;

  //Total number of records without filtering

  database.query("SELECT COUNT(*) AS Total FROM user", function (error, data) {
    let total_records = data[0].Total;
    console.log(data);
    //Total number of records with filtering

    database.query(
      `SELECT COUNT(*) AS Total
         FROM user WHERE 1 ${search_query}`,
      function (error, data) {
        let total_records_with_filter = data[0].Total;
        let query = `
          SELECT user.id,user.name,user.phone,user.email,user.balance
          FROM user
            WHERE 1 ${search_query} 
            ORDER BY ${column_name} ${column_sort_order} 
            LIMIT ${start}, ${length}
            `;
        database.query(query, function (error, data) {
          let output = {
            draw: draw,
            iTotalRecords: total_records,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data,
          };
          response.json(output);
        });
      }
    );
  });
};
exports.actionUser = async (req, res, next) => {
  let action = req.body.action;
  if (action == "Add") {
    addUs(req, res);
  }
  if (action == "fetch_single") {
    const id = req.body.id;

    let data = await modelUsers.fetchUserById(id);
    res.json(data);
  }

  if (action == "Edit") {
    const phone = req.body.phone;
    let data = await modelUsers.fetchSingleUser(phone);
    console.log(data.phone);
    if (req.body.password == data.password) {
      const us = {
        name: req.body.name,
        email: req.body.email,
        balance: req.body.balance,
        role: req.body.role,
      };
      modelUsers.updateUser(us, phone);
      res.json({ message: "Cập nhật thành công" });
    } else {
      let encryptedPassword = "";
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        encryptedPassword = hash;
        const us = {
          name: req.body.name,
          password: encryptedPassword,
          email: req.body.email,
          balance: req.body.balance,
          role: req.body.role,
        };
        modelUsers.updateUser(us, phone);
        res.json({ message: "Cập nhật thành công" });
      });
    }
  }

  if (action == "delete") {
    const id = req.body.id;
    modelUsers.deleteUser(id);
    res.json({ message: "Xóa tài khoản thành công" });
  }
};
