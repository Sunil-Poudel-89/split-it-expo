import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { getGroupDetailsService } from '../../../services/groupServices';
import AlertBanner from '../../AlertBanner';
import Loading from '../../loading';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useRoute } from '@react-navigation/native'; // Import useRoute

const UserBalanceChart = () => {
  const route = useRoute(); // Use useRoute
  const { groupId } = route.params; // Access groupId from route.params

  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphLabel, setGraphLabel] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const mdUp = Dimensions.get('window').width > 768;

  const data = {
    labels: graphLabel,
    datasets: [
      {
        label: 'User Balance',
        data: graphData,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          display: mdUp,
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const getGroupDetails = async () => {
      setLoading(true);
      const groupIdJson = {
        id: groupId, // Use groupId from route.params
      };
      const response_group = await getGroupDetailsService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      let split = Object.entries(response_group?.data?.group?.split[0]);
      split.map((mySplit, index) => {
        if (mySplit[1] < 0) {
          if (index === 0) {
            setGraphData([Math.abs(mySplit[1])]);
            setGraphLabel([mySplit[0]]);
          } else {
            setGraphData((current) => [...current, Math.abs(mySplit[1])]);
            setGraphLabel((current) => [...current, mySplit[0]]);
          }
        }
      });
      setLoading(false);
    };
    getGroupDetails();
  }, [groupId]); // Use groupId as dependency

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <View style={styles.content}>
          <AlertBanner showAlert={alert} alertMessage={alertMessage} severity={'error'} />
          <View style={styles.chartContainer}>
            <Bar data={data} options={options} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    paddingBottom: 24,
  },
  chartContainer: {
    height: 350,
    marginTop: 16,
  },
});

export default UserBalanceChart;