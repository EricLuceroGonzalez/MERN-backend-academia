const axios = require("axios");

const API_KEY = process.env.API_key_GOOGLE;
const HttpError = require("../models/http-error");

// async returns this function in a PROMISE
async function getCoordsForAddress(address) {
    console.log(address);
    
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  
  const data = response.data;
  if (!data || data.status === "ZER0_RESULTS") {
    const error = new HttpError(
      "Could not find location for this address",
      422
    );
    throw error;
  }
  //   if there is no error: extract the coordinates:
  const coordinates = data.results[0].geometry.location;
  console.log(coordinates);
  
  return coordinates;
}

module.exports = getCoordsForAddress;
