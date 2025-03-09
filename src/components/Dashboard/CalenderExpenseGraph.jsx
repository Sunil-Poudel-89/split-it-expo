import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../loading";
import {
  getUserDailyExpService,
  getUserMonthlyExpService,
} from "../../services/expenseServices";
import { monthNamesMMM } from "../../utils/helper";
import AlertBanner from "../AlertBanner";

export const CalenderExpenseGraph = () => {
  const [montlyView, setMonthlyView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userMonthlyExp, setUserMonthlyExp] = useState(null);
  const [userDailyExp, setUserDailyExp] = useState(null);

  const toggleMonthlyView = () => {
    setMonthlyView(!montlyView);
  };

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem("profile");
        if (profileString) {
          const parsedProfile = JSON.parse(profileString);
          setProfile(parsedProfile);
          const userIdJson = { user: parsedProfile.emailId };
          const response_monthly = await getUserMonthlyExpService(
            userIdJson,
            setAlert,
            setAlertMessage
          );
          setUserMonthlyExp(response_monthly.data.data);
          const response_daily = await getUserDailyExpService(
            userIdJson,
            setAlert,
            setAlertMessage
          );
          setUserDailyExp(response_daily.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlert(true);
        setAlertMessage("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const data = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ data: [20, 45, 28] }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <View style={styles.container}>
      {alert && <AlertBanner message={alertMessage} />}
      <Text style={styles.title}>
        Expense Graph - {montlyView ? "Daily View" : "Monthly View"}
      </Text>
      <LineChart
        data={data}
        width={350}
        height={350}
        // yAxisLabel="₹"
        // yAxisInterval={1}
        chartConfig={chartConfig}
        // bezier
        // style={styles.chart}
      />
      <View style={styles.switchContainer}>
        <Text>Monthly expense view</Text>
        <Switch value={montlyView} onValueChange={toggleMonthlyView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
});
