// CAll the Error Model (our own model)
const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  console.log(`GET request in Places-routes: ${placeId}`);
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  // Handle Error:
  if (!place) {
    throw new HttpError(`Could not find a place for the id: ${placeId}`, 404);
  }
  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  // Handle Error:
  if (!place) {
    return next(
      new HttpError(`Could not find a place for the id: ${placeId}`, 404)
    );
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  // instead of 'const title = req.body.title' ... we do:
  const { title, description, coordinates, address, creator } = req.body;
  console.log(req.body);

  const createdPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  //   Update dataset
  DUMMY_PLACES.push(createdPlace);
  //   Send RESPONSE
  res.status(201).json({ place: createdPlace });
};

// Export the logic of controllers
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
