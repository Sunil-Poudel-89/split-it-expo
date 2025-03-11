import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const baseUrl = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3001' // Replace with your server port
  : 'http://localhost:3001';

const API = axios.create({ baseURL: "https://splitit-5ef8.onrender.com" });

// Function to get the access header with token from AsyncStorage
const getAccessHeader = async () => {
  try {
    const profileString = await AsyncStorage.getItem('profile');
    if (profileString) {
      const profile = JSON.parse(profileString);
      if (profile && profile.accessToken) {
        return {
          headers: {
            Authorization: `token ${profile.accessToken}`,
          },
        };
      }
    }
    return { headers: {} }; // Return empty headers if no token found
  } catch (error) {
    console.error('Error getting access header:', error);
    return { headers: {} }; // Return empty headers in case of an error
  }
};

export const loginIn = (formData) => API.post('/api/users/v1/login', formData);

export const register = (formData) => API.post('/api/users/v1/register', formData);

export const deleteUser = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.delete('/api/users/v1/delete', {
    headers: accessHeader.headers,
    data: formData,
  });
};

export const updatePassword = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/users/v1/updatePassword', formData, accessHeader);
};

export const getUser = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/users/v1/view', formData, accessHeader);
};

export const editUser = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/users/v1/edit', formData, accessHeader);
};

export const getUserGroups = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/group/v1/user', formData, accessHeader);
};

export const getEmailList = async () => {
  const accessHeader = await getAccessHeader();
  return API.get('/api/users/v1/emailList', accessHeader);
};

export const createGroup = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/group/v1/add', formData, accessHeader);
};

export const editGroup = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/group/v1/edit', formData, accessHeader);
};

export const getGroupDetails = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/group/v1/view', formData, accessHeader);
};

export const getGroupExpense = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/group', formData, accessHeader);
};

export const addExpense = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/add', formData, accessHeader);
};

export const editExpense = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/edit', formData, accessHeader);
};

export const deleteExpense = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.delete('/api/expense/v1/delete', {
    headers: accessHeader.headers,
    data: formData,
  });
};

export const getGroupCategoryExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/group/categoryExp', formData, accessHeader);
};

export const getGroupMonthlyExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/group/monthlyExp', formData, accessHeader);
};

export const getGroupDailyExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/group/dailyExp', formData, accessHeader);
};

export const getUserExpense = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/user', formData, accessHeader);
};

export const getUserMonthlyExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/user/monthlyExp', formData, accessHeader);
};

export const getUserDailyExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/user/dailyExp', formData, accessHeader);
};

export const getUserCategoryExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/user/categoryExp', formData, accessHeader);
};

export const getRecentUserExp = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/user/recent', formData, accessHeader);
};

export const getExpDetails = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/expense/v1/view', formData, accessHeader);
};

export const getSettle = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/group/v1/settlement', formData, accessHeader);
};

export const makeSettle = async (formData) => {
  const accessHeader = await getAccessHeader();
  return API.post('/api/group/v1/makeSettlement', formData, accessHeader);
};

export const registerDeviceToken = async (email, token, platform) => {
  try {
    const response = await API.post(`${API_URL}/notifications/v1/register-token`, {
      email,
      token,
      platform,
    });
    return response.data;
  } catch (error) {
    console.error('Error registering device token:', error);
    throw error;
  }
};