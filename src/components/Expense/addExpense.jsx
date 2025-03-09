import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../loading';
import { addExpenseService } from '../../services/expenseServices';
import { getGroupDetailsService } from '../../services/groupServices';
import { useNavigation, useRoute } from '@react-navigation/native';
import AlertBanner from '../AlertBanner';
import MultiSelect from 'react-native-multiple-select';

export default function AddExpense() {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupCurrency, setGroupCurrency] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food & drink');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [expenseMembers, setExpenseMembers] = useState([]);
  const [expenseOwner, setExpenseOwner] = useState(null);
  const [expenseType, setExpenseType] = useState('Cash');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const multiSelect = useRef(null);

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
    const getGroupDetails = async () => {
      setLoading(true);
      try {
        const groupIdJson = { id: groupId };
        const response_group = await getGroupDetailsService(
          groupIdJson,
          setAlert,
          setAlertMessage
        );
        setGroupCurrency(response_group?.data?.group?.groupCurrency);
        const members = response_group?.data?.group?.groupMembers;
        setGroupMembers(members);
        const formattedMembers = members.map((email) => ({ id: email, name: email }));
        setExpenseMembers(formattedMembers);
        if (currentUser) {
          setExpenseOwner(currentUser);
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
        setAlert(true);
        setAlertMessage('Failed to fetch group details.');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) {
      getGroupDetails();
    }
  }, [groupId, currentUser]);

  const handleAddExpense = async () => {
    setLoading(true);
    try {
      const selectedMemberIds = expenseMembers.map((member) => member.id);
      const expenseData = {
        expenseName,
        expenseDescription,
        expenseAmount: parseFloat(expenseAmount),
        expenseCategory,
        expenseDate: expenseDate.toISOString(),
        expenseMembers: selectedMemberIds,
        expenseOwner,
        groupId,
        expenseType,
      };

      if (await addExpenseService(expenseData, setAlert, setAlertMessage)) {
        navigation.navigate('ViewGroupPage', { groupId });
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setAlert(true);
      setAlertMessage('Failed to add expense.');
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || expenseDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpenseDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const onSelectedItemsChange = (selectedItems) => {
    const formattedMembers = selectedItems.map((item) => ({ id: item, name: item }));
    setExpenseMembers(formattedMembers);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} />
      <Text style={styles.title}>Add Expense</Text>
      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />
      <TextInput
        style={styles.input}
        placeholder="Expense Description"
        multiline
        numberOfLines={2}
        value={expenseDescription}
        onChangeText={setExpenseDescription}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Expense Owner</Text>
        <Picker
          selectedValue={expenseOwner}
          onValueChange={(itemValue) => setExpenseOwner(itemValue)}
        >
          {groupMembers.map((member) => (
            <Picker.Item key={member} label={member} value={member} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Expense Members</Text>
        <MultiSelect
          hideTags
          items={groupMembers.map((member) => ({ id: member, name: member }))}
          uniqueKey="id"
          ref={multiSelect}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={expenseMembers.map((member) => member.id)}
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
        <View>{multiSelect.current?.getSelectedItemsExt(expenseMembers.map((member) => member.id))}</View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.currency}>{groupCurrency}</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="Expense Amount"
          keyboardType="numeric"
          value={expenseAmount}
          onChangeText={setExpenseAmount}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Expense Category</Text>
        <Picker
          selectedValue={expenseCategory}
          onValueChange={(itemValue) => setExpenseCategory(itemValue)}
        >
          <Picker.Item label="Food & drink" value="Food & drink" />
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Entertainment" value="Entertainment" />
          <Picker.Item label="Home" value="Home" />
          <Picker.Item label="Transportation" value="Transportation" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Payment Method</Text>
        <Picker
          selectedValue={expenseType}
          onValueChange={(itemValue) => setExpenseType(itemValue)}
        >
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Esewa" value="Esewa" />
          <Picker.Item label="Card" value="Card" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatepicker}>
        <Text style={styles.datePickerButtonText}>
          {expenseDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={expenseDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
        />
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.navigate('ViewGroupPage', { groupId })}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom:10,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    margnTop:30,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  currency: {
    marginRight: 5,
    fontSize: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
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