// CAll the Error Model (our own model)
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");

const DUMMY_USERS = [
  { id: "u1", name: "Eric Lucero", email: "eric@test.com", password: "test" },
];
const getUsers = (req, res, next) => {
  res.json({ DUMMY_USERS });
};
const signup = (req, res, next) => {
  const { userName, email, password } = req.body;

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  //   Find user on List
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("User not found", 401);
  }
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
