const express = require("express");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// Call the controllers
const placesControllers = require("../controllers/places-controllers");

// **********************  MIDDLEWARE FUNCTIONS & CONTROLLERS  **********************
router.get("/:placeId", placesControllers.getPlaceById);
router.get("/user/:pid", placesControllers.getPlaceByUserId);
router.post("/", placesControllers.createPlace);

// To connect with principal file:
module.exports = router;