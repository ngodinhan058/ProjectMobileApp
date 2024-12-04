import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './api/config';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
const buttonWidth = width * 0.42;
const buttonHeight = 50;

function OrderConfirmationScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const opacityAnim = useState(new Animated.Value(0))[0];
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          let userInfoData = JSON.parse(userInfoString);

          if (!userInfoData.cartId) {
            userInfoData = await createCartForUser(userInfoData);
          }

          setUserInfo(userInfoData);
          await fetchOrderDetails(userInfoData.cartId);
        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      } finally {
        setLoading(false);
        fadeIn();
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerRef.current);
    } else {
      handleCancelOrder();
    }
  }, [timeLeft]);

  const createCartForUser = async (userInfoData) => {
    try {
      const response = await axios.post(`${BASE_URL}cart/user/`, {
        userId: userInfoData.userId,
      });
      if (response.status === 201) {
        const { cartId } = response.data.data;
        userInfoData.cartId = cartId;
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfoData));
        return userInfoData;
      } else {
        Alert.alert('Error', 'Failed to create cart');
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      Alert.alert('Error', 'Failed to create cart');
    }
    return userInfoData;
  };

  const fetchOrderDetails = async (cartId) => {
    try {
      const response = await axios.get(`${BASE_URL}order/cart/${cartId}`);
      console.log(response);

      if (response.status === 200) {
        setOrderDetails(response.data.data);
      } else {
        Alert.alert('Error', 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const requestBody = {
        status: 6,
        orderId: orderDetails.orderId,
      };
      const response = await axios.put(`${BASE_URL}order/change`, requestBody);
      if (response.status === 200) {
        // Alert.alert('Order Cancelled', 'Your order has been cancelled successfully');
        navigation.navigate('RejectOrderConfirmationScreen', { orderDetails });
      } else {
        Alert.alert('Error', 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      Alert.alert('Error', 'Failed to cancel order');
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const requestBody = {
        status: 1,
        orderId: orderDetails.orderId,
      };
      const response = await axios.put(`${BASE_URL}order/change`, requestBody);
      if (response.status === 200) {
        clearTimeout(timerRef.current); // Clear the timer
        // Alert.alert('Order Confirmed', 'Your order has been confirmed successfully');
        navigation.navigate('CompletedOrderConfirmationScreen', { orderDetails });
      } else {
        Alert.alert('Error', 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      Alert.alert('Error', 'Failed to confirm order');
    }
  };

  const fadeIn = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const renderOrderItem = (item, index) => (
    <View style={styles.itemRow} key={index}>
      <Image style={styles.itemImage} source={{ uri: item.productImage }} />
      <View style={styles.itemDetails}>
        <Text style={styles.boldText}>{item.productName}</Text>
        <Text style={styles.detailText}>Màu: {item.productSize}</Text>
        <Text style={styles.detailText}>Số Lượng: {item.productQuantity}</Text>
        <Text style={styles.detailText}>Giảm Giá Voucher: {item.productDiscountPrice || 0}</Text>
        <Text style={styles.detailText}>Tổng Cộng: {item.productTotalPrice} ₫</Text>
      </View>
    </View>
  );

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#457b9d" />
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load order details.</Text>
      </View>
    );
  }
  return (
    <LinearGradient colors={['#a8dadc', '#f1faee']} style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <Icon name="clock-o" size={40} color="#1d3557" />
            </View>
            <View>
              <Text style={styles.headerText}>Vui Lòng Xác Nhận ({formatTime(timeLeft)})</Text>
              <Text
                style={[
                  styles.subHeaderText,
                  { backgroundColor: '#a8dadc', color: '#1d3557', padding: 5, borderRadius: 5 },
                ]}
              >
                Đơn Của Bạn Là #{orderDetails.orderId.substring(0, 8)}
              </Text>
            </View>
          </View>
          <Text style={styles.infoText}>
            Chúng tôi xin cảm ơn bạn {orderDetails.userEmail} vì đã tin tưởng chúng tôi mà đặt hàng. Chúc bạn 1 ngày tốt lằnh
          </Text>
          <Text style={styles.boldText}>Thời Gian Đặt Hàng: {orderDetails.orderDate}</Text>
          <Text style={styles.sectionHeader}>Thông Tin Người Dùng</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.boldText}>{orderDetails.userName}</Text>
            <Text style={styles.label}>{orderDetails.userEmail}</Text>
            <Text style={styles.label}>{orderDetails.userPhone}</Text>
            <Text style={[styles.label, styles.addressText]}>{orderDetails.orderAddress}</Text>
          </View>
          <Text style={styles.sectionHeader}>Đơn Hàng Sản Phẩm</Text>
          {orderDetails.items.length > 0 ? (
            orderDetails.items[0].cartItem.map((item, index) => renderOrderItem(item, index))
          ) : (
            <Text style={styles.label}>No items in the cart.</Text>
          )}
          <Text style={styles.sectionHeader}>Tóm tắt đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Giảm giá Voucher:</Text>
            {orderDetails.orderCouponPrice == 0 ?
              (<Text style={styles.label}>- {orderDetails.orderCouponPerHundred || 0}%</Text>)
              : (<Text style={styles.label}>- {orderDetails.orderCouponPrice || 0}</Text>)}
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Phí Vận Chuyển:</Text>
            <Text style={styles.label}>{orderDetails.orderShipper || 0}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTopBorder]}>
            <Text style={styles.label}>Tổng Cộng:</Text>
            <Text style={styles.label}>{orderDetails.orderTotal} ₫</Text>
          </View>
        </Animated.View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { width: buttonWidth, height: buttonHeight }]}
          onPress={handleCancelOrder}
        >
          <LinearGradient colors={['#e63946', '#ff6b6b']} style={styles.gradient}>
            <Text style={styles.buttonText}>Hủy Đơn</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.confirmButton, { width: buttonWidth, height: buttonHeight }]}
          onPress={handleConfirmOrder}
        >
          <LinearGradient colors={['#457b9d', '#1d3557']} style={styles.gradient}>
            <Text style={styles.buttonText}>Xác Nhận</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  timerContainer: {
    padding: 15,
    backgroundColor: '#f1faee',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  timerText: {
    fontSize: 20,
    color: '#e63946',
    fontWeight: 'bold',
    backgroundColor: '#f1faee',
    padding: 5,
    borderRadius: 5,
  },
  scrollContent: {
    marginBottom: buttonHeight + 20,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: '#a8dadc',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 24,
    color: '#1d3557',
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#457b9d',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1d3557',
    lineHeight: 24,
    marginBottom: 20,
  },
  boldText: {
    fontSize: 18,
    color: '#1d3557',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    color: '#457b9d',
    marginTop: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#f1faee',
    borderRadius: 10,
    marginTop: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    color: '#457b9d',
    marginVertical: 5,
    fontSize: 16,
  },
  addressText: {
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1faee',
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  detailText: {
    color: '#1d3557',
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  summaryTopBorder: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderConfirmationScreen;