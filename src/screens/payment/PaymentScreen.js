import React, { useEffect } from 'react';
import { Alert, Linking, View, Text } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../api/config';

const PaymentScreen = ({ route, navigation }) => {
    const { url, orderData, transId } = route.params;

    useEffect(() => {
        const openZaloPay = async () => {
            try {
                const supported = await Linking.canOpenURL(url);
                
                if (supported) {
                    await Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'Không thể mở ứng dụng ZaloPay.');
                }
            } catch (error) {
                console.error('Error opening ZaloPay URL:', error);
                Alert.alert('Error', 'Đã xảy ra lỗi khi mở ZaloPay.');
            }
        };

        openZaloPay();
    }, [url]);


    useEffect(() => {
        const handleReturnFromZaloPay = async (event) => {
            console.log('Event URL:', event.url);
            const returnUrl = `http://192.168.1.6:3000/zalo-pay-callback`;
            
            if (event.url.startsWith(returnUrl)) {
                const params = new URLSearchParams(event.url.split('?')[1]);
                const returnCode = params.get('return_code');
    
                if (returnCode === '1') {
                    try {
                        const response = await axios.post(`${BASE_URL}order`, orderData);
                        if (response.status === 200 || response.status === 201) {
                            console.log('Navigating to OrderConfirmationScreen');
                            Alert.alert('Success', 'Đặt hàng thành công!');
                            navigation.navigate('OrderConfirmationScreen', { transId });
                        } else {
                            Alert.alert('Error', 'Không thể đặt đơn hàng.');
                        }
                    } catch (error) {
                        console.error('Error placing order:', error);
                        Alert.alert('Error', 'Đã xảy ra lỗi khi đặt đơn hàng.');
                    }
                } else {
                    Alert.alert('Error', 'Thanh toán thất bại.');
                    navigation.goBack();
                }
            }
        };
    
        const subscription = Linking.addEventListener('url', handleReturnFromZaloPay);
    
        return () => {
            subscription.remove();
        };
    }, [orderData, transId]);
    



    return null;
}

export default PaymentScreen;
