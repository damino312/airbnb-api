const express = require("express");
const app = express();
const { default: mongoose } = require("mongoose");

const PlaceRoutes = require("./src/routes/Place.route");
const BookingRoutes = require("./src/routes/Booking.route");
const UserRoutes = require("./src/routes/User.route");

app.use(PlaceRoutes);
app.use(BookingRoutes);
app.use(UserRoutes);

app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

app.listen(4000);
