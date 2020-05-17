const express = require("express");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// Call the controllers
const usersControllers = require("../controllers/users-controllers");

// **********************  MIDDLEWARE FUNCTIONS & CONTROLLERS  **********************
router.get("/", usersControllers.getUsers);
router.post("/signup", usersControllers.signup);
router.post("/login", usersControllers.login );

// To connect with principal file:
module.exports = router;
