import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../loading';
import { getRecentUserExpService } from '../../services/expenseServices';
import AlertBanner from '../AlertBanner';
import ExpenseCard from '../Expense/expenseCard'; 

export const RecentTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [recentExp, setRecentExp] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getRecentExp = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const parsedProfile = JSON.parse(profileString);
          setProfile(parsedProfile);
          const recent_exp = await getRecentUserExpService(
            { user: parsedProfile.emailId },
            setAlert,
            setAlertMessage
          );
          setRecentExp(recent_exp?.data?.expense);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert(true);
        setAlertMessage('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    getRecentExp();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {alert && <AlertBanner message={alertMessage} />}
      <Text style={styles.title}>Your Recent transactions,</Text>
      {recentExp?.map((myExpense) => (
        <ExpenseCard
          key={myExpense?._id}
          expenseId={myExpense?._id}
          expenseName={myExpense?.expenseName}
          expenseAmount={myExpense?.expenseAmount}
          expensePerMember={myExpense?.expensePerMember}
          expenseOwner={myExpense?.expenseOwner}
          expenseDate={myExpense?.expenseDate}
          currencyType={myExpense?.expenseCurrency}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});