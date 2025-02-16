import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBAL_CONFIG } from '../components/global_config';

ACCESS_TOKEN_SECRET="aDUKq2sWYmm55SZhKSQNoz8V5n0xYgZ4VNj9IYj1iPGkhF3TFRnGUQBhlU4FpkFBUNqp0ZLEGcPUI53W5lbKGwnmz66kpizSAceHMQN1JdYkdCzu1HjMw8lSOm5qwSi2P9Bbp/8qTRM58QrucMmWaX7XsiryrEqqQayk7MWNUwPEcAAcouarg/aUOozPVC5EphikCl+6e5ioqNJHkrD6vCVVvmOVWYu6Ve+PcTwvS+4vYMqmdv7W5/n/g8hV/OP+gSAN/sF7rs9OFwWeH32i2XlVDnyAGvjP0FEje4O82OamcZEvmrmMRxJ8bb0cNXEkpSa13dWn3o60zZn8vY/lVQ=="
REFRESH_TOKEN_SECRET="glf/3K65bbltC7Os3e/uaklpzqmuKAh+I96jc9xECN9QSpglnVA1Ia5QfaU2M0oC5UNrFSQUSW2vjLMYGrjtV1AchPKgKCmUA7qY5iqBBcJJg+GBZ3duv5UkUhJyBeVGziXa0fXyF4ejF2WKUNEsOhOeKANUmtJE/7hr7HthDqyw/EMaTfPvfnj63pGUpslOmNoceHT0/4OHTZ+wFO"//br7kyZ3cH25ZBP/t2WDd2Icfdpbz5fDivGO+m91XV1OFkQ8P0x6GCs+hC74H72UODEFFsXJU588kSww8u0OS4bVsd10DZxcxZ4c/UBbGHXEag/Ufdpk7UvicfKuHd2IIIQ==
COOKIE_SECRET="p2jqw0Mo6WmCuoJI8EYwiB8SnvMA3840ExfiDhis6L1Ub/0Z82PWhdBMYR1UymoZ4OyUaQAODCiAfh2Fj7EoBeBsgNkZ8nD0zGjGSnSFJnWtvzMavPpKdzramGvO7aUs1TyJu/KNuByyLNqe0CgqlaEPf5rhP34D+NrB6Gr4OVMCUEMPTNhfZTnTtcEwFbhSl+Dg/PXTpm06vHwHI4Da3PT1RMnOlrWKV+QbF10WCj4DXoYghYPnyHUY7cvcCk5LxF8BISsuK/hvTD75Ya/7E/IaSctidIOzR0aWMBOxw8+OVS5Ghx7UivJFYYpYHoLmFK+6RsEtCD41gsu7KCmFAw=="

// Create an axios instance with default headers and base URL
const API = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: `https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users`, // Backend URL
  withCredentials: true,
});

let access_token = null;

// Function to refresh access token
const refreshAccessToken = async (uname) => {
  console.log("refreshing token");
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const response = await axios.post(`https://${GLOBAL_CONFIG.SYSTEM_IP}/api/Users/refresh`, { uname: uname, refreshToken: refreshToken });
    const { accessToken } = response.data;
    await AsyncStorage.setItem('access_token', access_token);
    // Save the new access token to memory or sessionStorage
    return accessToken;
  } catch (error) {
    console.log("Failed to refresh token:", error);
    return null;
  }
};

// Request interceptor to add authorization header
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    console.log("Token:", token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("token is there");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("error config:", error.config);
    if (error.response.status === 401 && !originalRequest._retry) {
      // If the error is due to an expired token, refresh it
      originalRequest._retry = true;
      try {
        let Uname = await AsyncStorage.getItem('uname');
        console.log("Uname:", Uname);
        const access_token = await refreshAccessToken(Uname);
        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        return await axios(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
