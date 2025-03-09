import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../loading';
import { getUserGroupsService } from '../../services/groupServices';
import AlertBanner from '../AlertBanner';
import { convertToCurrency } from '../../utils/helper';

export const GroupExpenseChart = () => {
  const [loading, setLoading] = useState(true);
  const [groupExp, setGroupExp] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const getGroupExpense = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const parsedProfile = JSON.parse(profileString);
          setProfile(parsedProfile);
          const group_exp = await getUserGroupsService(
            parsedProfile,
            setAlert,
            setAlertMessage
          );
          setGroupExp(group_exp.data.groups);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlert(true);
        setAlertMessage('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    getGroupExpense();
  }, []);

  if (loading) {
    return <Loading />;
  }
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const data = groupExp?.map((group) => ({
    name: group.groupName,
    population: group.groupTotal,
    color: getRandomColor(),
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };



  return (
    <View style={styles.container}>
      {alert && <AlertBanner message={alertMessage} />}
      <Text style={styles.title}>Groupwise Expense Chart</Text>
      <PieChart
        data={data}
        width={screenWidth}
        height={300}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        center={[10, 10]}
        absolute
      />
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