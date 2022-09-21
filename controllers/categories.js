let modelCategories = require("../models/categories");
let database = require("../models/database");

exports.getAllCategory = async (req, res, next) => {
  const data = await modelCategories.fetchAllCategory();
  return res.json({ data });
};

exports.getCategory = function (request, response, next) {
  let draw = request.query.draw;

  let start = request.query.start;

  let length = request.query.length;

  let order_data = request.query.order;
  let column_name = "";
  let column_sort_order = "";
  let column_index = "";

  if (typeof order_data == "undefined") {
    column_name = "category.id";

    column_sort_order = "desc";
  } else {
    column_index = request.query.order[0]["column"];

    column_name = request.query.columns[column_index]["data"];

    column_sort_order = request.query.order[0]["dir"];
  }
  //search data

  let search_value = request.query.search["value"];
  let search_query = `AND (category.name LIKE '%${search_value}%'  
    OR category.id LIKE '%${search_value}%'
    )`;

  //Total number of records without filtering

  database.query("SELECT COUNT(*) AS Total FROM category", function (error, data) {
    let total_records = data[0].Total;
    //Total number of records with filtering

    database.query(
      `SELECT COUNT(*) AS Total
           FROM category WHERE 1 ${search_query}`,
      function (error, data) {
        let total_records_with_filter = data[0].Total;
        console.log('ok');
        let query = `
            SELECT category.id,category.name
            FROM category
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
exports.actionCategory = async (req, res, next) => {
  let action = req.body.action;
  if (action == "Add") {
    const cate = {
      name: req.body.name,
    };
    await modelCategories.addCategory(cate);
    return res.json({ message: "Thêm dữ liệu thành công" });
  }
  if (action == "fetch_single") {
    const id = req.body.id;
    let data = await modelCategories.fetchSingleCategory(id);
    res.json(data);
  }

  if (action == "Edit") {
    const id = req.body.id;
    const cate = {
      name: req.body.name,
    };
    modelCategories.updateCategory(cate, id);
    res.json({ message: "Cập nhật thành công" });
  }

  if (action == "delete") {
    const id = req.body.id;
    modelCategories.deleteCategory(id);
    res.json({ message: "Xóa thành công" });
  }
};
