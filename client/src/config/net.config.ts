import config from "./app.json"
const {isDevelopment, API} = config
export default {
  API_URI: isDevelopment
    ? `http://localhost:3000/api/v${API.VERSION}/`
    : `${API.URI}/v${API.VERSION}`,
};

 