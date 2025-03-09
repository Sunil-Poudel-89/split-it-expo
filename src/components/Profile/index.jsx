import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '../loading';
import AlertBanner from '../AlertBanner';
import { deleteUser, getUser, editUser } from '../../services/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [changePass, setChangePass] = useState(false);
  const [editUserState, setEditUserState] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const profile = JSON.parse(profileString);
          const response = await getUser(profile, setShowAlert, setAlertMessage);
          setUser(response.data.user);
          setFirstName(response.data.user.firstName);
          setLastName(response.data.user.lastName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setShowAlert(true);
        setAlertMessage('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDelete = async () => {
    await deleteUser(user, setShowAlert, setAlertMessage);
    setDeleteConfirm(false);
    navigation.navigate('Login');
  };

  const handleEdit = async () => {
    try {
      const profileString = await AsyncStorage.getItem('profile');
      if (profileString) {
        const profile = JSON.parse(profileString);
        const updatedUser = {
          ...user,
          firstName,
          lastName,
        };
        await editUser(updatedUser, setShowAlert, setAlertMessage);
        setUser(updatedUser);
        setEditUserState(false);
      }
    } catch (error) {
      console.error('Error editing user:', error);
      setShowAlert(true);
      setAlertMessage('Failed to edit user.');
    }
  };

  const handleChangePassword = async () => {
    try {
      const profileString = await AsyncStorage.getItem('profile');
      if (profileString) {
        const profile = JSON.parse(profileString);
        await changePassword(user.emailId, password, setShowAlert, setAlertMessage);
        setPassword('');
        setChangePass(false);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setShowAlert(true);
      setAlertMessage('Failed to change password.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await updateProfilePicture(user.emailId, result.assets[0].uri, setShowAlert, setAlertMessage);
      setUser({ ...user, profilePicture: result.assets[0].uri });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('profile');
      // Correctly navigate to the "LoginPage"
      navigation.navigate('LoginPage'); 
    } catch (error) {
      console.error('Error logging out:', error);
      setShowAlert(true);
      setAlertMessage('Failed to log out.');
    } finally {
      setLogOut(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Text>User data not available.</Text>;
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>User Profile</Text>
        <AlertBanner showAlert={showAlert} alertMessage={alertMessage} />

        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          <Image
            source={{ uri: user.profilePicture || "https://res.cloudinary.com/tuzup/image/upload/v1658929366/SplitApp/user_l7xmft.png" }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          {editUserState ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
              <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setEditUserState(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : changePass ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setChangePass(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text>First Name: {user.firstName}</Text>
              <Text>Last Name: {user.lastName}</Text>
              <Text>Email: {user.emailId}</Text>
              <TouchableOpacity style={styles.button} onPress={() => setEditUserState(true)}>
                <Text style={styles.buttonText}>Edit Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setChangePass(true)}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setDeleteConfirm(true)}>
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setLogOut(true)}>
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Modal visible={deleteConfirm} onRequestClose={() => setDeleteConfirm(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            <Text>Are you sure you want to delete your account?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setDeleteConfirm(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={logOut} onRequestClose={() => setLogOut(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text>Are you sure you want to log out?</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Text>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setLogOut(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Profile;