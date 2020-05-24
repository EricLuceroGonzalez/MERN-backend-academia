// CAll the Error Model (our own model)
const HttpError = require("../models/http-error");
// Get mongoose
const mongoose = require("mongoose");
// Get the validator RESULTS:
const { validationResult } = require("express-validator");
// Get the coordinates
const getCoordsForAddress = require("../utils/location");
// Get the Place Model
const Place = require("../models/Place");
const User = require("../models/User");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  // get the places from Mongo FIND-BY-ID
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    new HttpError(`Could not find a place.`, 500);
    return next(error);
  }

  // Handle Error:
  if (!place) {
    const error = new HttpError(
      `Could not find a place for the id: ${placeId}`,
      404
    );
    return next(error);
  }
  // Sending the Place object parsed as plain JS object with '.toObject'
  // Eliminating the _id with 'getters'
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // Change from placeByUser ---> to
  let userWithPlaces;
  // get the users from Mongo FIND-BY-ID
  try {
    userWithPlaces = await User.findById({ userId }).populate("places");
  } catch (error) {
    new HttpError(`Could not find a place.`, 500);
    return next(error);
  }

  // Handle Error:
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    const error = new HttpError(
      `Could not find a place for the id: ${userId}`,
      404
    );
    return next(error);
  }
  // Sending the Place object parsed as plain JS object with '.toObject'
  // Eliminating the _id with 'getters'
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  // Call validation RESULT before, to check validity
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid inpts, please check your data", 422);
    return next(error);
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
  // Create the place to mongoose
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg",
    address,
    creator,
  });

  // Check if the user creator already exists:
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }
  console.log(user);

  //   Update dataset ---> save() to Mongo, as async => await
  //   SESSIONS + TRANSACTIONS
  try {
    // Session: Start
    const sess = await mongoose.startSession();
    // ----> in the current session, start a TRANSACTION
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    // Check that the place id adds to user:
    user.places.push(createdPlace);
    await user.save({ session: sess }); // ---> Update now with the place
    sess.commitTransaction(); // ---> Changes will commit
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  //   Send RESPONSE
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid inpts, please check your data", 422);
    return next(error);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (errr) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  // Copy data and return a new object and replace old values:
  place.title = title;
  place.description = description;

  // Now save back the finded
  try {
    await place.save();
  } catch (errr) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // Get the place and populate the creator:
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  console.log("place:");
  console.log(place);
  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  // Start a session, delete the place and creator founded
  try {
    // Session: Start
    const sess = await mongoose.startSession();
    // ----> in the current session, start a TRANSACTION
    sess.startTransaction();
    // Remove the place:
    await place.remove({ session: sess });
    // Access the creator and remove
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Something went wrong", 404);
    return next(error);
  }

  res.status(200).json({ message: "Deleted place" });
};

// Export the logic of controllers
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
