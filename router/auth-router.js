const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/auth-controller");
const signupSchema = require("../validators/auth-validator");
const validate = require("../middleware/validate");

// Routes
router.route("/").get(authcontroller.home);
router.route("/register").post(validate(signupSchema), authcontroller.register);
router.route("/login").post(authcontroller.login);

module.exports = router;
