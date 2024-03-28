require("dotenv").config();
require("events").defaultMaxListeners = 15;
const express = require("express"),
  app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const route = require("./app/routes");

app.use(cookieParser());
app.use(logger("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const corsOptions = {
  // origin: function (origin, callback) {
  //   if (WHITELIST_DOMAIN.includes(origin)) {
  //     return callback(null, true);
  //   }
  //   return callback(new Error(`${origin} not allowed by our CORS policy`));
  // },
  origin:"http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const db = require("./config/db");
db.connectMDB();

app.use(route);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(PORT, function () {
  console.log("Server started on: " + PORT);
});

const http = require("http");
const socket = require("socket.io");
const { WHITELIST_DOMAIN } = require("./utils/constants");
const server = http.createServer(app);
const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
});
