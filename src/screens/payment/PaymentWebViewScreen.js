import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Alert, Linking } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentWebViewScreen = ({ route, navigation }) => {
  const { url, orderData, orderId } = route?.params; // Nhận dữ liệu URL và orderData
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          let userInfoData = JSON.parse(userInfoString);
          setUserInfo(userInfoData);
        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      }
    };
    fetchUserInfo();
  }, []);

  const handleNavigationStateChange = async (event) => {
    const returnUrl = `${BASE_URL}payment/vn-pay-callback`; // URL callback từ VNPay
    console.log("zaloPayReturnUrl", event.url);
    // Kiểm tra xem URL có phải là của ZaloPay không (Sandbox hoặc môi trường thực tế)
    if (event.url.startsWith('zalopay://pay')) {
      const zaloPayReturnUrl = event.url;
     
      
  
      // Kiểm tra nếu là môi trường sandbox
      if (zaloPayReturnUrl.includes('sandbox=true')) {
        console.log('ZaloPay sandbox callback detected');
      } else {
        console.log('ZaloPay production callback detected');
      }
  
      // Xử lý thông tin trả về từ ZaloPay nếu có
      const params = new URLSearchParams(zaloPayReturnUrl.split('?')[1]);
      const responseCode = params.get('zptranstoken'); // Lấy mã giao dịch của ZaloPay
  
      if (responseCode) {
        // Thanh toán ZaloPay thành công, xử lý đơn hàng
        try {
          const apiEndpoint = userInfo ? `${BASE_URL}order/user` : `${BASE_URL}order/guest`;
          const response = await axios.post(apiEndpoint, orderData);
  
          if (response.status === 200 || response.status === 201) {
            navigation.navigate('OrderConfirmationScreen', { orderId: orderId });
          } else {
            Alert.alert('Error', 'Không thể đặt đơn hàng. Vui lòng thử lại.');
          }
        } catch (error) {
          console.log('Error placing order:', error);
        }
      } else {
        Alert.alert('Error', 'Thanh toán ZaloPay thất bại. Vui lòng thử lại.');
        navigation.goBack();
      }
    }
  
    // Kiểm tra nếu URL là của VNPay
    else if (event.url.startsWith(returnUrl)) {
      const params = new URLSearchParams(event.url.split('?')[1]);
      const responseCode = params.get('vnp_ResponseCode'); // Mã kết quả giao dịch
  
      if (responseCode === '00') {
        // Thanh toán thành công, gọi API đặt hàng
        try {
          const apiEndpoint = userInfo ? `${BASE_URL}order/user` : `${BASE_URL}order/guest`;
          const response = await axios.post(apiEndpoint, orderData);
  
          if (response.status === 200 || response.status === 201) {
            navigation.navigate('OrderConfirmationScreen', { orderId: orderId });
          } else {
            Alert.alert('Error', 'Không thể đặt đơn hàng. Vui lòng thử lại.');
          }
        } catch (error) {
          console.log('Error placing order:', error);
        }
      } else {
        // Thanh toán thất bại
        Alert.alert('Error', 'Thanh toán thất bại. Vui lòng thử lại.');
        navigation.goBack();
      }
    }
  };
  

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  );
};

export default PaymentWebViewScreen;
