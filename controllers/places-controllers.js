// const uuid = require("uuid");
const { v4: uuidv4 } = require("uuid");
// CAll the Error Model (our own model)
const HttpError = require("../models/http-error");
// Get the coordinates
const getCoordsForAddress = require("../utils/location");

// Get the validator RESULTS:
const { validationResult } = require("express-validator");
// Dummy data:
let DUMMY_PLACES = [
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
  const placeId = req.params.pid;
  console.log(`GET request in Places-routes: ${placeId}`);
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  // Handle Error:
  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
    // throw new HttpError(`Could not find a place for the id: ${placeId}`, 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });
  // Handle Error:
  if (!places || places.length === 0) {
    return next(
      new HttpError(`Could not find a place for the id: ${placeId}`, 404)
    );
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  // Call validation RESULT before, to check validity
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inpts, please check your data", 422));
  }
  // instead of 'const title = req.body.title' ... we do:
  const { title, description, address, creator } = req.body;
  //   Convert Address to coordinates: INSIDE  try-catch because getCoordsForAddress function has error throw inside
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error); // Because we use await
  }

  const createdPlace = {
    id: uuidv4(),
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

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);

    throw new HttpError("Invalid inpts, please check your data", 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  // Copy data and return a new object and replace old values:
  const updatedPlace = { ...DUMMY_PLACES.find((p) => (p.id = placeId)) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => (p.id = placeId));
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  //   redefine, except the place with id = placeId
  DUMMY_PLACES = DUMMY_PLACES.find((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted place" });
};

// Export the logic of controllers
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
