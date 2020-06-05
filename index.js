// File System
const fs = require("fs");
// point to folder, absolute path
const path = require("path");

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

// Add a middleware to handle the image path GET method
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// CORS error: set the headers to prevent (Middleware):
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
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
  // Find the file on the request and ERROR ---> Not save
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(`The error on file: ${err}`);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred" });
});

// CALL MONGOOSE and Connect
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-j4waz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    // Start server
    app.listen(port);
    console.log(`Connected to Mongo. Port: \n${port}`);
  })
  .catch((err) => {
    console.log(`No conection. Errors: \n ${err}`);
  });
