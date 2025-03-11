import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Snackbar,
  Alert,
} from 'react-native-paper';
import { Formik, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { register } from '../../services/auth'; // Adjust the path as needed

export default function Register() {
  const navigation = useNavigation();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(' ');
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    emailId: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password should be 8 characters minimum'),
    firstName: Yup.string().required('First Name is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be 10 digits')
      .max(10, 'Must be 10 digits')
      .required('Phone number is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      emailId: '',
      password: '',
      phoneNumber: '',
      remember: true,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      await register(values, setShowAlert, setAlertMessage, navigation);
    },
  });

  const {
    errors,
    touched,
    values,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
  } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <ScrollView style={styles.rootStyle}>
      <View style={styles.headerStyle}>
        <View />
        <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.headerText}>
            Already have an account?{' '}
            <Text style={styles.headerLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionStyle}>
        <Text style={styles.sectionTitle}>
          Divide Expenses, Multiply Memories. Register for Split It
        </Text>
        <Image
          source={require('../../../assets/register.avif')}
          style={styles.sectionImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Get started absolutely free.</Text>
        <Text style={styles.subtitle}>Split It, Group expense splitting app!</Text>

        <FormikProvider value={formik}>
          <View style={styles.formContainer}>
            <Snackbar
              visible={showAlert}
              onDismiss={() => setShowAlert(false)}
              duration={6000}
              style={styles.snackbar}
            >
              <Alert severity="error" style={{ backgroundColor: '#D32F2F' }}>
                {alertMessage}
              </Alert>
            </Snackbar>

            <View style={styles.inputRow}>
              <TextInput
                name="firstName"
                style={styles.input}
                mode="outlined"
                label="First Name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={touched.firstName && errors.firstName}
              />
              <TextInput
                name="lastName"
                style={styles.input}
                mode="outlined"
                label="Last Name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={touched.lastName && errors.lastName}
              />
            </View>

            <TextInput
              name="emailId"
              style={styles.inputFull}
              mode="outlined"
              label="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.emailId}
              onChangeText={handleChange('emailId')}
              onBlur={handleBlur('emailId')}
              error={touched.emailId && errors.emailId}
            />

            <TextInput
              name="phoneNumber"
              style={styles.inputFull}
              mode="outlined"
              label="Phone Number"
              keyboardType="phone-pad"
              value={values.phoneNumber}
              onChangeText={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              error={touched.phoneNumber && errors.phoneNumber}
            />

            <TextInput
              name="password"
              style={styles.inputFull}
              mode="outlined"
              label="Password"
              secureTextEntry={!showPassword}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && errors.password}
              right={
                <TextInput.Icon
                  icon={() => (
                    <TouchableOpacity onPress={handleShowPassword}>
                      <Ionicons
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  )}
                />
              }
            />

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Register
            </Button>
          </View>
        </FormikProvider>

        <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
          <Text style={styles.footerLink}>
            Already have an account? <Text>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  rootStyle: {
  
  flex: 1,
  
  },
  
  headerStyle: {
  
  flexDirection: 'row',
  
  justifyContent: 'space-between',
  
  padding: 16,
  
  },
  
  headerText: {
  
  fontSize: 16,
  
  },
  
  headerLink: {
  
  fontWeight: 'bold',
  
  },
  
  sectionStyle: {
  
  alignItems: 'center',
  
  padding: 16,
  
  },
  
  sectionTitle: {
  
  fontSize: 24,
  
  fontWeight: 'bold',
  
  textAlign: 'center',
  
  marginBottom: 16,
  
  },
  
  sectionImage: {
  
  width: '100%',
  
  height: 200,
  
  },
  
  container: {
  
  padding: 16,
  
  },
  
  title: {
  
  fontSize: 20,
  
  fontWeight: 'bold',
  
  marginBottom: 8,
  
  },
  
  subtitle: {
  
  color: 'gray',
  
  marginBottom: 16,
  
  },
  
  formContainer: {
  
  gap: 16,
  
  },
  
  inputRow: {
  
  flexDirection: 'row',
  
  justifyContent: 'space-between',
  
  gap:8
  
  },
  
  input: {
  
  flex: 1,
  
  },
  
  inputFull: {
  
  width: '100%',
  
  },
  
  button: {
  
  marginTop: 16,
  
  paddingVertical: 8,
  
  },
  
  footerLink: {
  
  textAlign: 'center',
  
  marginTop: 16,
  
  },
  
  snackbar: {
  
  backgroundColor: '#D32F2F',
  
  },
  
  });