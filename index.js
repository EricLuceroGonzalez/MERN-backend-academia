const express = require("express");
const bodyParser = require("body-parser");

// ********************** MIDDLEWARE FUNCTIONS **********************
const placesRoutes = require("./routes/places-routes");

// CAll the Error Model (our own model)
const HttpError = require("./models/http-error");

const app = express();
// Bring the BODYPARSER Middleware --> will parse any request body extract json data to JS object and call next()
app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
// Error handler when no endpoint or direction is found "NEXT()""
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
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
// Start server
app.listen(3001);
