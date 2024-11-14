import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartItem from '../components/CartItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';
import axios from 'axios';


function AddToCartScreen({ navigation }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tiền mặt');
  const [selectedPaymentIcon, setSelectedPaymentIcon] = useState(require('../assets/wallet.png'));
  const [selectedPaymentUse, setSelectedPaymentUse] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [invoiceOption, setInvoiceOption] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [cartDataUser, setCartDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [total, setTotal] = useState();


  const paymentOptions = [
    { label: 'Tiền mặt', icon: require('../assets/wallet.png'), use: true },
    { label: 'Ví Mega (Đang cập nhập)', icon: require('../assets/star.png'), use: false },
    { label: 'Ví MoMo (Đang cập nhập)', icon: require('../assets/star.png'), use: false },
  ];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectPayment = (method, methodIcon, use) => {

    if (use == false) {
      Alert.alert("Thông Báo", "Phương Thức Đang Cập Nhập")
    } else {
      setSelectedPaymentMethod(method)
      setSelectedPaymentIcon(methodIcon)
      toggleModal();

    }
  };
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy dữ liệu từ AsyncStorage
        const userInfoString = await AsyncStorage.getItem('userInfo');

        // Nếu có dữ liệu thì parse nó thành JSON
        if (userInfoString) {
          const userInfoData = JSON.parse(userInfoString);
          setUserInfo(userInfoData); // Lưu vào state
        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      }
    };

    fetchUserInfo();
  }, []);
  // console.log(userInfo?.userId);


  useEffect(() => {
    if (userInfo?.userId == null) {
      // Nếu userId không có, lấy dữ liệu giỏ hàng từ AsyncStorage
      const loadCartData = async () => {
        try {
          const savedCart = await AsyncStorage.getItem('cart');
          if (savedCart) {
            const { items } = JSON.parse(savedCart);
            setCartData(items); // Lưu cart vào state
          }
        } catch (error) {
          console.error("Error loading cart from AsyncStorage:", error);
        }
      };

      loadCartData();
    } else {
      // Nếu userId có, lấy dữ liệu giỏ hàng từ API
      setIsLoading(true);
      const apiUrl = `${BASE_URL}carts/user/${userInfo.userId}`;
      axios.get(apiUrl)
        .then(response => {
          const userData = response.data.data.cartItem;
          const cartTotal = response.data.data.productTotalPrice
          setCartDataUser(userData); // Lưu giỏ hàng vào state
          setTotal(cartTotal)
          setIsLoading(false);
        })
        .catch(error => {
          console.log('Error fetching data:', error);
        });
    }
  }, [userInfo?.userId]); // Chạy lại khi userInfo?.userId thay đổi





  const handleQuantityChange = (id, newQuantity, price) => {
    const basePrice = parseInt(price.replace(/\D/g, ''), 10);
    if (newQuantity === 0) {
      // Remove item if new quantity is 0
      const updatedCart = cartData.filter((item) => item.id !== id);
      setCartData(updatedCart);
      saveCartData(updatedCart);
    } else {
      // Update quantity and price for the item with the matching id
      const updatedCart = cartData.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: newQuantity,
            total: (basePrice * newQuantity).toLocaleString() + " ₫"
          }
          : item
      );
      setCartData(updatedCart);
      saveCartData(updatedCart);
    }
  };

  // Delete item from cart
  const handleDelete = (id) => {
    const updatedCart = cartData.filter((item) => item.id !== id);
    setCartData(updatedCart);
    saveCartData(updatedCart);
  };
  // Delete item from cart
  const handleDeleteUser = (id, quantity, size) => {
    const cartItemData = {
      cartItem: {
        productQuantity: quantity,
        productId: id,
        sizeId: size
      }
    };
    console.log(cartItemData);

    try {
      // Gửi yêu cầu POST đến API để thêm sản phẩm vào giỏ hàng
      const response = axios.delete(`${BASE_URL}cart/01000000-0000-0000-0000-000000000000`, cartItemData);

      if (response.status === 200) {
        console.log("Sản phẩm đã được xoá:", response.data);
        // Cập nhật state giỏ hàng nếu cần
      } else {
        console.error("Không thể thêm sản phẩm vào giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    }
  };

  // Save updated cart to AsyncStorage
  const saveCartData = async (updatedCart) => {
    try {
      const cartData = { items: updatedCart };
      await AsyncStorage.setItem('cart', JSON.stringify(cartData));
    } catch (error) {
      console.error("Error saving cart to AsyncStorage:", error);
    }
  };


  return (
    <View style={{ backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 20 }}>
        <View>
          <View>
            <Text>Giao hàng đến</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 20,
                marginTop: 10,
              }}
            >
              <Image source={require('../assets/location.png')} style={{ width: 18, height: 18 }} />
              <Text style={{ flex: 2 }}>{userInfo?.userAddress}</Text>
              {/* <Image source={require('../assets/edit.png')} style={{ width: 18, height: 18 }} /> */}
            </View>
          </View>

          <View style={{ marginHorizontal: 2 }}>

            {
              userInfo?.userId ? (
                cartDataUser.length > 0 ? (
                  cartDataUser.map((item, index) => (
                    <CartItem
                      key={index}
                      id={item.productId}
                      name={item.productName}
                      price={item.productPrice}
                      quantity={item.productQuantity}
                      size={item.productSize}
                      image={item.productImage}
                      total={(item.productTotalPrice).toLocaleString() + " ₫"}
                      onDelete={handleDeleteUser}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))
                ) : (
                  <Text>Giỏ hàng của bạn trống</Text>
                )
              ) : (
                cartData.length > 0 ? (
                  cartData.map((item, index) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      quantity={item.quantity}
                      size={item.size}
                      image={item.image}
                      total={item.total}
                      onDelete={handleDelete}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))
                ) : (
                  <Text>Giỏ hàng của bạn trống</Text>
                )
              )
            }
          </View>

          <View style={{ marginTop: 10, gap: 10 }}>
            <Text>Ghi Chú</Text>
            <TextInput
              style={{
                backgroundColor: '#ddd',
                padding: 10,
                borderRadius: 10,
                opacity: 0.25,
                marginBottom: 10
              }}
              placeholder="Nhập Ghi Chú"
            ></TextInput>
          </View>

          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Ưa Đãi Của Tôi</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 20,
                padding: 20,
                marginVertical: 10,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 10
              }}
            >
              <Image source={require('../assets/voucher.png')} style={{ width: 25, height: 23 }} />
              <Text
                style={{
                  flex: 2,
                  color: '#3669C9',
                }}
              >
                Chọn Mã Giảm Giá
              </Text>
              <Icon name="angle-right" size={22} color="#000" />
            </View>
          </View>

          <View style={{ marginBottom: '20%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng Cộng</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text>Tổng tạm tính</Text>
              <Text style={{ color: '#3669C9' }}>{total}</Text>
            </View>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text>Khuyến mãi</Text>
              <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text>Khuyến mãi vouchers</Text>
              <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text>Phí giao hàng</Text>
              <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
            </View> */}
          </View>
        </View>
      </ScrollView>
      <View style={{
        width: '100%', height: '50%', borderTopRightRadius: 30, borderTopLeftRadius: 30, backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        paddingHorizontal: 20,

      }}>
        <View>
          <Text style={{ color: '#3669C9', marginTop: 15, fontWeight: 'bold', fontSize: 15 }}>Phương thức thanh toán:</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
          {/* Phương thức thanh toán đã chọn */}
          <TouchableOpacity style={styles.paymentMethod} onPress={toggleModal}>
            <Image source={selectedPaymentIcon} style={styles.icon} />
            <Text style={styles.selectedPaymentText}>{selectedPaymentMethod}</Text>
            <Icon name="angle-down" size={22} color="#000" />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: '#3669C9', fontSize: 16, fontWeight: 'bold' }}>{total}</Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#3669C9',
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 20,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('OrderConfirmationScreen')}
          >
            <Text
              style={{ textAlign: 'center', fontWeight: '600', color: '#fff' }}
            >
              Thanh toán
            </Text>
          </TouchableOpacity>
          {/* Modal chọn phương thức thanh toán */}
          <Modal visible={isModalVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
                {paymentOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.option}
                    onPress={() => handleSelectPayment(option.label, option.icon, option.use)}
                  >
                    <Image source={option.icon} style={styles.optionIcon} />
                    <Text style={styles.optionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}

                {/* Nút đóng modal */}
                <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ccc'
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  selectedPaymentText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  price: {
    color: '#3669C9',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#3669C9',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 16,
    color: '#000',
  },
  invoiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  invoiceText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#3669C9',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddToCartScreen;
