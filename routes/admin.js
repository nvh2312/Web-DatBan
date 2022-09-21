let express = require("express");
let router = express.Router();
let fs = require("fs");
let jwt = require("jsonwebtoken");
let controllerCategories = require("../controllers/categories");
let database = require("../models/database");
let controllerProducts = require("../controllers/products");
let controllerUsers = require("../controllers/users");
let controllerFloors = require("../controllers/floors");
let controllerTables = require("../controllers/tables");
let controllerOrders = require("../controllers/orders");

// View
router.get("/", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("admin");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/products", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("items");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/manage-user", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("manage-user");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/floors", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("floors");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/categories", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("categories");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/tables", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("tables");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/orders", function (req, res, next) {
  try {
    const token = req.cookies.token;
    const cert = fs.readFileSync("./key/publickey.crt");
    const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
    if (kq.role == 1) {
      return res.render("orders");
    }
    return res.redirect("/home");
  } catch (error) {
    return res.redirect("/home");
  }
});
router.get("/orders/:id", controllerOrders.getDetail);

// API

//get-data
router.get("/api/getCategories", controllerCategories.getAllCategory);
router.get("/api/getItems", controllerProducts.getProduct);
router.get("/api/getUsers", controllerUsers.getUser);
router.get("/api/getFloors", controllerFloors.getFloor);
router.get("/api/getTables", controllerTables.getTable);
router.post("/api/getAllTableFloor", controllerTables.getAllTableFloor);
router.get("/api/getAllFloors", controllerFloors.getAllFloor);
router.get("/api/getPageCategories", controllerCategories.getCategory);
router.get("/api/getOrders", controllerOrders.getOrder);
router.post("/api/getTime", controllerOrders.getTime);
router.get("/api/countOrder", controllerOrders.countOrder);


//crud
router.post("/api/actionProduct", controllerProducts.actionProduct);
router.post("/api/disableProduct", controllerProducts.disableProduct);
router.post("/api/actionUser", controllerUsers.actionUser);
router.post("/api/actionFloor", controllerFloors.actionFloor);
router.post("/api/actionCategory", controllerCategories.actionCategory);
router.post("/api/actionTable", controllerTables.actionTable);
router.post("/api/actionOrder", controllerOrders.actionOrder);
router.post("/api/userOrder", controllerOrders.userOrder);
router.get("/api/listOrder", controllerOrders.listOrder);


module.exports = router;
