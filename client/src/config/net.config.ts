import config from "./app.json"
const {isDevelopment, API} = config
export default {
  API_URI: isDevelopment
    ? `http://localhost/api/v${API.VERSION}/`
    : `${API.URI}/v${API.VERSION}`,
};

 