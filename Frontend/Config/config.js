import axios from "axios";

// const BASE_URL = "https://igniup.com/api";
const BASE_URL = "http://localhost:9000/api";

const ENDPOINTS = {
    create_db : `${BASE_URL}/sql/createDB`,
    delete_db : `${BASE_URL}/sql/DDBSES`,
    post_data : `${BASE_URL}/sql/postData`,
    get_data : `${BASE_URL}/sql/getDataBases`,
    get_tables: `${BASE_URL}/sql/getTables`,
    switch_db: `${BASE_URL}/sql/switchDB`
}

const createDB = async (id)=>{
    try {
        const response = await axios.post(ENDPOINTS.create_db, {id});
        return response
    } catch (error) {
        return error
    }
}

const dropDbs = async ()=>{
    try {
        const response = await axios.get(ENDPOINTS.delete_db)
        return response
    } catch (error) {
        return error
    }
}

const postData = async (data, db)=>{
    try {
        const response = await axios.post(ENDPOINTS.post_data, {data, db});
        if(response){
            return response
        }
    } catch (error) {
        return error
    }
}

// const getDataBases = async ()=>{
//     try {
//         const response = await axios.get(ENDPOINTS.get_data);
//         if(response){
//             return response
//         }
//     } catch (error) {
//         return error
//     }
// }

const getTables = async (db)=>{
    try {
        const response = await axios.get(ENDPOINTS.get_tables, {params: {db}})
        if(response){
            return response
        }
    } catch (error) {
        return error
    }
}

// const switchDB = async(database)=>{
//     try {
//         const response = await axios.post(ENDPOINTS.switch_db, {database}, {withCredentials: true});
//         if(response){
//             return response
//         }
//     } catch (error) {
//         return error
//     }
// }

export default {createDB, dropDbs, postData, getTables}
