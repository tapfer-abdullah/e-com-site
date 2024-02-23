import axios from "axios";

export const axiosHttp = axios.create({
    baseURL: 'http://localhost:3000/api'
});