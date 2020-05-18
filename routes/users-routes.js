const express = require("express");

// Import the express-validator:
const { check } = require("express-validator");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// Call the controllers
const usersControllers = require("../controllers/users-controllers");

// **********************  MIDDLEWARE FUNCTIONS & CONTROLLERS  **********************
router.get("/", usersControllers.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), // Test@test.com --> test@test.com
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);
router.post("/login", usersControllers.login);

// To connect with principal file:
module.exports = router;
