import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://taskly-wiy0.onrender.com/api/v1',
  withCredentials: true, 
});

export default instance;
