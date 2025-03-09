// client/src/components/groups/viewGroup/GroupMonthlyGraph.jsx (React Native)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import {
  getGroupDailyExpService,
  getGroupMonthlyExpService,
} from '../../../services/expenseServices';
import AlertBanner from '../../AlertBanner';
import Loading from '../../loading';
import { LineChart } from 'react-native-chart-kit';
import { monthNamesMMM } from '../../../utils/helper';

const GroupMonthlyGraph = () => {
  const params = useParams();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [monthlyExp, setMonthlyExp] = useState([]);
  const [dailyExp, setDailyExp] = useState([]);
  const [montlyView, setMonthlyView] = useState(false);

  const toggleMonthlyView = () => {
    setMonthlyView(!montlyView);
  };

  const data = {
    labels: montlyView
      ? monthlyExp?.map((monthly) => monthNamesMMM[monthly._id.month - 1])
      : dailyExp?.map(
          (daily) => monthNamesMMM[daily._id.month - 1] + '-' + daily._id.date
        ),
    datasets: [
      {
        data: montlyView
          ? monthlyExp?.map((monthly) => monthly.amount)
          : dailyExp?.map((daily) => daily.amount),
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  useEffect(() => {
    const getGroupMonthlyExpense = async () => {
      setLoading(true);
      const groupIdJson = {
        id: params.groupId,
      };
      const monthly_exp = await getGroupMonthlyExpService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      const daily_exp = await getGroupDailyExpService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      setMonthlyExp(monthly_exp.data.data);
      setDailyExp(daily_exp.data.data);
      setLoading(false);
    };
    getGroupMonthlyExpense();
  }, [params.groupId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
          <View style={styles.chartContainer}>
            <LineChart
              data={data}
              width={350}
              height={300}
              yAxisLabel="₹"
              yAxisInterval={1}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text>Daily View</Text>
            <Switch value={montlyView} onValueChange={toggleMonthlyView} />
          </View>
          <Text style={styles.title}>
            {montlyView ? 'Monthly Expense Graph' : 'Daily Expense Graph'}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});