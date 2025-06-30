import axios from "axios";

// const BASE_URL = "https://igniup.com/api";
const BASE_URL = "http://localhost:9000/api";

const ENDPOINTS = {
  createUser: `${BASE_URL}/authentication/signup`,
  loginUser: `${BASE_URL}/authentication/signin`,
  me: `${BASE_URL}/authentication/me`,
  profile: `${BASE_URL}/authentication/profile`,

  create_db: `${BASE_URL}/sql/createDB`,
  refresh_tbs: `${BASE_URL}/sql/ref_tabs`,
  delete_db: `${BASE_URL}/sql/DDBSES`,
  post_data: `${BASE_URL}/sql/postData`,
  get_data: `${BASE_URL}/sql/getDataBases`,
  get_tables: `${BASE_URL}/sql/getTables`,
  switch_db: `${BASE_URL}/sql/switchDB`,

  getAvatars: `${BASE_URL}/noCode/getAvatars`,
  selectAvatar: `${BASE_URL}/noCode/selAvatar`,

  addBadge: `${BASE_URL}/noCode/admin/addBadge`,
  addAvatar: `${BASE_URL}/noCode/admin/addAvatar`,
};

const createUser = async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.createUser, data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    return error;
  }
};

const loginUser = async (data) => {
  // console.log(data)
  try {
    const response = await axios.post(ENDPOINTS.loginUser, data, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    return error;
  }
};

const me = async () => {
  try {
    const response = await axios.get(ENDPOINTS.me, { withCredentials: true });
    return response;
  } catch (error) {
    return error;
  }
};

const getProfile = async (userId) => {
  try {
    const response = await axios.get(`${ENDPOINTS.profile}?user=${userId}`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    return error;
  }
};

const createDB = async (id) => {
  try {
    const response = await axios.post(ENDPOINTS.create_db, { id });
    return response;
  } catch (error) {
    return error;
  }
};

const refreshTables = async (db_id) => {
  try {
    const response = await axios.get(ENDPOINTS.refresh_tbs, {
      params: { db_id },
    });
    return response;
  } catch (error) {
    return error;
  }
};

const dropDbs = async () => {
  try {
    const response = await axios.get(ENDPOINTS.delete_db);
    return response;
  } catch (error) {
    return error;
  }
};

const postData = async (data, db) => {
  // console.log(data, db)
  try {
    const response = await axios.post(
      ENDPOINTS.post_data,
      { data, db },
      { withCredentials: true }
    );
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

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

const getTables = async (db) => {
  try {
    const response = await axios.get(ENDPOINTS.get_tables, { params: { db } });
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

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

// ---------------------------------------------------------------------------------------

const getAvatars = async () => {
  try {
    const response = await axios.get(ENDPOINTS.getAvatars, {withCredentials: true});
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const selectAvatar = async (data) => {
  try {
    const response = await axios.put(ENDPOINTS.selectAvatar, data, {withCredentials: true});
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};



const addBadge = async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.addBadge, data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

const addAvatar = async (data) => {
  try {
    const response = await axios.post(ENDPOINTS.addAvatar, data, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    if (response) {
      return response;
    }
  } catch (error) {
    return error;
  }
};

export default {
  createUser,
  loginUser,
  me,
  getProfile,
  createDB,
  dropDbs,
  postData,
  getTables,
  refreshTables,

  getAvatars,
  selectAvatar,

  addBadge,
  addAvatar,
};
