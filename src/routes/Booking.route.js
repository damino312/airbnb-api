const express = require("express");
const app = express();

const BookingController = require("../controllers/Booking.controller");
const corsMiddleware = require("../middleWare/corsMiddleWare");

const cookieParser = require("cookie-parser");

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.post("/booking", BookingController.bookThePlace);

app.get("/bookings", BookingController.getBookingsOfUser);

module.exports = app;
