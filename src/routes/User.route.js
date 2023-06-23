const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const corsMiddleware = require("../middleWare/corsMiddleWare");
const UserController = require("../controllers/User.controller")

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/profile", UserController.getProfile);

app.post("/logout", UserController.logout);

app.post("/register", UserController.register);

app.post("/login", UserController.login);
module.exports = app