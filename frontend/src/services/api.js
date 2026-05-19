import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-production-2966.up.railway.app/api",
});

export default API;