import { Platform } from 'react-native';

const LOCAL_IP = "http://192.168.1.149:8080"; // your laptop backend
const LOCALHOST = "http://localhost:8080";    // works only on laptop browser

const config = {
  API_BASE_URL: Platform.OS === "web" ? LOCALHOST : LOCAL_IP,

  SOCKET_URL: Platform.OS === "web" ? LOCALHOST : LOCAL_IP,

  ENVIRONMENT: 'development',

  DEBUG: true,
};

export default config;
