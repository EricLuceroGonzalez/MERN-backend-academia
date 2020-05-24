const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
// ********************** MIDDLEWARE FUNCTIONS **********************
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const port = 3001;
// CAll the Error Model (our own model)
const HttpError = require("./models/http-error");

const app = express();
// Bring the BODYPARSER Middleware --> will parse any request body extract json data to JS object and call next()
app.use(bodyParser.json());

// CORS error: set the headers to prevent (Middleware):
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Controll-Allow-Methods", "GET, POST, PATCH, DELETE");
  // ---> Continue flow to other middewares
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// Error handler when no endpoint or direction is found "NEXT()""
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});
// Error Middleware

// Special middleware function - Express knows is Error Handling (4 parameters)
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred" });
});

// CALL MONGOOSE and Connect
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Start server
    app.listen(port);
    console.log(`Connected to Mongo. Port: \n${port}`);
  })
  .catch((err) => {
    console.log(`No conection. Errors: \n ${err}`);
  });
