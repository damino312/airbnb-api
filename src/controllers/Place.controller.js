const express = require("express");
const app = express();
require('dotenv').config();

const Place = require("../models/Place");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.jwtSecret;

const fs = require("fs");

const imageDownloader = require("image-downloader");

app.use("/uploads", express.static(__dirname, `../../tmp/`)); // uploading doesnt work without it here

const getAllPlaces = async (req, res) => {
  res.json(await Place.find());
};

const editPlaceInfo = async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  console.log(req.body);

  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.findById(id);

      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price,
        });
        placeDoc.save();
        res.json("ok");
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const getPlaceById = async (req, res) => {
  const { id } = req.params;

  res.json(await Place.findById(id));
};

const addNewPlace = async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      res.json(placeDoc);
    });
  } catch (error) {
    console.error(error);
  }
};

const deletePlace = async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      await Place.findByIdAndDelete(id);
      res.json("The place has been deleted");
    }
  });
};

const findUsersPlaces = (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      const { id } = userData;
      res.json(await Place.find({ owner: id }));
    });
  } catch (error) {
    console.error(error);
  }
}; // for showing places of a user

const uploadPlacesPictures = (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    console.log(path + "." + ext);
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
  console.log(uploadedFiles);
};

const uploadPictureByLink = async (req, res) => {
  const { link } = req.body;
  const newName = "photo_" + Date.now() + ".jpg";
  try {
    await imageDownloader.image({
      url: link,
      dest: "../../uploads/" + newName, // the route
    });
    res.json(newName);
  } catch (error) {
    console.log(error);
  }
};

const findByName = async (req, res) => {
  const query = req.query
  console.log(query)
  try {
    const result = await Place.find({ title: { $regex: query.title, $options: 'i' } })
    res.json(result)
  } catch (error){
    console.error(error)
  }
    
 
}

module.exports = {
  getAllPlaces,
  editPlaceInfo,
  getPlaceById,
  addNewPlace,
  deletePlace,
  findUsersPlaces,
  uploadPlacesPictures,
  uploadPictureByLink,
  findByName,
};
