const express = require("express");
const app = express();

const corsMiddleware = require("../middleWare/corsMiddleWare");
const cookieParser = require("cookie-parser");

const multer = require("multer"); // for adding photos
const photosMiddleware = multer({ dest: "uploads" }); // for adding photos

const PlaceController = require("../controllers/Place.controller");

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/places", PlaceController.getAllPlaces);

app.put("/places", PlaceController.editPlaceInfo);

app.get("/places/:id", PlaceController.getPlaceById);

app.post("/places", PlaceController.addNewPlace);

app.delete("/places/:id", PlaceController.deletePlace);

app.get("/user-places", PlaceController.findUsersPlaces);

app.post(
  "/upload",
  photosMiddleware.array("photos", 15),
  PlaceController.uploadPlacesPictures
);

app.post("/upload-by-link", PlaceController.uploadPictureByLink);

module.exports = app;
