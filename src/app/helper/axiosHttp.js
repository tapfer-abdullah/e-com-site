import axios from "axios";

export const axiosHttp = axios.create({
    baseURL: 'https://odbhootstore.vercel.app/api'
});


// export const axiosHttp = axios.create({
//     baseURL: 'https://odbhootstore.vercel.app/api'
// });