const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const User = require("./src/models/User");
const cookieParser = require("cookie-parser");



const imageDownloader = require("image-downloader"); 




const PlaceRoutes = require("./src/routes/Place.route")

app.use(PlaceRoutes)

require("dotenv").config(); // ЗАЧЕМ НУЖЕН ВЫЯСНИТЬ

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "sdafadfgjiaFDJA/;dfAJNKD;Nask";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect(`mongodb://127.0.0.1:27017/airbnb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ name, email, password });
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
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
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);

      res.json({ name, email, _id });
    });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// app.post("/upload-by-link", async (req, res) => {
//   const { link } = req.body;
//   const newName = "photo_" + Date.now() + ".jpg";
//   try {
//     await imageDownloader.image({
//       url: link,
//       dest: __dirname + "/uploads/" + newName,
//     });
//     res.json(newName);
//   } catch (error) {
//     console.log(error);
//   }
// });


app.listen(4000);
