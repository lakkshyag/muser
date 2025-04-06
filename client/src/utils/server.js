import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:5000/server", // your backend base
  withCredentials: true, // if using cookies later
});

export default server;
