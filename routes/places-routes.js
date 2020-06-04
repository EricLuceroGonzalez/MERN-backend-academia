const express = require("express");

// Fileulpoad Middleware
const fileUpload = require("../middleware/file-upload");
// Auth-check Middleware
const checkAuth = require("../middleware/check-auth");

// Import the express-validator:
const { check } = require("express-validator");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// Call the controllers
const placesControllers = require("../controllers/places-controllers");

// **********************  MIDDLEWARE FUNCTIONS & CONTROLLERS  **********************
router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlacesByUserId);

// **********************  MIDDLEWARE To ACCESS next requests  **********************
router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);
router.delete("/:pid", placesControllers.deletePlace);

// To connect with principal file:
module.exports = router;
