const express = require("express");

app = express();
// Special object to middleware (and export)
const router = express.Router();

// Dummy data:
const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famouse sky scrappers",
    location: { lat: 40.7484874, lng: -73.9871516 },
    address: "20 W 34th St New York",
    creator: "u1",
  },
];

// ********************** MIDDLEWARE FUNCTIONS **********************
router.get("/:placeId", (req, res, next) => {
  const placeId = req.params.placeId;
  console.log(`GET request in Places-routes: ${placeId}`);
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  // Handle Error:
  if (!place) {
    return res
      .status(404)
      .json({ message: `Could not find a place for the id: ${placeId}` });
  }
  res.json({ place: place, message: "It works!" });
});

router.get("/user/:pid", (req, res, next) => {
  const userId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
    // Handle Error:
    if (!place) {
      return res
        .status(404)
        .json({ message: `Could not find a place for the user id: ${userId}` });
    }
  
  res.json(place);
});

// To connect with principal file:
module.exports = router;
