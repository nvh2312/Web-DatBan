var express = require("express");
var cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
var router = express.Router();
var modelUsers = require("../models/users");
var fs = require("fs");

router.get(
  "/",
  function (req, res, next) {
    try {
      const token = req.cookies.token;
      const cert = fs.readFileSync("./key/publickey.crt");
      const kq = jwt.verify(token, cert, { algorithms: ["RS256"] });
      if (kq) {
        req.data = kq;
        next();
      }
    } catch (error) {
      return res.render("home", { data: null });
    }
  },
  async (req, res, next) => {
    const data = await modelUsers.fetchUserById(req.data.id);
    res.render("listOrder", { data: data });
  }
);

module.exports = router;
