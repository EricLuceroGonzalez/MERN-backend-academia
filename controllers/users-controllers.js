// CAll the Error Model (our own model)
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

// Get the user schema:
const User = require("../models/User");

// Get the validator RESULTS:
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  { id: "u1", name: "Eric Lucero", email: "eric@test.com", password: "test" },
];

const getUsers = async (req, res, next) => {
  // FIND and retrieve only USERNAME and PASSWORD
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  // Call validation RESULT before, to check validity
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError("Invalid inpts, please check your data", 422);
    return next(error);
  }

  const { name, email, password } = req.body;

  //   Check if he user already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Some error just happen cheking the email",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User already exists, please login instead",
      422
    );
    return next(error);
  }
  const createdUser = new User({
    name,
    email,
    password,
    places:[],
    image: "https://randomuser.me/api/portraits/lego/6.jpg",
  });

  //   Create USER ---> save() to Mongo, as async => await
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Creating user failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // FIND IF HE USER ALREADY EXISTS
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Some error just happen cheking the email",
      500
    );
    return next(error);
  }
  //   CHECK IF EMAIL OR PASSWORD IS CORRECT (dummy version)

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials, cant log in", 401);
    return next(error);
  }
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
