import axios from "axios";

export const axiosHttp = axios.create({
    baseURL: 'https://osthirchoice.vercel.app/api'
});


// export const axiosHttp = axios.create({
//     baseURL: 'https://osthirchoice.vercel.app/api'
// });