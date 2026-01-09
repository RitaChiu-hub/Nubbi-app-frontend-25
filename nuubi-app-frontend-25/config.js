const isProd = process.env.NODE_ENV === "production";

const LOCAL_API = "http://localhost:8080";
const PROD_API = "https://coral-app-n96bn.ondigitalocean.app";

export const API_URL = isProd ? PROD_API : LOCAL_API;