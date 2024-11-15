require("dotenv").config();
require("events").defaultMaxListeners = 15;
const express = require("express");
const PORT = 3000;
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const route = require("./app/routes");
const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const SocketIoService = require("./app/socket.io");
const jwt = require("jsonwebtoken");

const io = new Server(server, {
  cors: {
    origin: process.env.DOMAIN_CLIENT,
  },
  credentials: true,
  transports: ["websocket"],
});

global._io = io;

app.use(cookieParser());
// app.use(logger("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const corsOptions = {
  origin: process.env.DOMAIN_CLIENT,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const db = require("./utils/db");
db.connectMDB();

app.use(route);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

// io.use((socket, next) => {
//   const accessToken = socket.handshake.auth?.accessToken;
//   try {
//     if (!accessToken) return next(new Error("NOT AUTHORIZED"));
//     const decoded = jwt.verify(accessToken, process.env.AC_PRIVATE_KEY);
//     socket.user = decoded;
//   } catch (err) {
//     console.log("err: ", "caca");
//     return next(new Error("NOT AUTHORIZED"));
//   }
//   next();
// });

io.on("connection", SocketIoService.connect);

server.listen(PORT, function () {
  console.log("Server started on: " + PORT);
});
