import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEmailList } from '../../../services/auth';
import Loading from '../../loading';
import { createGroupService } from '../../../services/groupServices';
import AlertBanner from '../../AlertBanner';
import MultiSelect from 'react-native-multiple-select';
//import Iconify from '../../Iconify'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

export default function CreateGroup() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupCurrency, setGroupCurrency] = useState('NPR');
  const [groupCategory, setGroupCategory] = useState('Home');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const multiSelect = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const parsedProfile = JSON.parse(profileString);
          const userEmail = parsedProfile.emailId;
          setCurrentUser(userEmail);
          setSelectedMembers([userEmail]);
        }
        const response = await getEmailList();
        const list = response.data.user;
        const formattedList = list.map((email) => ({ id: email, name: email }));
        setEmailList(formattedList);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert('Error', 'Group name is required');
      return;
    }
    const groupData = {
      groupName,
      groupDescription,
      groupCurrency,
      groupCategory,
      groupMembers: selectedMembers,
      groupOwner: currentUser,
    };
    try {
      const create_response = await createGroupService(
        groupData,
        setAlert,
        setAlertMessage
      );
      console.log('Equinox', create_response);
      navigation.navigate('ViewGroupPage', {
        groupId: create_response.data.Id ?? '',
      });
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
    }
  };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedMembers(selectedItems);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          < Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Group</Text>
      </View>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="Group Description"
        multiline
        numberOfLines={4}
        value={groupDescription}
        onChangeText={setGroupDescription}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Group Members</Text>
        <MultiSelect
          hideTags
          items={emailList}
          uniqueKey="id"
          ref={multiSelect}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={selectedMembers}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={(text) => console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        <View>{multiSelect.current?.getSelectedItemsExt(selectedMembers)}</View>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Currency</Text>
        <Picker
          style={styles.picker}
          selectedValue={groupCurrency}
          onValueChange={(itemValue) => setGroupCurrency(itemValue)}
        >
          <Picker.Item label="₹ NPR" value="NPR" />
          <Picker.Item label="$ USD" value="USD" />
          <Picker.Item label="€ EUR" value="EUR" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Category</Text>
        <Picker
          style={styles.picker}
          selectedValue={groupCategory}
          onValueChange={(itemValue) => setGroupCategory(itemValue)}
        >
          <Picker.Item label="Home" value="Home" />
          <Picker.Item label="Trip" value="Trip" />
          <Picker.Item label="Office" value="Office" />
          <Picker.Item label="Sports" value="Sports" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 150,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
  },
});