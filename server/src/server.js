require("dotenv").config();
require("events").defaultMaxListeners = 15;
const express = require("express"),
  app = express();
const PORT = 3000;
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const route = require("./app/routes");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cookieParser());
// app.use(logger("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const corsOptions = {
  // origin: function (origin, callback) {
  //   if (WHITELIST_DOMAIN.includes(origin)) {
  //     return callback(null, true);
  //   }
  //   return callback(new Error(`${origin} not allowed by our CORS policy`));
  // },
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const socketIo = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketIo.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected " + socket.id);

  // socketIo.emit("connect");

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

const db = require("./utils/db");
db.connectMDB();

app.use(route);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

server.listen(PORT, function () {
  console.log("Server started on: " + PORT);
});
