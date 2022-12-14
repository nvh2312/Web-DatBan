let modelProducts = require("../models/products");
let database = require("../models/database");
let modelCategories = require("../models/categories");
const multer = require("multer");
let image_source = "";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    image_source = file.originalname;
    cb(null, image_source);
  },
});
let upload = multer({ storage: storage });

exports.showProduct = async (req, res, next) => {
  const data = await modelProducts.fetchAllProduct();
  return res.json(data);
};
exports.showCategoryProduct = async (req, res, next) => {
  const categoryId= req.body.id;
  const data = await modelProducts.fetchCategoryProduct(categoryId);
  return res.json(data);
};
exports.getProductById = async (req, res, next) => {
  let id = req.body.id;
  const data = await modelProducts.fetchProductById(id);
  return res.json(data);
};
exports.getProduct = function (request, response, next) {
  console.log(request.query.columns)
  let draw = request.query.draw;

  let start = request.query.start;

  let length = request.query.length;

  let order_data = request.query.order;
  let column_name = "";
  let column_sort_order = "";
  let column_index = "";

  if (typeof order_data == "undefined") {
    column_name = "p.id";

    column_sort_order = "desc";
  } else {
    column_index = request.query.order[0]["column"];

    column_name = request.query.columns[column_index]["data"];

    column_sort_order = request.query.order[0]["dir"];
  }

  //search data

  let search_value = request.query.search["value"];
  let search_query = `AND (p.name LIKE '%${search_value}%' 
  OR p.price LIKE '%${search_value}%' 
  OR p.time LIKE '%${search_value}%' 
  OR c.name LIKE '%${search_value}%'
  )`;

  //Total number of records without filtering

  database.query(
    "SELECT COUNT(*) AS Total FROM product",
    function (error, data) {
      let total_records = data[0].Total;

      //Total number of records with filtering

      database.query(
        `SELECT COUNT(*) AS Total
         FROM product p JOIN category c on p.category_product= c.id WHERE 1 ${search_query}`,
        function (error, data) {
          let total_records_with_filter = data[0].Total;
          let query = `
          SELECT p.image_src, p.name,p.price,p.time, p.id,c.name as category_name ,p.disable , c.id as category_id
          FROM product p
          JOIN category c on p.category_product= c.id
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
exports.actionProduct = async (req, res, next) => {
  let action = req.body.action;
  if (action == "Add") {
    // upload.single("image_src");
    const prod = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_src: req.body.image_src,
      time: req.body.time,
      category_product: req.body.category_product,
    };
    await modelProducts.addProduct(prod);
    return res.json({ message: "Thêm dữ liệu thành công" });
  }
  if (action == "fetch_single") {
    const id = req.body.id;

    let data = await modelProducts.fetchProductById(id);
    res.json(data);
  }

  if (action == "Edit") {
    const id = req.body.id;
    const prod = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image_src: req.body.image_src,
      time: req.body.time,
      category_product: req.body.category_product,
    };
    modelProducts.updateProductById(prod, id);
    res.json({ message: "Cập nhật thành công" });
  }

  if (action == "delete") {
    const id = req.body.id;
    modelProducts.deleteProduct(id);
    res.json({ message: "Xóa sản phẩm thành công" });
  }
};
exports.disableProduct = async (req, res, next) => {
  const id = req.body.id;

  const product = await modelProducts.fetchProductById(id);
  if (!product) {
    return res.json({ message: "Không tìm thấy sản phẩm" });
  }

  product.disable = !product.disable;
  modelProducts.updateProductById(product, id);
  if (product.disable == 1)
    return res.json({ message: "Ẩn sản phẩm thành công" });
  res.json({ message: "Hiện sản phẩm thành công" });
};
