import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getUserExpenseService } from "../../services/expenseServices";
import { getUserGroupsService } from "../../services/groupServices";
import Loading from "../loading";
import { CalenderExpenseGraph } from "./CalenderExpenseGraph";
import { CategoryExpenseChart } from "./CategoryExpenseGraph";
import { EndMessage } from "./endMessage";
import { GroupExpenseChart } from "./GroupExpenseChart";
import { RecentTransactions } from "./RecentTransactions";
import { SummaryCards } from "./summaryCards";
import { WelcomeMessage } from "./welcomeMessage";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertBanner from "../AlertBanner";
import EsewaExample from "./Esewa";

export default function DashboardHome() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userExp, setUserExp] = useState(null);
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      try {
        const profileString = await AsyncStorage.getItem("profile");
        if (profileString) {
          const parsedProfile = JSON.parse(profileString);
          setProfile(parsedProfile); // Set the profile state
          const userIdJson = { user: parsedProfile.emailId };
          const response_expense = await getUserExpenseService(
            userIdJson,
            setAlert,
            setAlertMessage
          );
          setUserExp(response_expense.data);
          const response_group = await getUserGroupsService(parsedProfile);
          if (response_group.data.groups.length === 0) {
            setNewUser(true);
          }
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

  return (
    <ScrollView style={styles.container}>
      {alert && <AlertBanner message={alertMessage} />}
      
      {/* Welcome Message Row */}
      <View style={styles.card}>
        <WelcomeMessage />
      </View>
      
      {/* <View>
            <EsewaExample />
          </View> */}

      {newUser ? (
        /* New User Message Row */
        <View style={styles.card}>
          <Text style={styles.newUserText}>
            Seems to be new here! Create your first group and add expenses
          </Text>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={() => navigation.navigate("CreateGroupPage")}
          >
            <Text style={styles.createGroupLink}>Create Group</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Existing User Components */
        <>
          {/* Summary Cards Row */}
          <View style={styles.card}>
            <SummaryCards userTotalExp={userExp?.total} />
          </View>
          
          {/* Calendar Expense Graph Row */}
          {/* <View style={styles.card}>
            <CalenderExpenseGraph />
          </View> */}
          
          {/* Group Expense Chart Row */}
          <View style={styles.card}>
            {/* <GroupExpenseChart /> */}
          </View>
          
          {/* Category Expense Chart Row 1 */}
          <View style={styles.card}>
            {/* <CategoryExpenseChart /> */}
          </View>
          
          {/* Recent Transactions Row */}
          <View style={styles.card}>
            <RecentTransactions />
          </View>
          
          {/* Category Expense Chart Row 2 (removed duplicate) */}
          
          {/* End Message Row */}
          <View style={styles.card}>
            <EndMessage />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  newUserText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  createGroupButton: {
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 10,
  },
  createGroupLink: {
    fontSize: 16,
    color: "blue",
    textDecorationLine: "underline",
  },
});