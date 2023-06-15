const Booking = require("../models/Booking");

const jwt = require("jsonwebtoken");

const jwtSecret = "sdafadfgjiaFDJA/;dfAJNKD;Nask"; // moveto .env

const bookThePlace = async (req, res) => {
  const { user, place, guests, checkIn, checkOut, firstName, phone } = req.body;
  await Booking.create({
    place,
    user,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    name: firstName,
    phone,
    guests,
  });
  res.json("ok");
};

const getBookingsOfUser = async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      const { id: user } = userData;
      res.json(await Booking.find({ user }));
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { bookThePlace, getBookingsOfUser };
