import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initiateEsewaPayment, checkPaymentStatus } from '../services/paymentService';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { expense } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [paymentRef, setPaymentRef] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem('profile');
        if (profileString) {
          const profile = JSON.parse(profileString);
          setCurrentUser(profile?.emailId);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
    
    // Listen for app returning to foreground to check payment status
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Handle deep links when app opens from eSewa
  const handleDeepLink = async (event) => {
    // Parse the URL to get data
    const { url } = event;
    
    if (url.includes('success') && paymentRef) {
      // Check payment status from backend
      try {
        const status = await checkPaymentStatus(paymentRef);
        if (status.success) {
          Alert.alert(
            'Payment Successful',
            'Your payment has been processed successfully.',
            [
              { 
                text: 'OK', 
                onPress: () => navigation.navigate('ExpenseDetails', { expenseId: expense._id })
              }
            ]
          );
        } else {
          Alert.alert(
            'Payment Verification Failed',
            'We couldn\'t verify your payment. Please contact support.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        Alert.alert(
          'Error',
          'Something went wrong while verifying your payment.',
          [{ text: 'OK' }]
        );
      }
    } else if (url.includes('failure')) {
      Alert.alert(
        'Payment Failed',
        'Your payment was not successful. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handlePayWithEsewa = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) {
        Alert.alert('Error', 'Please log in to make a payment');
        return;
      }
      
      const paymentData = {
        amount: expense.expensePerMember,
        fromUser: currentUser,
        toUser: expense.expenseOwner,
        expenseId: expense._id
      };
      
      const result = await initiateEsewaPayment(paymentData);
      
      if (result.success) {
        setPaymentRef(result.paymentRef);
        // User will be redirected to eSewa
        // The app will handle the return via deep linking
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Pay Expense</Text>
      </View>
      
      <View style={styles.expenseCard}>
        <Text style={styles.expenseTitle}>{expense.expenseName}</Text>
        <Text style={styles.expenseDescription}>{expense.expenseDescription || 'No description'}</Text>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Your Share:</Text>
          <Text style={styles.amount}>{expense.expenseCurrency} {expense.expensePerMember}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Icon name="account" size={20} color="#666" />
          <Text style={styles.userName}>Pay to: {expense.expenseOwner}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Icon name="calendar" size={20} color="#666" />
          <Text style={styles.date}>
            {new Date(expense.expenseDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        
        <TouchableOpacity 
          style={styles.paymentMethod}
          onPress={handlePayWithEsewa}
          disabled={loading}
        >
          <Image 
            source={require('../assets/esewa-logo.png')} 
            style={styles.paymentLogo}
            resizeMode="contain"
          />
          <Text style={styles.paymentMethodText}>Pay with eSewa</Text>
          {loading && <ActivityIndicator size="small" color="#56A8A7" />}
        </TouchableOpacity>
      </View>
      
      <Text style={styles.secureText}>
        <Icon name="shield-check" size={16} color="#56A8A7" /> 
        Secure payment powered by eSewa
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expenseDescription: {
    color: '#666',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 16,
  },
  amountLabel: {
    color: '#666',
    fontSize: 16,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#56A8A7',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    marginLeft: 8,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginLeft: 8,
    color: '#666',
  },
  paymentMethodsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FBF9',
    borderWidth: 1,
    borderColor: '#56A8A7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  paymentLogo: {
    width: 50,
    height: 24,
  },
  paymentMethodText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  secureText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
  }
});