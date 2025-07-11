require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const { spawnSync,spawn } = require('child_process');
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const mysql = require("mysql2");
const os = require("os");
const crypto = require("crypto");
const path = require("path");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");

// 1. create hppt server for app
const server = http.createServer(app);
// 2. create io for socket
const allowedOrigins = [
    "http://168.231.116.169:8080",
    "http://www.igniup.com",
    "https://www.igniup.com",
    "http://igniup.com",
    "https://igniup.com"
]
// const allowedOrigins = ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by cors"));
      }
    },
    credentials: true,
  },
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/temps", express.static(path.join(__dirname, "temps")));

// console.log(process.env.PATH);

require("./sockets/python_socket")(io);

app.use("/api/sql", require("./routes/sql_routes/index.js"));

app.use("/api/authentication", require("./routes/authentication/index.js"));

app.use("/api/noCode", require("./routes/no_code_routes"));

app.get("/api/ping", (req, res) => {
  res.status(200).send("pong.");
});

mongoose
  .connect(process.env.DATABASE_URI)
  .then((result) => {
    const port = process.env.PORT || 9000;
    server.listen(port, "0.0.0.0", () => {
      console.log("connected to database");
      console.log(`app listenning on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
