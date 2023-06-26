const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require("../models/User");

const jwtSecret = process.env.jwtSecret;
const bcrypt = require("bcryptjs");

const bcryptSalt = bcrypt.genSaltSync(10); // for encription of a password

const getProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        try {
          const { name, email, _id } = await User.findById(userData.id);
          res.json({ name, email, _id });
        } catch (error) {
          res.status(500).send(error)
        }
        
  
        
      });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json(`password is wrong`);
      }
    } else {
      res.json("not found");
    }
}

const logout = (req,res)=> {
    res.cookie("token", "").json(true)
}

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });
      res.json("Successfully registred");
    } catch (e) {
      res.status(422).json(e);
    }
}

module.exports = {getProfile, logout, register, login} 
