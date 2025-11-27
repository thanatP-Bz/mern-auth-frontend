import axios from "axios";

const taskApi = axios.create({
  baseURL: "http://localhost:4004/api/task",
  headers: {
    "Content-Type": "application/json",
  },
});

export default taskApi;
