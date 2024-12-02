import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';
import { Rating, AirbnbRating } from 'react-native-ratings';

const OrderItem = ({ order }) => { // Nhận order từ props
  const [disable, setDisable] = useState(true);
  const navigation = useNavigation();

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };
  const handleCancelOrder = async () => {
    try {
      const requestBody = {
        status: 6,
        orderId: order?.orderId,
      };
      const response = await axios.put(`${BASE_URL}order/change`, requestBody);
      if (response.status === 200) {
        Alert.alert('Order Cancelled', 'Your order has been cancelled successfully');
        navigation.goBack();
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
        orderId: order?.orderId,
      };
      const response = await axios.put(`${BASE_URL}order/change`, requestBody);
      if (response.status === 200) {
        Alert.alert('Order Confirmed', 'Your order has been confirmed successfully');

      } else {
        Alert.alert('Error', 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      Alert.alert('Error', 'Failed to confirm order');
    }
  };
  const handleConfirmCompleteOrder = async () => {
    try {
      const requestBody = {
        status: 5,
        orderId: order?.orderId,
      };
      const response = await axios.put(`${BASE_URL}order/change`, requestBody);
      if (response.status === 200) {
        Alert.alert('Order Confirmed', 'Your order has been confirmed successfully');

      } else {
        Alert.alert('Error', 'Failed to confirm order');
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      Alert.alert('Error', 'Failed to confirm order');
    }
  };

  const [statusName, setStatusName] = useState('');

  useEffect(() => {
    if (order?.orderStatus === 0) {
      setStatusName('Chờ Xác Nhận');
    }
    else if (order?.orderStatus === 1) {
      setStatusName('Chờ Đóng Gói');
    }
    else if (order?.orderStatus === 2) {
      setStatusName('Đã Đóng Gói, Chờ Lấy Hàng');
    }
    else if (order?.orderStatus === 3) {
      setStatusName('Đang Giao Hàng');
    }
    else if (order?.orderStatus === 4) {
      setStatusName('Đã Giao Hàng, Chờ Xác Nhận');
    }
    else if (order?.orderStatus === 5) {
      setStatusName('Hoàn Tất');
    }
  }, [order?.orderStatus]); // Chỉ chạy khi order.orderStatus thay đổi
  return (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text>{new Date(order.orderDate).toISOString().split('T')[0]}</Text>

        <Text style={styles.orderStatus}>{statusName}</Text>
      </View>

      {/* Lặp qua các sản phẩm */}
      {order?.items?.[0]?.cartItem?.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <Image source={{ uri: product.productImage }} style={styles.productImage} />

          <View style={styles.productDetails}>
            <View style={styles.productInfoContainer}>
              <Text style={styles.productName}>{truncateName(product.productName)}</Text>
              <View style={styles.productInfo}>
                <Text>Màu: {product.productSize}</Text>
                <Text>x{product.productQuantity}</Text>
              </View>
            </View>
            <View style={{ marginRight: 10 }}>
              <Text>{Number(product.productTotalPrice).toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>
        </View>

      ))}

      <View style={styles.totalContainer}>
        <Text>Tổng</Text>
        <Text style={styles.totalPrice}>{Number(order.orderTotal).toLocaleString('vi-VN')} đ</Text>
      </View>

      {
        order.orderStatus === 1 ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                disabled // Kiểm soát trạng thái nhấn
                style={styles.disable} // Áp dụng style dựa trên trạng thái
              >
                <Text style={styles.confirmText}>Xác Nhận Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.orderStatus === 2 ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                disabled // Kiểm soát trạng thái nhấn
                style={styles.disable} // Áp dụng style dựa trên trạng thái
              >
                <Text style={styles.confirmText}>Xác Nhận Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.orderStatus === 0 ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelOrder}
              >
                <Text style={styles.cancelText}>Hủy đơn</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmOrder}
              >
                <Text style={styles.confirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.orderStatus === 3 ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                disabled // Kiểm soát trạng thái nhấn
                style={styles.disable} // Áp dụng style dựa trên trạng thái
              >
                <Text style={styles.confirmText}>Xác Nhận Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.orderStatus === 4 ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              {/* <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.cancelText}>Trả Hàng</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmCompleteOrder}
              >
                <Text style={styles.confirmText}>Xác Nhận Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.orderStatus === 5 ? (
          <View style={styles.buttonContainer}>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.confirmText}>Đánh Giá</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null
      }

    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  orderStatus: {

    color: '#3669C9',
    fontSize: 15,
    fontWeight: 'bold',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    flex: 1,
  },
  productInfoContainer: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  productInfo: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    alignItems: 'center',
  },
  totalPrice: {
    color: '#3669C9',
    fontWeight: '700',
    fontSize: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 50,
    maxWidth: 300,
    width: 100,
    marginHorizontal: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  cancelText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#aaa',
  },
  disable: {
    backgroundColor: '#ccc',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    opacity: 0.6, // Làm mờ nút khi bị vô hiệu
  },
  confirmButton: {
    backgroundColor: '#3669C9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
});

export default OrderItem;
