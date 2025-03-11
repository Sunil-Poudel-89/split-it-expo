import axios from 'axios';
import { API_URL } from '../config';
import { Linking } from 'react-native';
import { encode } from 'base-64';

// Function to initiate an eSewa payment
export const initiateEsewaPayment = async (paymentData) => {
  try {
    // First call your backend to create a payment record
    const response = await axios.post(`${API_URL}/payments/initiate-esewa`, paymentData);
    
    if (response.data.success) {
      // Get parameters from backend response
      const { 
        amount, 
        paymentRef, 
        merchantId,
        successUrl,
        failureUrl 
      } = response.data;
      
      // Calculate total amount (in this case same as amount since no extra charges)
      const totalAmount = amount;
      
      // Construct the eSewa URL with params per their documentation
      const baseUrl = __DEV__ 
        ? 'https://uat.esewa.com.np/epay/main'  // Test environment
        : 'https://esewa.com.np/epay/main';     // Production environment
      
      // Create the query string
      const params = {
        amt: amount,                 // Basic amount
        psc: 0,                      // Service charge
        pdc: 0,                      // Delivery charge
        txAmt: 0,                    // Tax amount
        tAmt: totalAmount,           // Total amount
        pid: paymentRef,             // Unique payment ID
        scd: merchantId,             // Merchant ID from eSewa
        su: successUrl,              // Success URL
        fu: failureUrl               // Failure URL
      };
      
      // Convert params to query string
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      // Complete URL with params
      const paymentUrl = `${baseUrl}?${queryString}`;
      
      // Open the payment URL in the browser/webview
      await Linking.openURL(paymentUrl);
      
      return {
        success: true,
        message: 'Payment initiated',
        paymentRef
      };
    } else {
      throw new Error(response.data.message || 'Failed to initiate payment');
    }
  } catch (error) {
    console.error('Error initiating eSewa payment:', error);
    throw error;
  }
};

// Function to verify payment status
export const checkPaymentStatus = async (paymentRef) => {
  try {
    const response = await axios.get(`${API_URL}/payments/status/${paymentRef}`);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};