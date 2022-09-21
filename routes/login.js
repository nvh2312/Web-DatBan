var express = require("express");
var router = express.Router();
var controllerUser = require("../controllers/users");

router.get("/", function (req, res, next) {
  const token = req.cookies.token;
  if (token) {
    return res.redirect("home");
  }
  res.render("login");
});
router.post("/addUser", controllerUser.addUser);
router.post("/fetchSingleUser", controllerUser.fetchSingleUser);
router.post("/checkLogin", controllerUser.checkLogin);
router.post("/checkPhone", controllerUser.checkPhone);

module.exports = router;
