const express = require("express");
const app = express();
require('dotenv').config();

const Place = require("../models/Place");
const Booking = require("../models/Booking")

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.jwtSecret;

const fs = require("fs");

const imageDownloader = require("image-downloader");


const getAllPlaces = async (req, res) => {
  try {
    res.json(await Place.find());
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get all places" });    
  }
  
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
    res.status(500).json({ error: "Failed to edit info of the place" });    
  }
};

const getPlaceById = async (req, res) => {
  const { id } = req.params;
  try {
    res.json(await Place.findById(id));
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to get the place by the id" });    
  }
  
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
    res.status(500).json({ error: "Failed to add a new place" });    
  }
};

const deletePlace = async (req, res) => {
  const { token } = req.cookies;
  const { id } = req.params;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
      const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      
      try {
        await Booking.deleteMany({place: id}); // delete the booking of the place
        await Place.findByIdAndDelete(id); // delete the place
        res.json("The place has been deleted")
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete the place" });    
      }
      
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
    res.status(500).json({ error: "Failed to find user's places" });    
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
  res.status(500).json({ error: "Failed to upload the pictures" });    
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
    console.error(error);
    res.status(500).json({ error: "Failed to upload the picture by the link" });    
  }
};

const findByName = async (req, res) => {
  const query = req.query
  try {
    const result = await Place.find({ title: { $regex: query.title, $options: 'i' } })
    res.json(result)
  } catch (error){
    console.error(error)
    res.status(500).json({ error: "Failed to find the place by the name" });    
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
