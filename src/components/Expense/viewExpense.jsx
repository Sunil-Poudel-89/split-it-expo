import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExpDetailsService } from '../../services/expenseServices';
import Loading from '../loading';
import AlertBanner from '../AlertBanner';
import { convertToCurrency, currencyFind } from '../../utils/helper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

export const ViewExpense = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { expenseId } = route.params;

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [expenseDetails, setExpenseDetails] = useState(null);
  const [expenseDate, setExpenseDate] = useState('');

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
        const date = new Date(
          response_exp?.data?.expense?.expenseDate
        ).toDateString();
        setExpenseDate(date);
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

  if (loading) {
    return <Loading />;
  }

  if (!expenseDetails) {
    return (
      <View style={styles.container}>
        <Text>Expense details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AlertBanner severity="error" alertMessage={alertMessage} showAlert={alert} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{expenseDetails.expenseName}</Text>
        <Text style={styles.headerDescription}>
          {expenseDetails.expenseDescription}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          Category: {expenseDetails.expenseCategory}
        </Text>
        <TouchableOpacity style={styles.buttonCalendarContainer}>
                        <Icon name="calendar" style={styles.calendarButton} />
                        <Text style={styles.detailText}>Date: {expenseDate}</Text>
                      </TouchableOpacity>

        <Text style={styles.detailText}>
          Amount: {currencyFind(expenseDetails.expenseCurrency) + " " + convertToCurrency(expenseDetails.expenseAmount)}
        </Text>
        <Text style={styles.detailText}>
          Payment Method: {expenseDetails.expenseType}
        </Text>
        <Text style={styles.detailText}>
          Expense Owner: {expenseDetails.expenseOwner}
        </Text>
        <Text style={styles.detailTextError}>
          Amount per person: {currencyFind(expenseDetails.expenseCurrency) + " " + convertToCurrency(expenseDetails.expensePerMember)}
        </Text>
        <Text style={styles.detailText}>Members:</Text>
        {expenseDetails.expenseMembers.map((member, index) => (
          <Text key={index} style={styles.memberText}>
            {member}
          </Text>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditExpense', { expenseId })}
        >
          <Text style={styles.buttonText}>Edit</Text>
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
  header: {
    backgroundColor: '#e0f2f7', // Light blue background
    padding: 20,
    marginBottom: 30,
    height:150,
    marginTop:40,
    borderRadius:8

  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    
  },
  headerDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 25,
    fontWeight:"bold",
    marginTop:25
  },
  detailTextError: {
    fontSize: 16,
    marginBottom: 5,
    color: 'red',
  },
  memberText: {
    fontSize: 14,
    marginBottom: 15,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  editButton: {
    backgroundColor: '#e0f2f7',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  buttonCalendarContainer:{

  },
  calendarButton:{
    height:20,
    width:20
  },
});