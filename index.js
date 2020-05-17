const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// ********************** MIDDLEWARE FUNCTIONS **********************
const placesRoutes = require("./routes/places-routes");
app.use("/api/places", placesRoutes);

// Start server
app.listen(3001);