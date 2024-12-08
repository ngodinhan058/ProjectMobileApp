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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';

import CartItem from '../components/CartItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './api/config';
import AlertComponent from '../components/AlertComponent';


function AddToCartScreen({ route, navigation }) {
  const layout = useWindowDimensions(); // Lấy thông tin kích thước màn hình

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [selectedPaymentName, setSelectedPaymentName] = useState('Tiền mặt');
  const [selectedPaymentIcon, setSelectedPaymentIcon] = useState(require('../assets/wallet.png'));
  const [selectedPaymentUse, setSelectedPaymentUse] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [invoiceOption, setInvoiceOption] = useState(false);
  const [idCart, setIdCart] = useState([]);
  const [idBuyNow, setIdBuyNow] = useState([]);

  const [cartData, setCartData] = useState([]);
  const [cartDataUser, setCartDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productsState, setProductsState] = useState([]);
  const [productsQuantity, setProductsQuantity] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [couponAll, setCouponAll] = useState([]);
  const [shipperCoupons, setShipperCoupons] = useState([]);

  const [couponName, setCouponName] = useState();
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Coupon được chọn
  const [discount, setDiscount] = useState(0); // Giá trị khuyến mãi
  const [discountShip, setDiscountShip] = useState(0); // Giá trị khuyến mãi
  const [shippingFee, setShippingFee] = useState(0); // Giá trị khuyến mãi
  const [orderNote, setOrderNote] = useState('');

  const { alertVisible, alertType } = route.params || {}; // Nhận params từ navigation
  const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);
  const [isCouponModal, setIsCouponModal] = useState(false);

  const [alertVisibleN, setAlertVisible] = useState(false);
  const [alertTypeN, setAlertType] = useState('success');
  const [titleAlert, setTitleAlert] = useState('');

  const [origin, setOrigin] = useState("53 Đường Võ Văn Ngân Linh Chiểu Thành Phố Thủ Đức Hồ Chí Minh"); // Địa chỉ bắt đầu
  const [destination, setDestination] = useState(""); // Địa chỉ kết thúc
  const [distance, setDistance] = useState(null);
  const [total, setTotal] = useState();

  const GOONG_API_KEY = "7d6NMyBGea1uqvClvnSeN9WC4ywy3hzbhoT0pwFI";

  const paymentOptions = [
    { label: 'Tiền mặt', icon: require('../assets/wallet.png'), use: true, value: 1 },
    { label: 'VnPay', icon: require('../assets/vnPay.png'), use: true, value: 0 },
    { label: 'ZaloPay', icon: require('../assets/star.png'), use: true, value: 2 },
    { label: 'Ví MoMo (Đang cập nhập)', icon: require('../assets/star.png'), use: false, value: 3 },
  ];

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectPayment = (method, methodIcon, use, value) => {
    if (!use) {
      Alert.alert("Thông Báo", "Phương Thức Đang Cập Nhập");
    } else {
      // Xác định giá trị của selectedPaymentMethod
      setSelectedPaymentName(method)
      setSelectedPaymentMethod(value);
      setSelectedPaymentIcon(methodIcon);
      toggleModal();
    }
  };
  const [userInfo, setUserInfo] = useState(null);
  const [guestInfo, setGuestInfo] = useState(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy dữ liệu từ AsyncStorage
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          const userInfoData = JSON.parse(userInfoString);
          setUserInfo(userInfoData); // Lưu vào state
          setDestination(
            `${userInfoData?.address?.addressName} ${userInfoData?.address?.ward} ${userInfoData?.address?.district} ${userInfoData?.address?.city}`
          );
          setIdBuyNow(userInfoData?.cartBuyNowId)

        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      }
    };

    fetchUserInfo();
  }, []);
  // console.log(userInfo?.userId);
  useEffect(() => {
    const fetchguestInfo = async () => {
      try {
        // Lấy dữ liệu từ AsyncStorage
        const guestInfoString = await AsyncStorage.getItem('guestInfo');
        if (guestInfoString) {
          const guestInfoData = JSON.parse(guestInfoString);
          setGuestInfo(guestInfoData); // Lưu vào state
          setDestination(
            `${guestInfoData.address.addressName} ${guestInfoData.address.ward} ${guestInfoData.address.district} ${guestInfoData.address.city}`
          );

        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      }
    };

    fetchguestInfo();
  }, []);
  const fetchUserCart = async () => {
    if (!userInfo?.userId) return;

    setIsLoading(true);
    const apiUrl = `${BASE_URL}carts/user/${userInfo?.userId}`;
    try {
      const response = await axios.get(apiUrl);
      const userData = response.data.data.cartItem;
      const cartTotal = response.data.data.productTotalPrice;
      const idCart = response.data.data.cartId;
      setIdCart(idCart);
      setCartDataUser(userData); // Lưu giỏ hàng vào state
      setTotal(parseInt(cartTotal.replace(/\./g, '').replace('₫', '').trim(), 10));
    } catch (error) {
      console.log('Error fetching user cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGuestCart = async () => {
    let storedUUID = await AsyncStorage.getItem('guestId');
    if (!storedUUID) return;

    setIsLoading(true);
    const apiUrl = `${BASE_URL}carts/guest/${storedUUID}`;
    try {
      const response = await axios.get(apiUrl);
      const userData = response.data.data.cartItem;
      const cartTotal = response.data.data.productTotalPrice;
      const idCart = response.data.data.cartId;

      await AsyncStorage.setItem('cartGuestId', idCart);
      setIdCart(idCart);
      setCartDataUser(userData); // Lưu giỏ hàng vào state
      setTotal(parseInt(cartTotal.replace(/\./g, '').replace('₫', '').trim(), 10));
    } catch (error) {
      console.log('Error fetching guest cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.userId) {
      fetchUserCart();
    } else {
      fetchGuestCart();
    }
  }, [userInfo?.userId]);

  // console.log(userInfo);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}order/cart/${idCart}`);
        if (response.status === 200 || responseBuyNow.status === 200) {
          Alert.alert(
            'Xác nhận lại đơn hàng',
            'Bạn muốn xác nhận lại đơn hàng??',
            [
              {
                text: 'Xem Chi Tiết',
                onPress: async () => {
                  navigation.navigate('OrderConfirmationScreen', { orderId: idCart });
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          console.log('Không có dữ liệu đơn hàng hoặc lỗi');
        }
      } catch (error) {
        // console.error('Error fetching order details:', error);
      }
    };
    fetchData(); // Gọi hàm async
  }, [idCart]);
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}order/cart/${idBuyNow}`);
        if (response.status === 200 && response?.data?.data?.orderStatus == 0) {
          Alert.alert(
            'Xác nhận lại đơn hàng',
            'Bạn muốn xác nhận lại đơn hàng??',
            [
              {
                text: 'Xem Chi Tiết',
                onPress: async () => {
                  navigation.navigate('OrderConfirmationScreen', { orderId: idBuyNow });
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          console.log('Không có dữ liệu đơn hàng hoặc lỗi');
        }
      } catch (error) {
        // console.error('Error fetching order details:', error);
      }
    };
    fetchCartDetails(); // Gọi hàm async
  }, [idBuyNow]);

  const [title, setTitle] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}products`);
      setProductsState(response.data.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, [])

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
        fetchUserCart();
        fetchGuestCart();

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
          fetchUserCart(); // Làm mới dữ liệu giỏ hàng
          fetchGuestCart();
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
          fetchUserCart(); // Làm mới dữ liệu giỏ hàng
          fetchGuestCart();
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

  const handleDeleteUser = async (id, quantity, size) => {
    const cartItemData = {
      cartItem: {
        productId: id,
        sizeId: size,
        productQuantity: quantity,
      },
    };

    try {
      // Gửi yêu cầu xoá sản phẩm từ giỏ hàng
      const response = await axios.delete(`${BASE_URL}cart/${idCart}`, {
        data: cartItemData,
      });

      if (response.status === 200) {
        console.log("Sản phẩm đã được xoá:", response.data);

        // Cập nhật giỏ hàng trong state sau khi xoá sản phẩm
        const updatedCart = cartDataUser.filter(
          (item) => !(item.productId === id && item.productSizeId === size)
        );
        setCartDataUser(updatedCart);

        // Cập nhật tổng giá trị giỏ hàng
        const newTotal = updatedCart.reduce(
          (sum, item) => sum + item.productDiscountPrice * item.productQuantity,
          0
        );
        setTotal(newTotal);

        // Hiển thị thông báo thành công
        setIsAlertVisible(true);
        setTitle('Xoá Sản Phẩm Thành Công');
      } else {
        console.error("Không thể xoá sản phẩm khỏi giỏ hàng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm:", error.message);
      // Hiển thị thông báo lỗi nếu có
      setIsAlertVisible(true);
      setTitle('Có lỗi khi xoá sản phẩm. Vui lòng thử lại!');
    } finally {
      // Cập nhật lại giỏ hàng sau khi xoá sản phẩm
      fetchUserCart();
      fetchGuestCart();
    }
  };
  const fetchCouponsByType = async (type, setCouponsState) => {
    const apiUrl = `${BASE_URL}coupons/type/${type}`;
    try {
      const response = await axios.get(apiUrl);
      setCouponsState((prevState) => [...prevState, ...(response.data.data || [])]);
    } catch (error) {
      console.error(`Error fetching coupons of type ${type}:`, error);
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
  const calculateShippingFee = (distance) => {
    const basePrice = 10000;
    const baseDistance = 2;
    const extraPricePerKm = 5000;

    if (distance <= baseDistance) {
      return basePrice;
    }

    const extraDistance = distance - baseDistance;
    return basePrice + extraDistance * extraPricePerKm;
  };

  const calculateDistance = async () => {
    try {
      const geocodeAddress = async (address) => {
        const response = await axios.get(
          `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${GOONG_API_KEY}`
        );
        return response.data.results[0].geometry.location;
      };

      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      const response = await axios.get(
        `https://rsapi.goong.io/DistanceMatrix?origins=${originCoords.lat},${originCoords.lng}&destinations=${destinationCoords.lat},${destinationCoords.lng}&vehicle=car&api_key=${GOONG_API_KEY}`
      );

      const data = response.data;
      if (data.rows && data.rows[0].elements[0].distance) {
        const distanceInMeters = data.rows[0].elements[0].distance.value;
        const distanceInKm = (distanceInMeters / 1000).toFixed(2);
        setDistance(distanceInKm);
        return distanceInKm;
      } else {
        alert("Không thể tính toán khoảng cách!");
        return null;
      }
    } catch (error) {
      console.error("Lỗi:", error.response?.data || error.message);
      alert("Đã xảy ra lỗi khi tính khoảng cách!");
      return null;
    }
  };
  useEffect(() => {
    if (distance !== null) {
      if (distance > 250) {
        setShippingFee(100000);
      } else {
        setShippingFee(calculateShippingFee(distance));
      }
    }
  }, [distance]);

  useEffect(() => {
    if (origin && destination) {
      calculateDistance();
    }
  }, [origin, destination]);
  // Tính tổng cuối cùng
  const finalTotal = total
    ? (discount ? total - discount + shippingFee : total - discountShip + shippingFee)
    : 0;




  const handleOrder = async () => {
    setIsLoading(true);
    const apiUrl = `${BASE_URL}order/user`;
    const apiPaymentUrl = `${BASE_URL}payment/vn-pay?amount=${finalTotal}&bankCode=NCB`;
    const apiPaymentUrlZalo = `https://5b80-2405-4802-9154-3a80-b09e-e709-6843-4dae.ngrok-free.app/payment`;
    // console.log("discountShip",discountShip <= 0 ? shippingFee : discountShip);

    const orderData = {
      user: userInfo?.userId,
      orderCoupon: selectedCoupon ? [selectedCoupon.couponId] : [],
      orderNote: orderNote,
      orderPayment: selectedPaymentMethod,
      feeShip: discountShip == 0 ? shippingFee : shippingFee - discountShip,

      totalPrice: finalTotal,
    };

    console.log(orderData);

    if (selectedPaymentMethod === 0) {
      try {
        const paymentResponse = await axios.get(apiPaymentUrl);

        if (paymentResponse.status !== 200 || paymentResponse.data.code !== 200) {
          Alert.alert('Error', 'Không thể tạo giao dịch thanh toán. Vui lòng thử lại.');
          setIsLoading(false);
          return;
        }
        const paymentUrl = paymentResponse.data.data.paymentUrl;

        // Điều hướng đến màn hình thanh toán
        navigation.navigate('PaymentWebViewScreen', { url: paymentUrl, orderData, orderId: idCart });
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    } else if (selectedPaymentMethod === 2) { // ZaloPay Payment
      try {
        const paymentResponse = await axios.post(apiPaymentUrlZalo, {
          amount: finalTotal,
          bankCode: "zalopayapp",
          user: userInfo?.userId,
        });

        if (paymentResponse.status === 200) {
          const { order_url, trans_id } = paymentResponse.data;
          navigation.navigate('PaymentScreen', { url: order_url, orderData, transId: trans_id });
        } else {
          Alert.alert('Error', 'Không thể tạo giao dịch thanh toán. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error creating ZaloPay transaction:', error);
        Alert.alert('Error', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);

      }
    }
    else {
      try {
        // Gọi API đặt hàng
        const response = await axios.post(apiUrl, orderData);

        if (response.status === 200 || response.status === 201) {
          navigation.navigate('OrderConfirmationScreen', { orderId: idCart });
        } else {
          Alert.alert('Error', 'Failed to place the order. Please try again.');
        }
      } catch (error) {
        console.error('Error during payment or order:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

  };
  const handlePlaceOrder = async () => {
    const apiUrl = `${BASE_URL}order/guest`;
    const apiPaymentUrl = `${BASE_URL}payment/vn-pay?amount=${finalTotal}&bankCode=NCB`;

    const orderData = {
      cart: idCart,
      orderCoupon: selectedCoupon ? [selectedCoupon.couponId] : [],
      orderNote: orderNote,
      orderPayment: selectedPaymentMethod,
      feeShip: discountShip == 0 ? shippingFee : shippingFee - discountShip,
      totalPrice: finalTotal,
      userName: guestInfo.userName,
      userPhone: guestInfo.userPhone,
      userEmail: guestInfo.userEmail,
      userAddress: guestInfo.address.userAddress,
      userDistrict: guestInfo.address.district,
      userCity: guestInfo.address.city,
      userWard: guestInfo.address.ward,
    };
    // console.log(orderData);

    if (selectedPaymentMethod === 0) {
      try {
        const paymentResponse = await axios.get(apiPaymentUrl);

        if (paymentResponse.status !== 200 || paymentResponse.data.code !== 200) {
          Alert.alert('Error', 'Không thể tạo giao dịch thanh toán. Vui lòng thử lại.');
          setIsLoading(false);
          return;
        }
        const paymentUrl = paymentResponse.data.data.paymentUrl;

        // Điều hướng đến màn hình thanh toán
        navigation.navigate('PaymentWebViewScreen', { url: paymentUrl, orderData, orderId: idCart });
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    }
    else {
      try {
        // Gọi API đặt hàng
        const response = await axios.post(apiUrl, orderData);

        if (response.status === 200 || response.status === 201) {
          navigation.navigate('OrderConfirmationScreen', { orderId: idCart });
        } else {
          Alert.alert('Error', 'Failed to place the order. Please try again.');
        }
      } catch (error) {
        console.error('Error during payment or order:', error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  // useEffect (() =>  {
  //   AsyncStorage.removeItem('guestInfo')
  // }, [])
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ padding: 20 }}>
        <View>
          <Text style={styles.deliveryHeaderText}>Giao hàng đến</Text>

          <View style={styles.deliveryAddressContainer}>
            <Icon name="map-marker" size={18} color="#3669C9" />
            {userInfo ?
              (<Text style={styles.deliveryAddressText}>
                {userInfo?.address.addressName}{'\n'}
                {userInfo?.address.ward}, {userInfo?.address.district}, {userInfo?.address.city}
              </Text>)
              : guestInfo ?
                (<Text style={styles.deliveryAddressText}>
                  {guestInfo.address.userAddress}
                  {'\n'}
                  {guestInfo.address.ward}, {guestInfo.address.district}, {guestInfo.address.city}
                </Text>)
                : (<Text style={styles.deliveryAddressText}>Hiện tại chưa có thông tin của bạn{'\n'}
                  Vui lòng đăng nhập hoặc thêm thông tin của bạn</Text>)
            }


            <TouchableOpacity onPress={() => userInfo ? navigation.navigate('CreateAddressScreen') : navigation.navigate('InformationScreen', {guestInfo: guestInfo})}>
              <Icon name="edit" size={18} color="#3669C9" />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={{ marginHorizontal: 2 }}>
            {cartDataUser.length > 0 ? (
              cartDataUser.map((item, index) => {
                // Tìm số lượng kho của sản phẩm và kích thước
                const matchedProduct = productsState.find(
                  (product) => product.productId === item.productId
                );
                const matchedSize = matchedProduct?.productSizes.find(
                  (size) => size.productSizeId === item.productSizeId
                );
                const productSizeQuantity = matchedSize?.productSizeQuantity?.productSizeQuantity || 0;

                return (
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
                    productSizeQuantity={productSizeQuantity} // Truyền số lượng kho
                    onDelete={(id, quantity, sizeId) => handleDeleteUser(id, quantity, sizeId)}
                    onQuantityChange={handleQuantityChangeUser}
                    onInput={handleInputQuantityChangeUser}
                    setAlertType={setAlertType}
                    setAlertVisible={setAlertVisible}
                    setTitleAlert={setTitleAlert}
                  />
                );
              })
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
            <Image source={selectedPaymentIcon} style={{ width: 24, height: 24, marginRight: 10, }} />
            <Text style={styles.selectedPaymentText}>{selectedPaymentName}</Text>
            <Icon name="angle-down" size={22} color="#000" />
          </TouchableOpacity>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: '#3669C9', fontSize: 16, fontWeight: 'bold' }}>{finalTotal.toLocaleString() + " ₫"}</Text>
          </View>
        </View>

        <View>
          {userInfo ? (<TouchableOpacity
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
          </TouchableOpacity>)
            : guestInfo ?
              (<TouchableOpacity
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
                onPress={handlePlaceOrder}
              >
                <Text
                  style={{ textAlign: 'center', fontWeight: '600', color: '#fff' }}
                >
                  Thanh toán
                </Text>
              </TouchableOpacity>)
              : (<TouchableOpacity
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
                onPress={() => navigation.navigate('InformationScreen')}
              >
                <Text
                  style={{ textAlign: 'center', fontWeight: '600', color: '#fff' }}
                >
                  Thêm Thông Tin Của Bạn
                </Text>
              </TouchableOpacity>)}



          {/* Modal chọn phương thức thanh toán */}
          <Modal visible={isModalVisible} animationType="slide" transparent>
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
                {paymentOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.option}
                    onPress={() => handleSelectPayment(option.label, option.icon, option.use, option.value)}
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
      <AlertComponent
        title={alertTypeN === 'success' ? "Success" : "Error"}
        description={
          alertTypeN === 'success'
            ? titleAlert
            : titleAlert
        }
        alertType={alertTypeN}
        visible={alertVisibleN}
        onClose={() => setAlertVisible(false)}
      />
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
    fontSize: 16,
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
