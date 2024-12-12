import React, { useEffect, useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../api/config'; // Replace with your API base URL
import { set } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentScreen = ({ route, navigation }) => {
    const { url, orderDataPay, transId, orderId, payment } = route?.params;
    const [paymentStatus, setPaymentStatus] = useState(false);
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
    
    // Function to check payment status
    const checkPaymentStatus = async (transId, userInfo) => {        
        try {
            const response = await axios.post(`https://5282-2405-4802-9154-3a80-c804-4289-b671-2550.ngrok-free.app/check-status-order`, {
                app_trans_id: transId,
            });

            if (response.data.return_code === 1) {
                setPaymentStatus(true)
                if (payment === 'BuyNow') {
                    const response = await axios.post(`${BASE_URL}order/user/buynow`, orderDataPay);

                    if (response.status === 200 || response.status === 201) {
                        // Alert.alert('Success', 'Đơn hàng đã được đặt thành công!');
                        navigation.navigate('OrderConfirmationScreen', { orderId: orderId });
                    } else {
                        Alert.alert('Error', 'Không thể đặt đơn hàng. Vui lòng thử lại.');
                    }
                } else {
                    if (userInfo) {
                        const response = await axios.post(`${BASE_URL}order/user`, orderDataPay);

                        if (response.status === 200 || response.status === 201) {
                            // Alert.alert('Success', 'Đơn hàng đã được đặt thành công!');
                            navigation.navigate('OrderConfirmationScreen', { orderId: orderId });
                        } else {
                            Alert.alert('Error', 'Không thể đặt đơn hàng. Vui lòng thử lại.');
                        }
                    }
                    else {
                        const response = await axios.post(`${BASE_URL}order/guest`, orderDataPay);

                        if (response.status === 200 || response.status === 201) {
                            // Alert.alert('Success', 'Đơn hàng đã được đặt thành công!');
                            navigation.navigate('OrderConfirmationScreen', { orderId: orderId });
                        } else {
                            Alert.alert('Error', 'Không thể đặt đơn hàng. Vui lòng thử lại.');
                        }
                    }
                }
            } else {
                setPaymentStatus(false);
            }
        } catch (error) {
            console.error("Error checking payment status:", error);
            setPaymentStatus('Error checking payment status');
        }
    };

    useEffect(() => {
        // Open ZaloPay URL
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
        if (transId) {
            const interval = setInterval(() => {
                checkPaymentStatus(transId, userInfo);
            }, 1000); // Poll every 5 seconds
            if (paymentStatus) {
                clearInterval(interval);
            }
            return () => clearInterval(interval);
        }

    }, [transId, paymentStatus, userInfo]);


    return (
        <View>
            <Text>{paymentStatus ? paymentStatus : 'Checking payment status...'}</Text>
        </View>
    );
};

export default PaymentScreen;
