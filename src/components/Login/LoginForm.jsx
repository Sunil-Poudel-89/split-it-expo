import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../../services/auth";

export default function LoginForm() {
  const navigation = useNavigation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(" ");
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    emailId: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <Image 
              source={require('../../../assets/logo.png')} 
              style={styles.image}
              resizeMode="contain"
            />
      <Formik
        initialValues={{
          emailId: "",
          password: "",
          remember: true,
        }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await login(values, setShowAlert, setAlertMessage, navigation);
          setSubmitting(false);
        }}
      >
        {({
          errors,
          touched,
          values,
          isSubmitting,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <TextInput
                name="emailId"
                style={styles.textInput}
                mode="outlined"
                label="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={values.emailId}
                onChangeText={handleChange("emailId")}
                onBlur={handleBlur("emailId")}
                error={touched.emailId && errors.emailId}
              />
              {touched.emailId && errors.emailId && (
                <Text style={styles.errorText}>{errors.emailId}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                name="password"
                style={styles.textInput}
                mode="outlined"
                label="Password"
                secureTextEntry={!showPassword}
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={touched.password && errors.password}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <TouchableOpacity onPress={handleShowPassword}>
                        <Ionicons
                          name={showPassword ? "eye" : "eye-off"}
                          size={24}
                          color="gray"
                        />
                      </TouchableOpacity>
                    )}
                  />
                }
              />
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Login
            </Button>
            <TouchableOpacity onPress={() => navigation.navigate("RegisterPage")}>
              <Text style={styles.registerLink}>
                Don't have an account? Register here.
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      <Snackbar
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        duration={6000}
        style={styles.snackbar}
      >
        {alertMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    gap: 16,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  inputContainer: {
    width: "90%",
    display:"flex",
    justifyContent: "center"
  },
  textInput: {
    width: "100%",
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    width:"50%"
  },
  snackbar: {
    position: "absolute",
    backgroundColor: "#D32F2F",
    width:250,
    top:350,

  },
  image: {
    width: '50%',
    height: '50%',
  },
  registerLink: {
    marginTop: 16,
    textAlign: "center",
    color: "blue", // Or any color you prefer
    textDecorationLine: "underline", // Optional: Add underline
  },
});