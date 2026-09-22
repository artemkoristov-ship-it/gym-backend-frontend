import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Переконайтеся, що baseURL вказує на вашу актуальну адресу бекенду
const client = axios.create({
  baseURL: 'http://localhost:5000/api', // Замініть на IP вашого сервера, якщо тестуєте на фізичному телефоні
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматичне підставлення JWT токена у кожен запит
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Помилка зчитування токена з AsyncStorage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;