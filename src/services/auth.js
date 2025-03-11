import * as api from "../api/index";
// import configData from '../config.json';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { registerPushToken } from '../services/pushNotificationService';
// Example usage in a component
import { useNavigation } from "@react-navigation/native";

function LoginScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    login(formData, setShowAlert, setAlertMessage, navigation);
  };
}

export const login = async (
  formData,
  setShowAlert,
  setAlertMessage,
  navigation
) => {
  try {
    const { data } = await api.loginIn(formData);
    await AsyncStorage.setItem("profile", JSON.stringify(data));
    await registerPushToken(formData.emailId);
    // Replace window.location with React Navigation
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "DashboardHome" }],
      })
    );
    return data;
  } catch (err) {
    console.log("Errr", err)
    setShowAlert(true);
    err.response && (err.response.status === 400 || err.response.status === 401)
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const register = async (
  formData,
  setShowAlert,
  setAlertMessage,
  navigation
) => {
  try {
    // registering user to the DB
    const { data } = await api.register(formData);
    login(formData, setShowAlert, setAlertMessage, navigation);
    return data;
  } catch (err) {
    setShowAlert(true);
    err.response && (err.response.status === 400 || err.response.status === 401)
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const logout = async (navigation) => {
  await AsyncStorage.removeItem("profile");
  // Replace window.location with React Navigation
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "" }],
    })
  );
};

export const getUser = async (formData, setShowAlert, setAlertMessage) => {
  try {
    const data = await api.getUser(formData);
    return data;
  } catch (err) {
    setShowAlert(true);
    err.response && (err.response.status === 400 || err.response.status === 401)
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const getEmailList = async () => {
  try {
    const data = await api.getEmailList();
    return data;
  } catch (err) {
    return null;
  }
};

export const deleteUser = async (
  data,
  setShowAlert,
  setAlertMessage,
  navigation
) => {
  try {
    const response = await api.deleteUser(data);
    await AsyncStorage.removeItem("profile");
    // Replace window.location with React Navigation
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "" }],
      })
    );
  } catch (err) {
    setShowAlert(true);
    err.response && (err.response.status === 400 || err.response.status === 401)
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const updatePassword = async (
  formData,
  setShowAlert,
  setAlertMessage,
  showHomeAlert,
  homeAlertMessage
) => {
  try {
    const { data } = await api.updatePassword(formData);
    showHomeAlert(true);
    homeAlertMessage("Password Updated Successfully!");
    return true;
  } catch (err) {
    setShowAlert(true);
    err.response && (err.response.status === 400 || err.response.status === 401)
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const editUser = async (
  formData,
  setShowAlert,
  setAlertMessage,
  showHomeAlert,
  homeAlertMessage
) => {
  try {
    const { data } = await api.editUser(formData);
    showHomeAlert(true);
    homeAlertMessage("User Updated Successfully!");
    return true;
  } catch (err) {
    setShowAlert(true);
    err.response && (err.response.status === 400 || err.response.status === 401)
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};
