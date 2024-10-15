import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderItem = ({ order }) => { // Nhận order từ props
  const [loading, setLoading] = useState(true); // Track the loading state
  const shimmerAnim = useRef(new Animated.Value(0)).current; // Shimmer animation value
  const navigation = useNavigation();

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };

  // Shimmer animation effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    setTimeout(() => {
      setLoading(false); // Dừng loading sau 2 giây (hoặc khi tải xong)
    }, 2000);
  }, [shimmerAnim]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3669C9" />
        <Text>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text>{order.date}</Text>
        <Text style={styles.orderStatus}>{order.status}</Text>
      </View>

      {/* Lặp qua các sản phẩm */}
      {order.products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          <Image source={{ uri: product.image.uri }} style={styles.productImage} />

          <View style={styles.productDetails}>
            <View>
              <Text style={{ fontWeight: 'bold' }}>{truncateName(product.name)}</Text>
              <View style={styles.productInfo}>
                <Text>Màu: {product.color}</Text>
                <Text>x{product.quantity}</Text>
              </View>
            </View>
            <View style={{ marginRight: 10, }}><Text>{product.price}đ</Text></View>
          </View>
        </View>
      ))}

      <View style={styles.totalContainer}>
        <Text>Tổng</Text>
        <Text style={styles.totalPrice}>{order.total}đ</Text>
      </View>

      {
        order.status === "Chuẩn Bị Hàng" ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.cancelText}>Hủy đơn</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.status === "Đang Giao Hàng" ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.cancelText}>Hủy đơn</Text>
              </TouchableOpacity>
             
            </View>
          </View>
        ) : order.status === "Chờ Xác Nhận" ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.cancelText}>Hủy đơn</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.confirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.status === "Đang Giao Hàng" ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.navigate('')} 
              >
                <Text style={styles.confirmText}>Xác Nhận Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.status === "Đã Giao Hàng, Hãy Xác Nhận" ? (
          <View style={styles.buttonContainer}>
             <View style={styles.button}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.navigate('')}
              >
                <Text style={styles.cancelText}>Trả Hàng</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.button}>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.navigate('')} 
              >
                <Text style={styles.confirmText}>Xác Nhận Thanh Toán</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.status === "Đã Giao Hàng" ? (
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
        ) : order.status === "Đã Huỷ" ? (
          <View style={styles.buttonContainer}>
             
            <View style={styles.button}>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.navigate('')} 
              >
                <Text style={styles.confirmText}>Mua Lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : order.status === "Trả Hàng" ? (
          <View style={styles.buttonContainer}>
             
            <View style={styles.button}>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => navigation.navigate('')} 
              >
                <Text style={styles.confirmText}>Chi Tiết Hoàn Tiền</Text>
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
    marginVertical: 10
  },
  productImage: {
    width: 80,
    height: 80,

  },
  productDetails: {
    flexDirection: 'row',
    gap: 40,
    marginHorizontal: 10,
  },
  productInfo: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderRadius: 1000,
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
  confirmButton: {
    backgroundColor: '#3669C9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
  },
  confirmText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
});

export default OrderItem;
