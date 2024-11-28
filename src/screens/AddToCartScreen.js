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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';

import CartItem from '../components/CartItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';
import axios from 'axios';
import AlertComponent from '../components/AlertComponent';


function AddToCartScreen({ route, navigation }) {
  const layout = useWindowDimensions(); // Lấy thông tin kích thước màn hình

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Tiền mặt');
  const [selectedPaymentIcon, setSelectedPaymentIcon] = useState(require('../assets/wallet.png'));
  const [selectedPaymentUse, setSelectedPaymentUse] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [invoiceOption, setInvoiceOption] = useState(false);
  const [idCart, setIdCart] = useState([]);

  const [cartData, setCartData] = useState([]);
  const [cartDataUser, setCartDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productsState, setProductsState] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [couponAll, setCouponAll] = useState([]);
  const [shipperCoupons, setShipperCoupons] = useState([]);

  const [couponName, setCouponName] = useState();
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Coupon được chọn
  const [discount, setDiscount] = useState(0); // Giá trị khuyến mãi
  const [discountShip, setDiscountShip] = useState(0); // Giá trị khuyến mãi
  const [shippingFee, setShippingFee] = useState(20000); // Giá trị khuyến mãi
  const [orderNote, setOrderNote] = useState('');

  const { alertVisible, alertType } = route.params || {}; // Nhận params từ navigation
  const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);
  const [isCouponModal, setIsCouponModal] = useState(false);


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

  const fetchData = async () => {
    // Lấy dữ liệu giỏ hàng từ API nếu userId tồn tại
    setIsLoading(true);
    const apiUrl = `${BASE_URL}carts/user/${userInfo?.userId}`;
    try {
      const response = await axios.get(apiUrl);
      const userData = response.data.data.cartItem;
      const cartTotal = response.data.data.productTotalPrice;
      const idCart = response.data.data.cartId;
      setIdCart(idCart)
      setCartDataUser(userData); // Lưu giỏ hàng vào state
      setTotal(parseInt(cartTotal.replace(/\./g, '').replace('₫', '').trim(), 10));
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [userInfo?.userId]);
  const [title, setTitle] = useState('');


  const handleQuantityChangeUser = async (id, isDecrease, sizeId) => {
    // Nếu giảm, kiểm tra số lượng không dưới 1 trước khi gửi yêu cầu

    if (cartDataUser.productQuantity < 1) {
      console.warn("Số lượng không thể nhỏ hơn 1.");
      return;
    }
    // Chuẩn bị payload
    const cartItemData = {
      cartItem: {
        productQuantity: 1, // -1 nếu giảm, +1 nếu tăng
        productId: id,
        sizeId: sizeId,
      },
    };

    try {
      // Gửi yêu cầu tương ứng dựa trên hành động
      const response = isDecrease
        ? await axios.delete(`${BASE_URL}cart/${idCart}`, { data: cartItemData }) // Xóa sản phẩm nếu giảm
        : await axios.put(`${BASE_URL}cart/${idCart}`, cartItemData); // Cập nhật nếu tăng

      if (response.status === 200 || response.status === 201) {
        console.log("Cập nhật giỏ hàng thành công:", response.data);
        fetchData();
      } else {
        console.error("Không thể cập nhật giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };
  const handleInputQuantityChangeUser = async (id, sizeId, oldQuantity, newQuantity) => {
    // Kiểm tra hợp lệ
    if (newQuantity < 1) {
      console.warn("Số lượng không thể nhỏ hơn 1.");
      return;
    }

    try {
      if (oldQuantity > newQuantity) {
        // Trường hợp giảm số lượng
        const difference = oldQuantity - newQuantity; // Số lượng cần giảm
        const cartItemData = {
          cartItem: {
            productQuantity: difference, // Giảm đúng số lượng chênh lệch
            productId: id,
            sizeId: sizeId,
          },
        };

        const response = await axios.delete(`${BASE_URL}cart/${idCart}`, {
          data: cartItemData,
        });

        if (response.status === 200 || response.status === 201) {
          // console.log("Đã giảm số lượng sản phẩm:", response.data);
          fetchData(); // Làm mới dữ liệu giỏ hàng
        } else {
          console.error("Không thể giảm số lượng sản phẩm:", response.data.message);
        }
      } else if (oldQuantity < newQuantity) {
        // Trường hợp tăng số lượng
        const difference = newQuantity - oldQuantity; // Số lượng cần tăng
        const cartItemData = {
          cartItem: {
            productQuantity: difference, // Tăng đúng số lượng chênh lệch
            productId: id,
            sizeId: sizeId,
          },
        };

        const response = await axios.put(`${BASE_URL}cart/${idCart}`, cartItemData);

        if (response.status === 200 || response.status === 201) {
          // console.log("Đã tăng số lượng sản phẩm:", response.data);
          fetchData(); // Làm mới dữ liệu giỏ hàng
        } else {
          console.error("Không thể tăng số lượng sản phẩm:", response.data.message);
        }
      } else {
        // Nếu không thay đổi số lượng, không làm gì
        console.log("Số lượng không thay đổi.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý cập nhật số lượng:", error);
    }
  };



  // Delete item from cart
  const handleDeleteUser = async (id, quantity, size) => {
    const cartItemData = {
      cartItem: {
        productId: id,
        sizeId: size,
      },
    };
    try {
      // Gửi yêu cầu xoá sản phẩm
      const response = await axios.delete(`${BASE_URL}cart/${idCart}`, {
        data: cartItemData,
      });

      if (response.status === 200) {
        console.log("Sản phẩm đã được xoá:", response.data);

        // Cập nhật giỏ hàng ngay trong state
        const updatedCart = cartDataUser.filter(
          (item) => !(item.productId === id && item.productSizeId === size)
        );
        setCartDataUser(updatedCart);

        // Nếu cần, cập nhật tổng giá trị giỏ hàng
        const newTotal = updatedCart.reduce(
          (sum, item) => sum + item.productDiscountPrice * item.productQuantity,
          0
        );
        setTotal(newTotal);

        // Hiển thị thông báo thành công
        setIsAlertVisible(true);
        setTitle('Xoá Sản Phẩm Thành Công')
      } else {
        console.error("Không thể xoá sản phẩm khỏi giỏ hàng:", response.data.message);
      }
    } catch (error) {
      // console.error("Lỗi khi xoá sản phẩm:", error.message);
      setIsAlertVisible(true);
      // setAlertType("error");
    }
  };


  const fetchCouponsByType = async (type, setCouponsState) => {
    setIsLoading(true);
    const apiUrl = `${BASE_URL}coupons/type/${type}`;
    try {
      const response = await axios.get(apiUrl);
      setCouponsState((prevState) => [...prevState, ...(response.data.data || [])]);
      setIsLoading(false);
    } catch (error) {
      console.error(`Error fetching coupons of type ${type}:`, error);
      setIsLoading(false);
    }
  };
  // Usage
  useEffect(() => {
    [0, 1].forEach((type) => fetchCouponsByType(type, setCouponAll));
  }, []);
  useEffect(() => {
    if (userInfo) fetchCouponsByType(2, setShipperCoupons);
  }, [userInfo]);

  const CouponSale = () => (
    <FlatList
      data={couponAll}
      renderItem={renderCoupon}
      keyExtractor={(item) => item.couponId}
    />
  );

  const CouponFeeShip = () => (
    <FlatList
      data={shipperCoupons}
      renderItem={renderCoupon}
      keyExtractor={(item) => item.couponId}
    />
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'CouponSale', title: 'Voucher' },
    { key: 'CouponFeeShip', title: 'FreeShip' },
  ]);

  const toggleCouponModal = () => {
    setIsCouponModal(!isCouponModal);
  };
  const renderCoupon = ({ item }) => {
    const discountInfo = item.couponPerHundred
      ? `${item.couponPerHundred}%`
      : item.couponFeeShip
        ? `${item.couponFeeShip}%`
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
          <Icon
            name={selectedCoupon && selectedCoupon.couponId === item.couponId ? 'dot-circle-o' : 'circle-o'}
            size={25}
            color="#3669c9"
          />
        </TouchableOpacity>
      </View>
    );
  };
  const handleSelectCoupon = (coupon) => {
    if (selectedCoupon?.couponId === coupon.couponId) {
      // Nếu coupon đã được chọn, xóa trạng thái
      setSelectedCoupon(null);
      setCouponName('');
    } else {
      // Nếu coupon chưa được chọn, chọn coupon mới
      setSelectedCoupon(coupon);
      setCouponName(coupon.couponName);
    }
    toggleCouponModal(); // Đóng modal sau khi chọn
  };

  useEffect(() => {
    if (selectedCoupon != null && total) {
      let discountValue = 0;
      if (selectedCoupon.couponPerHundred) {
        discountValue = (total * selectedCoupon.couponPerHundred) / 100;
        setDiscount(discountValue);
        setDiscountShip(0)

      }
      else if (selectedCoupon.couponFeeShip) {
        discountValue = (shippingFee * selectedCoupon.couponFeeShip) / 100;
        setDiscountShip(discountValue)
        setDiscount(0);

      }
      else if (selectedCoupon.couponPrice) {
        discountValue = selectedCoupon.couponPrice;
        setDiscount(discountValue);
        setDiscountShip(0)
      }

    }
    else {
      setDiscount(0);
      setDiscountShip(0);
    }
  }, [total, selectedCoupon, shippingFee]);


  // Tính tổng cuối cùng
  const finalTotal = total
    ? (discount ? total - discount + shippingFee : total - discountShip + shippingFee)
    : 0;
  const handleOrder = async () => {
    setIsLoading(true);
    const apiUrl = `${BASE_URL}order/user`;


    const orderData = {
      user: userInfo?.userId,
      orderCoupon: selectedCoupon ? [selectedCoupon.couponId] : [],
      orderNote: orderNote,
      orderPayment: selectedPaymentMethod === 'Tiền mặt' ? 1 : 0,
      totalPrice: finalTotal,
    };
    console.log(orderData);

    try {
      // Make the API call to place the order
      const response = await axios.post(apiUrl, orderData);

      // Handle the response
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Order placed successfully!');
        navigation.navigate('OrderConfirmationScreen', { order: response.data.order });
      } else {
        Alert.alert('Error', 'Failed to place the order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place the order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 20 }}>
        <View>
          <Text style={styles.deliveryHeaderText}>Giao hàng đến</Text>

          <View style={styles.deliveryAddressContainer}>
            <Icon name="map-marker" size={18} color="#3669C9" />
            <Text style={styles.deliveryAddressText}>
              {userInfo?.address.addressName}{'\n'}
              {userInfo?.address.ward}, {userInfo?.address.district}, {userInfo?.address.city}
            </Text>
            <TouchableOpacity>
              <Icon name="edit" size={18} color="#3669C9" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{ marginHorizontal: 2 }}>
            {
              userInfo?.userId ? (
                cartDataUser.length > 0 ? (
                  cartDataUser.map((item, index) => (
                    <CartItem
                      key={index}
                      id={item.productId}
                      name={item.productName}
                      price={item.productDiscountPrice}
                      oldPrice={item.productPrice}
                      initialQuantity={item.productQuantity}
                      sizeId={item.productSizeId}
                      size={item.productSize}
                      image={item.productImage}
                      total={(item.productTotalPrice).toLocaleString() + " ₫"}
                      onDelete={handleDeleteUser}
                      onQuantityChange={handleQuantityChangeUser}
                      onInput={handleInputQuantityChangeUser}
                    />
                  ))
                ) : (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center', overflow: 'hidden', marginVertical: 10
                  }}>
                    <Image source={require('../assets/NoItemCart.png')}
                      style={{
                        width: '100%',
                        height: 200,

                      }} />
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>Giỏ Hàng Của Bạn Trống</Text>
                  </View>

                )
              ) : (
                null
              )
            }
          </View>
          <View style={{ marginTop: 10, gap: 10 }}>
            <Text>Ghi Chú</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Nhập Ghi Chú"
              value={orderNote}
              onChangeText={setOrderNote}
            />
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
                {couponName ? "Đã Chọn " + couponName : ('Chọn Mã Giảm Giá')}
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
              <Text style={{ color: '#000', marginVertical: 5, fontSize: 15, }}>{total ? total?.toLocaleString() + " ₫" : 0 + " ₫"}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}
            >
              <Text style={{ marginVertical: 5, fontSize: 15, }}>Phí giao hàng:</Text>
              <Text style={{ color: '#000', marginVertical: 5, fontSize: 15, }}>{shippingFee.toLocaleString()} ₫</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={{ marginVertical: 5, fontSize: 15, }}>Khuyến mãi vouchers:</Text>
              <Text style={{ color: '#3669C9', marginVertical: 5, fontSize: 15, }}>- {discount.toLocaleString()} ₫</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <Text style={{ marginVertical: 5, fontSize: 15, }}>Giảm Giá Phí giao hàng:</Text>
              <Text style={{ color: '#3669C9', marginVertical: 5, fontSize: 15, }}>- {discountShip.toLocaleString()} ₫</Text>
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
              backgroundColor: cartDataUser.length === 0 ? '#ccc' : '#3669C9', // Thay đổi màu nếu disabled
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 20,
              borderRadius: 10,
              opacity: cartDataUser.length === 0 ? 0.7 : 1, // Làm mờ nếu disabled
            }}
            disabled={cartDataUser.length === 0} // Disabled khi giỏ hàng rỗng
            onPress={handleOrder}
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
          {/* <ScrollView>
            {couponAll.map((item) => (
              <View key={item.couponId.toString()}>
                {renderCoupon({ item })}
              </View>
            ))}
          </ScrollView> */}
          <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap({
              CouponSale: CouponSale,
              CouponFeeShip: CouponFeeShip,
            })}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={(props) => (
              <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#3669c9' }}
                style={{ backgroundColor: 'white' }}
                labelStyle={{ color: '#000' }}
              />
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={toggleCouponModal}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <AlertComponent
        title={alertType === 'success' ? 'Success' : 'Error'}
        description={
          alertType === 'success' ? (title == '' ? 'Thêm Sản Phẩm Thành Công.' : 'Xoá Sản Phẩm Thành Công.') : (null)
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
  deliveryHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  deliveryAddressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  deliveryAddressText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 14,
    color: '#555',
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
  noteInput: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    opacity: 0.85,
    marginBottom: 10,
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

export default AddToCartScreen;
