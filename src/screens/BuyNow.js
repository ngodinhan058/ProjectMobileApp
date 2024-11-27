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
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CartItem from '../components/CartItem_v2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';
import axios from 'axios';
import AlertComponent from '../components/AlertComponent';


function BuyNow({ route, navigation }) {
  const { product, alertVisible, alertType, size, quantity, total } = route.params || {}; // Nhận params từ navigation
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tiền mặt');
  const [selectedPaymentIcon, setSelectedPaymentIcon] = useState(require('../assets/wallet.png'));
  const [selectedPaymentUse, setSelectedPaymentUse] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [invoiceOption, setInvoiceOption] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [couponAll, setCouponAll] = useState([]);
  const [couponName, setCouponName] = useState();

  const [selectedCoupon, setSelectedCoupon] = useState(null); // Coupon được chọn
  const [discount, setDiscount] = useState(0); // Giá trị khuyến mãi
  const [shippingFee, setShippingFee] = useState(20000); // Giá trị khuyến mãi
  const [isCouponModal, setIsCouponModal] = useState(false);

  const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);
  const img = product?.productImages[0];
  const convertTotal = total.toLocaleString() + " ₫"

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
  // Size ID
  const selectedProductSize = product.productSizes.find(
    (sizeId) => sizeId.productSizeName === size
  );

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = `${BASE_URL}coupons`;
    axios.get(apiUrl)
      .then(response => {
        const couponData = response.data.data.content;
        setCouponAll(couponData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  const toggleCouponModal = () => {
    setIsCouponModal(!isCouponModal);
  };
  const renderCoupon = ({ item }) => {
    const discountInfo = item.couponPerHundred
      ? `${item.couponPerHundred}%`
      : `${item.couponPrice} đ`;

    return (
      <View>
        <TouchableOpacity style={styles.couponItem} onPress={() => handleSelectCoupon(item)} >
          <View style={{
            width: 80, height: 80, borderWidth: 1, borderColor: '#eee', borderRadius: 70, shadowColor: '#000', backgroundColor: '#fff',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
            justifyContent: 'center',
          }}>
            <Text style={{ fontSize: 21, color: 'red', textAlign: 'center', }}>
              {discountInfo}
            </Text>
          </View>
          <View style={styles.couponDetails}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 20 }}>
              {item.couponName}
            </Text>

          </View>
          <View style={{ marginLeft: 10 }}>
            <Ionicons name="arrow-forward-circle-outline" size={25} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponName(coupon.couponName)
    toggleCouponModal();
  };
  useEffect(() => {
    if (selectedCoupon && total) {
      let discountValue = 0;
      if (selectedCoupon.couponPerHundred) {
        discountValue = (total * selectedCoupon.couponPerHundred) / 100;
      }
      else if (selectedCoupon.couponFeeShip) {
        discountValue = (shippingFee * selectedCoupon.couponFeeShip) / 100;
      }
      else if (selectedCoupon.couponPrice) {
        discountValue = selectedCoupon.couponPrice;
      }

      setDiscount(discountValue);
    }
  }, [total, selectedCoupon, shippingFee]);

  // Tính tổng cuối cùng
  const finalTotal = total ? total - discount + shippingFee : 0;




  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
            </View>
          </View>

          <View style={{ marginHorizontal: 2 }}>
            <CartItem
              key={product.productId}
              id={product.productId}
              name={product.productName}
              price={product.productPriceSale}
              oldPrice={product.productPrice}
              initialQuantity={quantity}
              size={size}
              image={img.productImagePath}
            // total={(product.productTotalPrice).toLocaleString() + " ₫"}
            />
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

          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Ưa Đãi Của Tôi</Text>
          <TouchableOpacity style={{
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
            padding: 20,
            margin: 2,
            marginVertical: 10,
            borderRadius: 10,
          }} onPress={toggleCouponModal}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 20,
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
          </TouchableOpacity>

          <View style={{ marginBottom: '20%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng Cộng:</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text style={{ marginVertical: 5, fontSize: 15, }}>Tổng tạm tính:</Text>
              <Text style={{ color: '#3669C9', marginVertical: 5, fontSize: 15, }}>{total.toLocaleString() + " ₫"}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={{ marginVertical: 5, fontSize: 15, }}>Khuyến mãi vouchers:</Text>
              <Text style={{ color: '#3669C9', marginVertical: 5, fontSize: 15, }}>- {discount.toLocaleString()} ₫</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text style={{ marginVertical: 5, fontSize: 15, }}>Phí giao hàng:</Text>
              <Text style={{ color: '#3669C9', marginVertical: 5, fontSize: 15, }}>{shippingFee.toLocaleString()} ₫</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{
        width: '100%', height: '25%', borderTopRightRadius: 30, borderTopLeftRadius: 30, backgroundColor: '#fff',
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
            <Text style={{ color: '#3669C9', fontSize: 16, fontWeight: 'bold' }}>{finalTotal.toLocaleString() + " ₫"}</Text>
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
      <Modal visible={isCouponModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={toggleCouponModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalCouponBackground}>
          <Text style={styles.modalTitle}>Chọn Mã Khuyến Mãi</Text>
          <ScrollView>
            {couponAll.map((item) => (
              <View key={item.couponId.toString()}>
                {renderCoupon({ item })}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={toggleCouponModal}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <AlertComponent
        title={alertType === 'success' ? 'Success' : 'Error'}
        description={
          alertType === 'success'
            ? 'Thêm Sản Phẩm Thành Công.'
            : 'Thêm Sản Phẩm Thất Bại.'
        }
        alertType={alertType}
        visible={isAlertVisible}
        onClose={() => setIsAlertVisible(false)}
      />

      {/* {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )} */}
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
  modalCouponBackground: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
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
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  couponDetails: {
    flex: 1,
    textAlign: 'center',
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

export default BuyNow;
