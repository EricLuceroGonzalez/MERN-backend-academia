const express = require("express");
const bodyParser = require('body-parser')

const app = express();

// Bring the BODYPARSER Middleware --> will parse any request body extract json data to JS object and call next()
app.use(bodyParser.json());

// ********************** MIDDLEWARE FUNCTIONS **********************
const placesRoutes = require("./routes/places-routes");

app.use("/api/places", placesRoutes);

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
