require("dotenv").config();
require("events").defaultMaxListeners = 15;
const express = require("express"),
  app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

app.use(cookieParser());
app.use(logger("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const db = require("./config/db");
db.connectMDB();

const route = require("./app/routes");
app.use(route);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port);
console.log("Server started on: " + port);
