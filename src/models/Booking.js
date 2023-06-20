const mongoose = require("mongoose");
const { Schema } = mongoose;
const BookingSchema = new Schema({
  place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  phone: { type: String, required: true },
  guests: Number,
  status: { type: Number, required: true, default: 0 },
});

const BookingModel = mongoose.model("Booking", BookingSchema);

module.exports = BookingModel;
