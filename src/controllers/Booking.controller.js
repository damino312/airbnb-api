const Booking = require("../models/Booking");

const jwt = require("jsonwebtoken");

const jwtSecret = "sdafadfgjiaFDJA/;dfAJNKD;Nask"; // moveto .env

const bookThePlace = async (req, res) => {
  const { user, place, guests, checkIn, checkOut, firstName, phone } = req.body;
  console.log(req.body);

  const booking = new Booking({
    place,
    user,
    checkIn,
    checkOut,
    name: firstName,
    phone,
    guests,
  });
  try {
    await booking.save();
    res.json("ok");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const getBookingsOfUser = async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { id: user } = userData;
      res.json(await Booking.find({ user }).populate("place"));
    });
  } catch (error) {
    console.error(error);
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { user } = await Booking.findById(id);
      if (user.toString() === userData.id) {
        await Booking.findByIdAndDelete(id);
        res.json("The booking has been deleted");
      }
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { bookThePlace, getBookingsOfUser, deleteBooking };
