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
    
            if (output.endsWith("INPUT_REQUEST")) {
                const promptMessage = output.replace("INPUT_REQUEST", "");
                socket.emit("userInput", promptMessage);
    
                socket.once("userEntry", (userInput) => {
                    pyProcess.stdin.write(userInput + "\n");
                });
            } else {
                if (output) {
                    socket.emit("pyResponse", output);
                }
            }
        });
    
        pyProcess.stderr.on("data", (data) => {
            socket.emit("pyResponse", "Error: " + data.toString());
        });
    
        pyProcess.on("close", (code) => {
            console.log("Python process exited with code:", code);
            socket.emit("EXIT_SUCCESS", "EXIT_SUCCESS"); 
        });
    };
    

    socket.on("disconnect", () => {
        console.log("disconnected user:", socket.id);
    });
});


app.post('/api/createDB', async (req, res) => {
    const unq_id = req.body.id;
    if (!unq_id) {
        const unique_id = crypto.randomUUID();
        if (!unique_id) {
            return res.status(400).send("unique id not found");
        }
        const hash = crypto.createHash("md5").update(unique_id).digest("hex").slice(0, 8);

        connection.query(`CREATE DATABASE IF NOT EXISTS ${hash}`, (err, result) => {
            if (err) {
                return res.send(err)
            } else {
                return res.status(200).send(hash)
            }
        })
    } else {
        // console.log(unq_id)
        connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [unq_id], (err, result) => {
            if (err) {
                const unique_id = crypto.randomUUID();
                if (!unique_id) {
                    return res.status(400).send("unique id not found");
                }
                const hash = crypto.createHash("md5").update(unique_id).digest("hex").slice(0, 8);

                connection.query(`CREATE DATABASE IF NOT EXISTS ${hash}`, (err, result) => {
                    if (err) {
                        return res.send(err)
                    } else {
                        return res.status(200).send(hash)
                    }
                })
            } else {
                res.send(unq_id)
                
            }
        })
    }



})


app.post('/api/postData', async (req, res) => {

    try {
        const { data } = req.body;
        const { db } = req.body
        if (!data || !db) {
            return res.status(400).json({ error: "SQL script is required. || databse name is required" });
        }
        connection.query(`use ${db};`, (err, result) => {
            if (err) {
                return res.send(err)
            } else {
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
            connection.query(query, [db_name], (err, result) => {
                if (err) {
                    res.send(err)
                } else {
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


app.get('/api/DDBSES', (req, res)=>{
    const systemDatabases = ["information_schema", "mysql", "performance_schema", "sys"];
    connection.query("SHOW DATABASES", (err, results) => {
        if (err) {
            return res.status(500).send("Error fetching databases: " + err.message);
        }

        const databases = results.map(db => db.Database).filter(db => !systemDatabases.includes(db));

        if (databases.length === 0) {
            return res.send("No user-created databases to drop");
        }

        const dropQueries = databases.map(db => `DROP DATABASE \`${db}\`;`).join(" ");

        connection.query(dropQueries, (dropErr) => {
            if (dropErr) {
                return res.send("Error dropping databases: " + dropErr.message);
            }
            res.send(`Dropped databases: ${databases.join(", ")}`);
        });
    });
})

app.get('/api/ping', (req, res) => {
    res.status(200).send("pong.")
})

const port = process.env.PORT || 9000
server.listen(port, '0.0.0.0', () => console.log(`Server started at port ${port}`))
