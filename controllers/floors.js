let database = require("../models/database");
let modelFloors = require("../models/floors");

exports.getAllFloor = async function (request, response, next) {
    let data = await modelFloors.fetchAllFloor();
    response.json(data);
}

exports.getFloor = function (request, response, next) {
  let draw = request.query.draw;

  let start = request.query.start;

  let length = request.query.length;

  let order_data = request.query.order;
  let column_name = "";
  let column_sort_order = "";
  let column_index = "";

  if (typeof order_data == "undefined") {
    column_name = "floor.id";

    column_sort_order = "desc";
  } else {
    column_index = request.query.order[0]["column"];

    column_name = request.query.columns[column_index]["data"];

    column_sort_order = request.query.order[0]["dir"];
  }

  //search data

  let search_value = request.query.search["value"];
  let search_query = `AND (floor.name LIKE '%${search_value}%'  
    OR floor.id LIKE '%${search_value}%'
    OR floor.price LIKE '%${search_value}%'
    )`;

  //Total number of records without filtering

  database.query("SELECT COUNT(*) AS Total FROM floor", function (error, data) {
    let total_records = data[0].Total;
    //Total number of records with filtering

    database.query(
      `SELECT COUNT(*) AS Total
           FROM floor WHERE 1 ${search_query}`,
      function (error, data) {
        let total_records_with_filter = data[0].Total;
        let query = `
            SELECT floor.id,floor.name,floor.price
            FROM floor
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
exports.actionFloor = async (req, res, next) => {
  let action = req.body.action;
  if (action == "Add") {
    const fl = {
      name: req.body.name,
      price: req.body.price,
    };
    await modelFloors.addFloor(fl);
    return res.json({ message: "Thêm dữ liệu thành công" });
  }
  if (action == "fetch_single") {
    const id = req.body.id;
    let data = await modelFloors.fetchSingleFloor(id);
    res.json(data);
  }

  if (action == "Edit") {
    const id = req.body.id;
    const fl = {
      name: req.body.name,
      price: req.body.price,
    };
    modelFloors.updateFloor(fl, id);
    res.json({ message: "Cập nhật thành công" });
  }

  if (action == "delete") {
    const id = req.body.id;
    modelFloors.deleteFloor(id);
    res.json({ message: "Xóa thành công" });
  }
};
