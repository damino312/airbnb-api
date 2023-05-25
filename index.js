const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const User = require("./models/User");
require("dotenv").config(); // ЗАЧЕМ НУЖЕН ВЫЯСНИТЬ

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose
  .connect(`mongodb://127.0.0.1:27017/airbnb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Другие параметры конфигурации...
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Здесь вы можете начать слушать сервер или выполнять другие операции
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });

app.get("/test", (req, res) => {
  res.json("test ok");
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

app.listen(4000);
