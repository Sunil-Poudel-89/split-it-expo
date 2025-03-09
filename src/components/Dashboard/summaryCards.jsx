import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { convertToCurrency } from "../../utils/helper";
import { Ionicons } from "@expo/vector-icons";

export const SummaryCards = ({ userTotalExp }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="receipt" size={30} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.caption}>Total</Text>
          <Text style={styles.value}>
            ₹ {userTotalExp ? convertToCurrency(userTotalExp) : 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#E1F5FE", // Replace with your theme's lighter primary color
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%"
  },
  iconContainer: {
    backgroundColor: "#0D47A1", // Replace with your theme's dark primary color
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 16,
  },
  caption: {
    fontSize: 14,
    color: "#1565C0", // Replace with your theme's dark primary color
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0D47A1", // Replace with your theme's darker primary color
  },
});
