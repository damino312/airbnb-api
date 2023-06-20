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

app.delete("/booking/:id", BookingController.deleteBooking);

app.get("/myrequests", BookingController.getRequestsToMe);

app.get("/myrequests/history", BookingController.getHistoryRequestsToMe);

app.put("/myrequest", BookingController.changeStatusOfRequest);

module.exports = app;
