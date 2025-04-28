require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const http = require("http")
const { Server } = require("socket.io")
const app = express();
const mysql = require('mysql2')
const os = require("os");
const crypto = require("crypto");




// 1. create hppt server for app
const server = http.createServer(app);
// 2. create io for socket
// const allowedOrigins = [
//     "http://51.24.30.180:8080",
//     "http://www.igniup.com",
//     "https://www.igniup.com",
//     "http://igniup.com",
//     "https://igniup.com"
// ]
const allowedOrigins = [
    "http://localhost:5173"
]

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error("Not Allowed by cors"))
            }
        }
    }
});

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());



require('./sockets/python_socket')(io)

app.use('/api/sql', require('./routes/sql_routes/index.js'))



app.get('/api/ping', (req, res) => {
    res.status(200).send("pong.")
})

const port = process.env.PORT || 9000
server.listen(port, '0.0.0.0', () => console.log(`Server started at port ${port}`))
