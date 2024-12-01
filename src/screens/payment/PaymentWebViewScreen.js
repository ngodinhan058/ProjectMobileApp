import React from 'react';
import { WebView } from 'react-native-webview';
import { Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../api/config';

const PaymentWebViewScreen = ({ route, navigation }) => {
  const { url, orderData } = route.params; // Nhận dữ liệu URL và orderData

  const handleNavigationStateChange = async (event) => {
    const returnUrl = `${BASE_URL}payment/vn-pay-callback`; // URL callback từ VNPay

    if (event.url.startsWith(returnUrl)) {
      const params = new URLSearchParams(event.url.split('?')[1]);
      const responseCode = params.get('vnp_ResponseCode'); // Mã kết quả giao dịch

      if (responseCode === '00') {
        // Thanh toán thành công, gọi API đặt hàng
        try {
          const response = await axios.post(`${BASE_URL}order/user`, orderData);

          if (response.status === 200 || response.status === 201) {
            // Alert.alert('Success', 'Đơn hàng đã được đặt thành công!');
            navigation.navigate('OrderConfirmationScreen', { order: response.data.order });
          } else {
            Alert.alert('Error', 'Không thể đặt đơn hàng. Vui lòng thử lại.');
          }
        } catch (error) {
          console.log('Error placing order:', error);
        //   Alert.alert('Error', 'Đã xảy ra lỗi khi đặt đơn hàng.');
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
