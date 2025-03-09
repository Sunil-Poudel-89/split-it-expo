// client/src/components/groups/viewGroup/GroupCategoryGraph.jsx (React Native)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getGroupCategoryExpService } from '../../../services/expenseServices';
import AlertBanner from '../../AlertBanner';
import Loading from '../../loading';
import { Doughnut } from 'react-native-chart-kit';
import { convertToCurrency, currencyFind } from '../../../utils/helper';

const GroupCategoryGraph = ({ currencyType }) => {
  const params = useParams();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoryExp, setCategoryExp] = useState([]);

  const data = {
    labels: categoryExp?.map((category) => category._id),
    datasets: [
      {
        data: categoryExp?.map((category) => category.amount),
        colors: [
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          (opacity = 1) => `rgba(255, 206, 86, ${opacity})`,
          (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          (opacity = 1) => `rgba(153, 102, 255, ${opacity})`,
          (opacity = 1) => `rgba(255, 159, 64, ${opacity})`,
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
    const getGroupCategoryExpense = async () => {
      setLoading(true);
      const groupIdJson = {
        id: params.groupId,
      };
      const category_exp = await getGroupCategoryExpService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      setCategoryExp(category_exp.data.data);
      setLoading(false);
    };
    getGroupCategoryExpense();
  }, [params.groupId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />
          <Doughnut
            data={data.datasets[0].data}
            labels={data.labels}
            width={350}
            height={350}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            absolute
          />
          <Text style={styles.title}>Category Expense Chart</Text>
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
  title: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default GroupCategoryGraph;  