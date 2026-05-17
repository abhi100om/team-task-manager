import axios from "axios";

const API = axios.create({
  baseURL: "team-task-manager-production-2966.up.railway.app",
});

export default API;