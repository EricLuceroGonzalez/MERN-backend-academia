const express = require("express");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// Call the controllers
const placesControllers = require("../controllers/places-controllers");

// **********************  MIDDLEWARE FUNCTIONS & CONTROLLERS  **********************
router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlaces ByUserId);
router.post("/", placesControllers.createPlace);
router.patch("/:pid", placesControllers.updatePlace);
router.delete("/:pid", placesControllers.deletePlace);

// To connect with principal file:
module.exports = router;
