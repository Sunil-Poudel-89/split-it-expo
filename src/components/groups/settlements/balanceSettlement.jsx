// client/src/components/groups/settlement/BalanceSettlement.jsx (React Native Expo)

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, DatePickerAndroid, DatePickerIOS } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { currencyFind } from '../../../utils/helper';
import Loading from '../../loading';
import { settlementService } from '../../../services/groupServices';
import AlertBanner from '../../AlertBanner';
import Iconify from '../../Iconify';



const BalanceSettlement = ({ currencyType, settleTo, settleFrom, amount, handleClose, setReload }) => {
  const route = useRoute();
  const { groupId } = route.params;

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [settleSuccess, setSettleSuccess] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formik schema
  const settlementSchema = Yup.object().shape({
    settleAmount: Yup.number().required('Amount is required').min(0, "Min is 0").max(amount, "Max is " + amount),
  });

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {settleSuccess ? (
            <View style={styles.successContainer}>
              <Iconify icon="icon-park-twotone:success" style={styles.successIcon} />
              <Text style={styles.successText}>Settlement Successful!</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Settle Balance</Text>
              <AlertBanner showAlert={alert} alertMessage={alertMessage} severity="error" />

              <Formik
                initialValues={{
                  settleAmount: amount,
                }}
                validationSchema={settlementSchema}
                onSubmit={async (values) => {
                  setLoading(true);
                  try {
                    const response = await settlementService({
                      settleTo: settleTo,
                      settleFrom: settleFrom,
                      settleAmount: values.settleAmount,
                      settleDate: date,
                      groupId: groupId,
                    }, setAlert, setAlertMessage);

                    if (response?.data?.status === "Success") {
                      setSettleSuccess(true);
                      setReload(true);
                    }
                  } catch (error) {
                    console.error('Error settling balance:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                  <View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Settlement to</Text>
                      <TextInput
                        style={styles.input}
                        value={settleTo}
                        editable={false}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Settlement from</Text>
                      <TextInput
                        style={styles.input}
                        value={settleFrom}
                        editable={false}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Settlement Date</Text>
                      <TouchableOpacity style={styles.datePickerButton} onPress={showDatepicker}>
                        <Text style={styles.datePickerText}>{date.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                      {showDatePicker && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={date}
                          mode="date"
                          is24Hour={true}
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Settlement Amount ({currencyFind(currencyType)})</Text>
                      <TextInput
                        style={styles.input}
                        value={values.settleAmount.toString()}
                        onChangeText={handleChange('settleAmount')}
                        keyboardType="numeric"
                      />
                      {touched.settleAmount && errors.settleAmount && (
                        <Text style={styles.errorText}>{errors.settleAmount}</Text>
                      )}
                    </View>

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.settleButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Settle</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Formik>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  successIcon: {
    color: 'green',
    fontSize: 100,
  },
  successText: {
    fontSize: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  datePickerText: {
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  settleButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BalanceSettlement;