import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Snackbar } from "react-native-paper";
import PropTypes from "prop-types";

AlertBanner.propTypes = {
  showAlert: PropTypes.bool,
  alertMessage: PropTypes.string,
  severity: PropTypes.string,
  autoHideDuration: PropTypes.number,
  onCloseHandle: PropTypes.func,
};

export default function AlertBanner({
  showAlert,
  alertMessage,
  severity = "error",
  autoHideDuration = 3000, // Default to 3000ms (3 seconds)
  onCloseHandle,
}) {
  const backgroundColor = severity === 'error' ? 'red' : severity === 'success' ? 'green' : 'orange';

  return (
    <View>
      <Snackbar
        visible={showAlert}
        onDismiss={onCloseHandle}
        duration={autoHideDuration}
        style={{ backgroundColor: backgroundColor }} // Set Snackbar background color
      >
        <Text style={{ color: 'white' }}>{alertMessage}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add styles if needed
});