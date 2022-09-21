let database = require("../models/database");
let modelTables = require("../models/tables");

exports.getAllTableFloor = async function (request, response, next) {
  let id = request.body.floorID;
  let data = await modelTables.fetchAllTableFloor(id);
  response.json(data);
}
exports.getTable = function (request, response, next) {
  
  let draw = request.query.draw;

  let start = request.query.start;

  let length = request.query.length;

  let order_data = request.query.order;
  let column_name = "";
  let column_sort_order = "";
  let column_index = "";

  if (typeof order_data == "undefined") {
    column_name = "t.id";

    column_sort_order = "desc";
  } else {
    column_index = request.query.order[0]["column"];

    column_name = request.query.columns[column_index]["data"];

    column_sort_order = request.query.order[0]["dir"];
  }

  //search data

  let search_value = request.query.search["value"];
  let search_query = `AND (t.name LIKE '%${search_value}%' 
  OR t.id LIKE '%${search_value}%' 
  OR f.name LIKE '%${search_value}%' 
  )`;

  //Total number of records without filtering

  database.query(
    "SELECT COUNT(*) AS Total FROM tables",
    function (error, data) {
      let total_records = data[0].Total;

      //Total number of records with filtering

      database.query(
        `SELECT COUNT(*) AS Total
         FROM tables t JOIN floor f on t.floor_id= f.id WHERE 1 ${search_query}`,
        function (error, data) {
          let total_records_with_filter = data[0].Total;
          let query = `
          SELECT t.id,t.name,f.name as floor
          FROM tables t
          JOIN floor f on t.floor_id= f.id
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
exports.actionTable = async (req, res, next) => {
  let action = req.body.action;
  if (action == "Add") {
    const tab = {
      name: req.body.name,
      floor_id: req.body.floor_id,
    };
    await modelTables.addTable(tab);
    return res.json({ message: "Thêm dữ liệu thành công" });
  }
  if (action == "fetch_single") {
    const id = req.body.id;

    let data = await modelTables.fetchSingleTable(id);
    res.json(data);
  }

  if (action == "Edit") {
    const id = req.body.id;
    const tab = {
      name: req.body.name,
      floor_id: req.body.floor_id,
    };
    modelTables.updateTable(tab, id);
    res.json({ message: "Cập nhật thành công" });
  }

  if (action == "delete") {
    const id = req.body.id;
    modelTables.deleteTable(id);
    res.json({ message: "Xóa sản phẩm thành công" });
  }
};


