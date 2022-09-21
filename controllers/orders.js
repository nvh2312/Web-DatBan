let database = require("../models/database");
let modelOrders = require("../models/orders");
let modelDetails = require("../models/order_detail");
let fs = require("fs");
let jwt = require("jsonwebtoken");

exports.getOrder = function (request, response, next) {
  let draw = request.query.draw;

  let start = request.query.start;

  let length = request.query.length;

  let order_data = request.query.order;
  let column_name = "";
  let column_sort_order = "";
  let column_index = "";

  if (typeof order_data == "undefined") {
    column_name = "orders.id";

    column_sort_order = "desc";
  } else {
    column_index = request.query.order[0]["column"];

    column_name = request.query.columns[column_index]["data"];

    column_sort_order = request.query.order[0]["dir"];
  }

  //search data

  let search_value = request.query.search["value"];
  let search_query = `AND (orders.id LIKE '%${search_value}%'  
      OR orders.status LIKE '%${search_value}%'
      OR orders.total LIKE '%${search_value}%'
      OR orders.date_init LIKE '%${search_value}%'
      OR orders.user_phone LIKE '%${search_value}%'
      )`;

  //Total number of records without filtering

  database.query(
    "SELECT COUNT(*) AS Total FROM orders",
    function (error, data) {
      let total_records = data[0].Total;
      //Total number of records with filtering

      database.query(
        `SELECT COUNT(*) AS Total
             FROM orders WHERE 1 ${search_query}`,
        function (error, data) {
          let total_records_with_filter = data[0].Total;
          let query = `
              SELECT *
              FROM orders
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
    }
  );
};
exports.actionOrder = async (req, res, next) => {
  let action = req.body.action;
  console.log(req.body);
  if (action == "Add") {
    const arr_order = JSON.parse(req.body.arr_order);
    let totalPrice = 0;
    const order = {
      booking_name: req.body.booking_name,
      booking_phone: req.body.booking_phone,
      booking_date: req.body.booking_date,
      booking_time: req.body.booking_time,
      table_id: req.body.table_id,
    };
    let order_id = await modelOrders.addOrder(order);
    console.log(order_id);
    arr_order.forEach(async (value, index) => {
      let detail = {
        order_id: order_id,
        product_id: value.id,
        quantity: value.quantity,
        unit_price: value.price,
      };
      totalPrice += value.price * Number(value.quantity);
      await modelDetails.addDetail(detail);
    });
    await modelOrders.updateOrder({ total: totalPrice }, order_id);
    return res.json({ message: "Thêm dữ liệu thành công" });
  }
  if (action == "fetch_single") {
    const id = req.body.id;

    let data = await modelOrders.fetchSingleOrder(id);
    res.json(data);
  }

  if (action == "Edit") {
    const id = req.body.id;
    const ord = {
      status: req.body.status,
    };
    modelOrders.updateOrder(ord, id);
    res.json({ message: "Cập nhật thành công" });
  }

  if (action == "delete") {
    const id = req.body.id;
    modelOrders.deleteOrder(id);
    res.json({ message: "Xóa sản phẩm thành công" });
  }
};
exports.getDetail = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      let id = req.params.id;
      let data = await modelOrders.getDetail(id);
      res.render("details", { data });
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
};
exports.getTime = async (req, res, next) => {
  let t = req.body.timeOrder;
  let data = await modelOrders.fetchOrderTime(t);
  res.json(data);
};
exports.countOrder = async (req, res, next) => {
  let data = await modelOrders.countOrder();
  res.json(data);
};
exports.userOrder = async (req, res, next) => {
  const token = req.cookies.token;
  const cert = fs.readFileSync("./key/publickey.crt");
  let phone = null;
  if (token) {
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    phone = kq.phone;
  }

  const arr_order = JSON.parse(req.body.arr_order);
  const order = {
    booking_name: req.body.booking_name,
    booking_phone: req.body.booking_phone,
    booking_date: req.body.booking_date,
    booking_time: req.body.booking_time,
    table_id: req.body.table_id,
    note: req.body.description,
    user_phone: phone,
    total: req.body.total,
  };
  let order_id = await modelOrders.addOrder(order);
  arr_order.forEach(async (value, index) => {
    let detail = {
      order_id: order_id,
      product_id: value.product.id,
      quantity: value.quantity,
      unit_price: value.product.price,
    };
    await modelDetails.addDetail(detail);
  });
  return res.json({ message: "Đặt bàn thành công" });
};
exports.listOrder = async (req, res, next) => {
  const token = req.cookies.token;
  const cert = fs.readFileSync("./key/publickey.crt");
  const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
  let data = await modelOrders.fetchOrderPhone(kq.phone);
  return res.json(data);
};
