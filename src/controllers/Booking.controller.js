require('dotenv').config();
const Booking = require("../models/Booking");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.jwtSecret;

const bookThePlace = async (req, res) => {
  const { token } = req.cookies;
  const { user, owner, place, guests, checkIn, checkOut, firstName, phone } =
    req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    if (place.user == userData.id) {
      res.json("owner");
    } else {
      const booking = new Booking({
        place,
        user,
        checkIn,
        checkOut,
        name: firstName,
        phone,
        guests,
        owner,
      });
      try {
        await booking.save();
        res.json("ok");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create booking" });
      }
    }
  });
};

const getBookingsOfUser = async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id: user } = userData;
    try {
      res.json(await Booking.find({ user }).populate("place"));
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to get bookings of the user" });
    }
    
  });
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { user } = await Booking.findById(id);
    if (user.toString() === userData.id) {
      try {
        await Booking.findByIdAndDelete(id);
      res.json("The booking has been deleted");
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to delete the booking" });
      }
      
    }
  });
};

const getRequestsToMe = async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    try {
      res.json(
        await Booking.find({ owner: userData.id, status: 0 }).populate("place")
      );
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to get my requests" });
    }
    
  });
};

const getHistoryRequestsToMe = async (req, res) => {
  const { token } = req.cookies;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    try {
      res.json(
        await Booking.find({
          owner: userData.id,
          status: { $in: [1, 2] },
        }).populate("place")
      );
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to get the history of the requests" });
    }
  });
};

const changeStatusOfRequest = async (req, res) => {
  const { token } = req.cookies;
  const { status, ownerId, bookingId } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    if (userData.id === ownerId) {
      try {
        await Booking.findByIdAndUpdate(bookingId, { status: status });
        res.json("The status has been changed");
      } catch (error) {
        console.error(error)
      res.status(500).json({ error: "Failed to change the status of the request" });
      }
     
    }
  });
};

module.exports = {
  bookThePlace,
  getBookingsOfUser,
  deleteBooking,
  getRequestsToMe,
  changeStatusOfRequest,
  getHistoryRequestsToMe,
};
