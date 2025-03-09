import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  text: {
    fontSize: 24,
    marginTop: 16,
  },
});
