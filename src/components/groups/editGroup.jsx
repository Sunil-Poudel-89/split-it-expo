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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../loading';
import { getEmailList } from '../../services/auth';
import { editGroupService, getGroupDetailsService } from '../../services/groupServices';
import AlertBanner from '../AlertBanner';
import { useNavigation, useRoute } from '@react-navigation/native';
import MultiSelect from 'react-native-multiple-select';

export const EditGroup = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState([]); // Initialize with an empty array
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupCurrency, setGroupCurrency] = useState('INR');
  const [groupCategory, setGroupCategory] = useState('Home');
  const [selectedMembers, setSelectedMembers] = useState([]); // Initialize with an empty array
  const [currentUser, setCurrentUser] = useState(null);
  const multiSelectRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const profile = JSON.parse(profileString);
          setCurrentUser(profile?.emailId);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const getEmails = async () => {
      setLoading(true);
      try {
        const response = await getEmailList();
        let list = response.data.user;
        if (currentUser && list.indexOf(currentUser) > -1) {
          list.splice(list.indexOf(currentUser), 1);
        }
        setEmailList(list);

        const groupIdJson = { id: groupId };
        const response_group = await getGroupDetailsService(
          groupIdJson,
          setAlert,
          setAlertMessage
        );
        const groupDetails = response_group?.data?.group;
        setGroupName(groupDetails?.groupName);
        setGroupDescription(groupDetails?.groupDescription);
        setSelectedMembers(groupDetails?.groupMembers || []); // Initialize with empty array if null
        setGroupCurrency(groupDetails?.groupCurrency);
        setGroupCategory(groupDetails?.groupCategory);
      } catch (error) {
        console.error('Error fetching group data:', error);
        setAlert(true);
        setAlertMessage('Failed to fetch group data.');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      getEmails();
    }
  }, [groupId, currentUser]);

  const handleEditGroup = async () => {
    setLoading(true);
    try {
      const groupData = {
        groupName,
        groupDescription,
        groupCurrency,
        groupCategory,
        groupOwner: currentUser,
        groupMembers: selectedMembers,
        id: groupId,
      };
      const create_response = await editGroupService(
        groupData,
        setAlert,
        setAlertMessage
      );
      if (create_response) {
        navigation.navigate('ViewGroupPage', { groupId });
      }
    } catch (error) {
      console.error('Error editing group:', error);
      setAlert(true);
      setAlertMessage('Failed to edit group.');
    } finally {
      setLoading(false);
    }
  };

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedMembers(selectedItems);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Group</Text>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} />

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
          items={emailList.map((email) => ({ id: email, name: email }))}
          uniqueKey="id"
          ref={multiSelectRef}
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
        <View>{multiSelectRef.current?.getSelectedItemsExt(selectedMembers)}</View>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Currency</Text>
        <Picker
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEditGroup}>
          <Text style={styles.buttonText}>Edit Group</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginTop:40
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});