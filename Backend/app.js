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
const cookieParser = require("cookie-parser")




// 1. create hppt server for app
const server = http.createServer(app);
// 2. create io for socket
const allowedOrigins = [
    "http://51.24.30.180:8080", 
    "http://www.igniup.com",   
    "https://www.igniup.com",  
    "http://igniup.com",       
    "https://igniup.com"
]
// const allowedOrigins = [
//     "http://localhost:5173"
// ]

const io = new Server(server, {
    cors: {
        origin: (origin, callback)=>{
            if(!origin || allowedOrigins.includes(origin)){
                callback(null, true)
            }else{
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
app.use(cookieParser())

const connection = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    multipleStatements: true
})


io.on("connection", (socket) => {
    console.log("connection established with user:", socket.id);

    socket.on("runPy", (data) => {
        const modifiedCode = `
import builtins
original_input = builtins.input
def custom_input(prompt=""):
    print(prompt + " INPUT_REQUEST", flush=True)  
    return original_input()
builtins.input = custom_input
${data}
`;

        execPy(socket, modifiedCode);
    });

    const execPy = (socket, code) => {
        const pyProcess = spawn("python3", ["-c", code]);
        
        pyProcess.stdout.on("data", (data) => {
            const output = data.toString().trim();
            // console.log("Python Output:", output);

            if (output.endsWith("INPUT_REQUEST")) {
                // Extract only the prompt part
                const promptMessage = output.replace("INPUT_REQUEST", "");
                socket.emit("userInput", promptMessage);
                // console.log(promptMessage)

                // Listen for user input dynamically
                socket.once("userEntry", (userInput) => {
                    // console.log("User Input:", userInput);
                    pyProcess.stdin.write(userInput + "\n");
                });
            } else {
                // Send normal Python output
                socket.emit("pyResponse", output);
            }
        });

        pyProcess.stderr.on("data", (data) => {
            socket.emit("pyResponse", "Error: " + data.toString());
        });

        pyProcess.on("close", (code) => {
            console.log("Python process exited with code:", code);
            // socket.emit("pyResponse", `Process exited with code ${code}`);
        });
    };

    socket.on("disconnect", () => {
        console.log("disconnected user:", socket.id);
    });
});

function getClientMacAddress() {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
      for (const config of interfaces[iface]) {
        if (!config.internal && config.mac !== "00:00:00:00:00:00") {
          return config.mac; 
        }
      }
    }
    return null; 
}

app.post('/api/createDB', async (req, res)=>{
    const macAddress = getClientMacAddress();
    if (!macAddress) {
        return res.status(400).send("MAC address not found");
    }
    const hash = crypto.createHash("md5").update(macAddress).digest("hex").slice(0, 8);
    
    connection.query(`CREATE DATABASE IF NOT EXISTS ${hash}`, (err, result)=>{
        if(err){
            return res.send(err)
        }else{
            res.status(200).send(hash)
        }
    })

})


app.post('/api/postData', async (req, res) => {
   
    try {
        const { data } = req.body;
        const {db} = req.body
        if (!data || !db) {
            return res.status(400).json({ error: "SQL script is required. || databse name is required" });
        }
        connection.query(`use ${db};`, (err, result)=>{
            if(err){
                return res.send(err)
            }else{
                connection.query(data, (err, result) => {
                    if (err) {
                        res.send(err)
                    } else {
                        // console.log(result[0])
                        res.json({ success: true, result });
        
                    }
                })
            }
        })
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// app.get('/api/getDataBases', async (req, res) => {
//     const {db} = req.body;
//     if (!db) {
//         return res.status(400).json({ error: "databse name is required" });
//     }

//     connection.query(`use ${db};`, (err, result)=>{
//         if(err){
//             return res.send(err)
//         }else{
//             connection.query("show databases", (err, result) => {
//                 if (err) {
//                     res.send(err)
//                 } else {
//                     res.send(result.map((database) => {

//                         return database.Database
//                     }))
//                 }
//             })
//         }
//     })
// })


app.get('/api/getTables', async (req, res) => {
    const db_name = req.query.db;
    // connection.connect((err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log("connected to mysql")
    //     }
    // })
  
    connection.query(`use ${db_name};`, (err, result) => {
        if (err) {
            res.send(err)
        } else {
            const query = `
                SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = ?;
            `
            connection.query(query, [db_name], (err, result)=>{
                if(err){
                    res.send(err)
                }else{
                    res.send(result)
                }
            })
        }
    })

})

// app.post('/api/switchDB', async (req, res) => {
//     // connection.connect((err) => {
//     //     if (err) {
//     //         console.log(err)
//     //     } else {
//     //         console.log("connected to mysql")
//     //     }
//     // })
//     try {
//         connection.query(`use ${req.body.database};`, (err, result) => {
//             if (err) {
//                 return res.send(err);
//             } else {
//                 res.send(result)
//             }
//         })
//     } catch (error) {
//         res.send(error)
//     }
// })

app.get(('/api/ping', (req, res)=>{
    res.status(200).send("pong.")
}))

const port = process.env.PORT || 9000
server.listen(port,'0.0.0.0',() => console.log(`Server started at port ${port}`))
