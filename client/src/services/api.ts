import axios from "axios";
import net from "../config/net.config";

export default axios.create({
  baseURL: net.API_URI,
  method: "POST",
});
