const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Create the Schema:
const placeSchema = new Schema({
  title: { type: String, require: true },
  image: { type: String, require: true },
  address: { type: String, require: true },
  description: { type: String, require: true },
  location: {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
  },
  creator:{ type: mongoose.Types.ObjectId, required: true, ref: 'User'}
});

// Exports the model
module.exports = mongoose.model("Place", placeSchema);
