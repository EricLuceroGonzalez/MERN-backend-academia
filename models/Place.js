const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create the Schema:
const placeSchema = new Schema({
  id: { type: String, require: true },
  title: { type: String, require: true },
  image: { type: String, require: true },
  address: { type: String, require: true },
  description: { type: String, require: true },
  location: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
  creator: { type: String, require: true },
});

// Exports the model
module.exports = mongoose.model("Place", placeSchema);
