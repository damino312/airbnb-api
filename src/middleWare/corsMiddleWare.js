const cors = require("cors");

const corsOptions = {
  credentials: true,
  origin: "http://localhost:5173",
};
const corsMiddleware = (req, res, next) => { // figure it out
  cors(corsOptions)(req, res, next);
};

module.exports = corsMiddleware;