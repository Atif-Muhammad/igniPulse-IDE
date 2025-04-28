const connection = require('../utils');
const crypto = require("crypto");

exports.deleteDDBSES = async (req, res) => {
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
    })
}

exports.createDB = async (req, res) => {
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
        connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [unq_id], (err, result) => {
            // console.log(result)
            if (result.length > 0) {
                res.send(unq_id)

            } else {
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

            }
        })
    }
}

exports.postData = async (req, res) => {

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
}

// exports.getDBS = async  (req, res) => {
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
// }

exports.getTables = async (req, res) => {
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
                SELECT 
                    t.TABLE_NAME,
                    t.CREATE_TIME,
                    c.COLUMN_NAME,
                    c.DATA_TYPE
                FROM INFORMATION_SCHEMA.TABLES t
                JOIN INFORMATION_SCHEMA.COLUMNS c 
                    ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
                WHERE t.TABLE_SCHEMA = ?
                ORDER BY t.CREATE_TIME DESC, c.ORDINAL_POSITION ASC;
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

}

// exports.switchDB = async (req, res) => {
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
// }
