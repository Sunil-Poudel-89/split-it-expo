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
import { editExpenseService, getExpDetailsService } from '../../services/expenseServices';
import { getGroupDetailsService } from '../../services/groupServices';
import Loading from '../loading';
import { useNavigation, useRoute } from '@react-navigation/native';
import AlertBanner from '../AlertBanner';
import MultiSelect from 'react-native-multiple-select';

export default function EditExpense() {
  const navigation = useNavigation();
  const route = useRoute();
  const { expenseId } = route.params;

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [groupMembers, setGroupMembers] = useState(); // Initialize as an empty array
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food & drink');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [expenseMembers, setExpenseMembers] = useState(); // Initialize as an empty array
  const [expenseOwner, setExpenseOwner] = useState(null);
  const [expenseType, setExpenseType] = useState('Cash');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const multiSelectRef = useRef(null);

  useEffect(() => {
    const getExpenseDetails = async () => {
      setLoading(true);
      try {
        const expenseIdJson = { id: expenseId };
        const response_exp = await getExpDetailsService(
          expenseIdJson,
          setAlert,
          setAlertMessage
        );
        setExpenseDetails(response_exp?.data?.expense);
        const exp = response_exp?.data?.expense;

        const groupIdJson = { id: response_exp?.data?.expense?.groupId };
        const response_group = await getGroupDetailsService(
          groupIdJson,
          setAlert,
          setAlertMessage
        );

        // Check if groupMembers exists in the response
        if (response_group && response_group.data && response_group.data.group && response_group.data.group.groupMembers) {
          setGroupMembers(response_group.data.group.groupMembers);
        } else {
          // Handle the case where groupMembers is not found
          console.warn('groupMembers not found in API response:', response_group);
          // You might want to set an error message or take other actions here
        }

        setExpenseName(exp?.expenseName);
        setExpenseDescription(exp?.expenseDescription);
        setExpenseOwner(exp?.expenseOwner);
        setExpenseMembers(exp?.expenseMembers);
        setExpenseAmount(String(exp?.expenseAmount));
        setExpenseCategory(exp?.expenseCategory);
        setExpenseDate(new Date(exp?.expenseDate));
        setExpenseType(exp?.expenseType);
      } catch (error) {
        console.error('Error fetching expense details:', error);
        setAlert(true);
        setAlertMessage('Failed to fetch expense details.');
      } finally {
        setLoading(false);
      }
    };
    getExpenseDetails();
  }, [expenseId]);

  const handleEditExpense = async () => {
    setLoading(true);
    try {
      const expenseData = {
        expenseName,
        expenseDescription,
        expenseAmount: parseFloat(expenseAmount),
        expenseCategory,
        expenseDate: expenseDate.toISOString(),
        expenseMembers,
        expenseOwner,
        groupId: expenseDetails?.groupId,
        expenseType,
        id: expenseDetails?._id,
      };

      if (await editExpenseService(expenseData, setAlert, setAlertMessage)) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error editing expense:', error);
      setAlert(true);
      setAlertMessage('Failed to edit expense.');
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
    setExpenseMembers(selectedItems);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      <AlertBanner showAlert={alert} alertMessage={alertMessage} />
      <Text style={styles.title}>Edit Expense</Text>
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
          {/* Conditionally render Picker items if groupMembers is available */}
          {groupMembers && groupMembers.map((member) => (
            <Picker.Item key={member} label={member} value={member} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Expense Members</Text>
        <MultiSelect
          hideTags
          // Conditionally render MultiSelect items if groupMembers is available
          items={groupMembers && groupMembers.map((member) => ({ id: member, name: member }))}
          uniqueKey="id"
          ref={multiSelectRef}
          onSelectedItemsChange={onSelectedItemsChange}
          selectedItems={expenseMembers}
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
        <View>
          {/* Conditionally render selected members if expenseMembers is available */}
          {expenseMembers && expenseMembers.map((memberId) => (
            <Text key={memberId}>{memberId}</Text>
          ))}
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.currency}>
          {expenseDetails?.expenseCurrency}
        </Text>
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
          <Picker.Item label="Esewa " value="Esewa " />
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleEditExpense}>
          <Text style={styles.buttonText}>Edit</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
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