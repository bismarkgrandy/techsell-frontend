import axios from "axios";


// export const axiosInstance = axios.create({
    
//     baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api",

//     withCredentials: true

// })

export const axiosInstance = axios.create({
    baseURL: "https://techsell-backend.onrender.com/api" || "http://localhost:3000/api",
    withCredentials: true
});