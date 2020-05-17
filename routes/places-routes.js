const express = require("express");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// ********************** MIDDLEWARE FUNCTIONS **********************
router.get("/", (req, res, next) => {
  console.log("GET request in Places-routes");
  res.json({ message: "It wworks!" });
});

// To connect with principal file:
module.exports = router;
