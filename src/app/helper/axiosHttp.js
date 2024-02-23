import axios from "axios";

export const axiosHttp = axios.create({
    baseURL: 'https://e-com-site-obs.vercel.app/api'
});

// export const axiosHttp = axios.create({
//     baseURL: 'http://localhost:3000/api'
// });