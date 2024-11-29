import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  useAnimatedValue,
  Alert,
  Animated,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './api/config';
import AlertComponent from '../components/AlertComponent';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

function AddedProductToWishlist({ route, navigation, onScroll }) {
  const scrollRef = React.useRef();
  const [loading, setLoading] = useState(true); // Track the loading state
  const [productRelate, setProductRelate] = useState([]); // Dữ liệu sản phẩm
  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [image, setImage] = useState(); // Dữ liệu sản phẩm
  const [selectedSize, setSelectedSize] = useState(); // Đặt size mặc định
  const [productPriceSale, setProductPriceSale] = useState(); // Đặt size mặc định
  const { id } = route.params;

  const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertVisibleLike, setAlertVisibleLike] = useState(false);
  const [alertTypeLike, setAlertTypeLike] = useState('success');
  const [titleAlert, setTitleAlert] = useState('');

  useEffect(() => {
    if (alertVisible) {
      // Tự động ẩn thông báo sau 2 giây
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alertVisible]);

  const scrollX = useAnimatedValue(0);

  const { width: windowWidth } = useWindowDimensions();

  // Hàm lấy dữ liệu sản phẩm
  const fetchProductData = async (id) => {
    const productsApiUrl = `${BASE_URL}product/${id}`; // API lấy thông tin sản phẩm theo ID
    try {
      const response = await axios.get(productsApiUrl, {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Bỏ qua cảnh báo của ngrok nếu có
        },
      });
      return response.data.data; // Trả về dữ liệu sản phẩm
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  };

  // Hàm lấy sản phẩm liên quan
  const fetchRelatedProducts = async (categoryId) => {
    // console.log("cấc", categoryId);

    const categoriesApiUrl = `${BASE_URL}products/relate/${categoryId}`; // API lấy sản phẩm liên quan theo categoryId
    try {
      const response = await axios.get(categoriesApiUrl, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.data.data; // Trả về dữ liệu sản phẩm liên quan
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm liên quan:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  };
  // Hàm chính để gọi đồng thời hết API
  const fetchData = async () => {
    try {
      const productsData = await fetchProductData(id);
      const categoryId = productsData?.categories?.[0]?.categoryId;
      const productPriceSale = productsData?.productPriceSale;
      const image = productsData.productImages[0].productImagePath;
      const productRelateData = await fetchRelatedProducts(categoryId);

      setProductsState(productsData);
      setProductRelate(productRelateData);
      setImage(image);
      setProductPriceSale(productPriceSale)
      setLoading(false);

    } catch (error) {
      console.log('Lỗi khi lấy dữ liệu:', error); // Log lỗi nếu có
    }
  };


  useEffect(() => {
    scrollRef.current.scrollTo({ y: 0, animated: true });
    fetchData(); // Lấy dữ liệu khi component lần đầu render
  }, [id]);


  const [isModalVisible, setModalVisible] = useState(false);
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isBuyNowModalVisible, setIsBuyNowModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);

  // Modal Img
  const openModal = (imagePath) => {
    setSelectedImage([{ url: imagePath }]);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  // Modal Add to cart
  const openModalBuy = () => {
    setIsBuyModalVisible(true);
  };
  const closeModalBuy = () => setIsBuyModalVisible(false);
  // Modal Buy Now
  const openModalBuyNow = () => {
    setIsBuyNowModalVisible(true);
  };
  const closeModalBuyNow = () => setIsBuyNowModalVisible(false);
  // Modal Login
  const openModalLogin = () => {
    setIsLoginModalVisible(true);
  };
  const closeModalLogin = () => setIsLoginModalVisible(false);


  const handleSelectSize = (sizeName) => {
    // Nếu kích thước đã được chọn, nhấn lần nữa sẽ hủy chọn
    if (selectedSize === sizeName) {
      setSelectedSize(null);
    } else {
      setSelectedSize(sizeName);
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
  // console.log(userInfo);



  //Cart
  const [cart, setCart] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [idCart, setIdCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [errorCheck, setErrorCheck] = useState(false);
  const [errorCheckQuantity, setErrorCheckQuantity] = useState(false);



  const fetchDataCart = async () => {
    if (userInfo?.userId != null) {
      const apiUrl = `${BASE_URL}carts/user/${userInfo.userId}`;
      try {
        const response = await axios.get(apiUrl);

        const idCart = response.data.data.cartId;
        setIdCart(idCart)

      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  }
  useEffect(() => {
    fetchDataCart();
  }, [userInfo?.userId]); // Chạy lại khi userInfo?.userId thay đổi


  useEffect(() => {
    if (selectedSize) {
      setErrorCheck(false)
    }
  }, [selectedSize]);


  const handleAddToCartUser = async () => {
    if (!selectedSize) {
      setError('Vui Lòng Chọn Màu Sản Phẩm');
      setErrorCheck(false);
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    if (quantity < 1) {
      setError('Vui Lòng Chọn Số Lượng Hợp Lệ');
      setErrorCheck(false);
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    const selectedProductSize = productsState.productSizes.find(
      (size) => size.productSizeName === selectedSize
    );

    if (!selectedProductSize) {
      setError('Kích thước sản phẩm không tồn tại');
      setErrorCheck(false);
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    if (quantity > 20) {
      setError(`Số lượng yêu cầu là 20 (sản phẩm)`);
      setAlertType('error');
      setAlertVisible(true);

      setErrorCheckQuantity(false);
      setTimeout(() => setErrorCheckQuantity(true), 5);
      return;
    }

    setError('');
    setErrorCheck(false);
    // Chuẩn bị dữ liệu để gửi đến API
    const cartItemData = {
      cartItem: {
        productQuantity: quantity,
        productId: id,
        sizeId: selectedProductSize.productSizeId
      }
    };
    try {
      const response = await axios.get(`${BASE_URL}order/cart/${userInfo.cartId}`);
      if (response.status === 200) {
        Alert.alert(
          'Xác nhận lại đơn hàng',
          'Vui lòng xác nhận trước khi thêm sản phẩm mới vào giỏ hàng',
          [
            {
              text: 'Xem Chi Tiết',
              onPress: async () => {
                navigation.navigate('OrderConfirmationScreen', { order: response.data.order });
              },
            },
          ],
          { cancelable: false }
        );
      } 
    } catch (error) {
      const response = await axios.put(`${BASE_URL}cart/${userInfo.cartId}`, cartItemData);
      // console.log(response);

      if (response.status === 200) {
        console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
        closeModalBuy();
        navigation.navigate('AddToCartScreen', {
          alertVisible: true,
          alertType: 'success',
        })
      } else {
        console.error("Không thể thêm sản phẩm vào giỏ hàng:", response.data.message);
      }
    }
    // try {
    //   // Gửi yêu cầu POST đến API để thêm sản phẩm vào giỏ hàng
    //   const response = await axios.put(`${BASE_URL}cart/${userInfo.cartId}`, cartItemData);
    //   // console.log(response);

    //   if (response.status === 200) {
    //     console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
    //     closeModalBuy();
    //     navigation.navigate('AddToCartScreen', {
    //       alertVisible: true,
    //       alertType: 'success',
    //     })
    //   } else {
    //     console.error("Không thể thêm sản phẩm vào giỏ hàng:", response.data.message);
    //   }
    // } catch (error) {
    //   console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    // }
  };

  const handleBuyNowUser = async () => {
    if (!selectedSize) {
      setError('Vui Lòng Chọn Màu Sản Phẩm');
      setErrorCheck(false);
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    if (quantity < 1) {
      setError('Vui Lòng Chọn Số Lượng Hợp Lệ');
      setErrorCheck(false);
      setAlertType('error');
      setAlertVisible(true);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }


    if (quantity > 20) {
      setError(`Số lượng yêu cầu là 20 (sản phẩm)`);
      setAlertType('error');
      setAlertVisible(true);

      setErrorCheckQuantity(false);
      setTimeout(() => setErrorCheckQuantity(true), 5);
      return;
    }

    setError('');
    setErrorCheck(false);
    // Chuẩn bị dữ liệu để gửi đến API
    navigation.navigate('BuyNow', {
      product: productsState, alertVisible: true, alertType: 'success',
      size: selectedSize,
      quantity: quantity,
      total: total,
    })


  };
  const handleQuantityChange = (amount) => {
    setQuantity(Math.max(1, quantity + amount));
    setErrorCheckQuantity(false);
  };
  // Hàm xử lý khi có thay đổi trong ô input
  const handleInputChange = (text) => {
    const value = parseInt(text, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
      setErrorCheckQuantity(false); // Reset error if the input is valid
    } else {
      setQuantity(0); // Set to 1 if input is invalid
      setErrorCheckQuantity(true); // Set error state if input is invalid
    }
  };
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Kiểm tra xem productPriceSale có tồn tại không
    if (productPriceSale) {
      // Loại bỏ ký tự không phải số (như ₫) và chuyển đổi thành số
      const saleProNumber = parseInt(productPriceSale.replace(/[^\d]/g, ''), 10);  // Sử dụng replace trước khi parseInt

      // Kiểm tra nếu giá trị là hợp lệ
      if (!isNaN(saleProNumber)) {
        setTotal(quantity * saleProNumber); // Tính tổng
      } else {
        setTotal(0); // Nếu giá trị không hợp lệ, gán tổng là 0
      }
    } else {
      // Nếu productPriceSale không có giá trị, đặt total là 0
      setTotal(0);
    }

  }, [quantity, productPriceSale]);


  const [liked, setLiked] = useState();
  const [cartDataUser, setCartDataUser] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]); // Lưu danh sách các size đã chọn

  const [isUnLikeModalVisible, setIsUnLikeModalVisible] = useState(false);
  const [isLikeModalVisible, setIsLikeModalVisible] = useState(false);

  // WishList
  const fetchWishList = async () => {
    // Lấy dữ liệu giỏ hàng từ API nếu userId tồn tại
    const apiUrl = `${BASE_URL}carts/wishlist/user/${userInfo?.userId}`;
    try {
      const response = await axios.get(apiUrl);
      const userData = response.data.data.cartItem;

      setCartDataUser(userData);
      const isLiked = userData.some((item) => item.productId === id);
      setLiked(isLiked); // Cập nhật trạng thái liked
      const matchingSizes = userData
        .filter((item) => item.productId === id) // Chỉ giữ lại sản phẩm có id khớp
        .map((item) => item.productSize); // Lấy tên size

      setSelectedSizes(matchingSizes); // Cập nhật trạng thái các size được chọn
    } catch (error) {
      // console.log('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchWishList();
  }, [userInfo?.userId]);

  const handleSelectSizes = (sizeName) => {
    setSelectedSizes((prevSelectedSizes) => {
      if (prevSelectedSizes.includes(sizeName)) {
        // Bỏ kích thước nếu đã chọn
        return prevSelectedSizes.filter((size) => size !== sizeName);
      } else {
        // Thêm kích thước vào danh sách
        return [...prevSelectedSizes, sizeName];
      }
    });
  };

  const openModalLike = () => {
    setIsLikeModalVisible(true);
  };
  const closeModalLike = () => setIsLikeModalVisible(false);
  const openModalUnLike = () => {
    setIsUnLikeModalVisible(true);
  };
  const closeModalUnLike = () => setIsUnLikeModalVisible(false);

  const handleWishListUser = async () => {
    const selectedProductSizes = size.filter((size) =>
      selectedSizes.includes(size.productSizeName)
    );

    // Kiểm tra nếu không có kích thước được chọn
    if (selectedProductSizes.length === 0) {
      setAlertTypeLike('error')
      setAlertVisibleLike(true)
      setTitleAlert('Vui lòng chọn ít nhất một kích thước.')
      return;
    }

    // Lặp qua từng kích thước để gọi API
    for (const selectedProductSize of selectedProductSizes) {
      const cartItemData = {
        cartItem: {
          productQuantity: 1,
          productId: id,
          sizeId: selectedProductSize.productSizeId,
        },
      };
      console.log(cartItemData);

      try {
        const response = await axios.put(
          `${BASE_URL}cart/${userInfo.wishListId}`,
          cartItemData
        );

        if (response.status === 200) {
          console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
          setAlertTypeLike('success')
          setAlertVisibleLike(true)
          setTitleAlert('Sản phẩm đã được thêm vào danh sách yêu thích')
        } else {
          setAlertTypeLike('error')
          setAlertVisibleLike(true)
          setTitleAlert('Không thể thêm sản phẩm vào giỏ hàng')
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "Không thể thêm sản phẩm vào giỏ hàng:",
            error.response.data.message || "Lỗi không xác định"
          );
        } else {
          console.error("Lỗi mạng hoặc lỗi không xác định:", error.message);
        }
      }
    }

    // Sau khi thêm tất cả, tải lại dữ liệu và đóng modal
    fetchData();
    closeModalBuy();
  };

  const DeleteWishListUser = async () => {
    setErrorCheck(false);

    // Tạo danh sách các yêu cầu xóa theo size đã chọn
    const deleteRequests = selectedSizes.map(async (sizeName) => {
      const selectedProductSize = size.find(
        (size) => size.productSizeName === sizeName
      );
      const cartItemData = {
        cartItem: {
          productId: id,
          sizeId: selectedProductSize.productSizeId,
        }
      };

      try {
        const response = await axios.delete(
          `${BASE_URL}cart/${userInfo.wishListId}`,
          { data: cartItemData }
        );

        if (response.status === 200) {
          console.log("Xoá Yêu Thích Thành Công", response.data.message);

          closeModalUnLike();
          fetchData();
        } else {
          // console.error("Không thể xoá:", response.data.message || "Lỗi không xác định");
          setAlertTypeLike('error')
          setAlertVisibleLike(true)
          setTitleAlert('Không thể thêm sản phẩm vào giỏ hàng')
        }
      } catch (error) {
        // console.error("Lỗi mạng hoặc lỗi không xác định:", error.message);
        setAlertTypeLike('error')
        setAlertVisibleLike(true)
        setTitleAlert('Không thể thêm sản phẩm vào giỏ hàng')
      }
    });

    // Đợi tất cả yêu cầu xóa hoàn tất
    await Promise.all(deleteRequests);

    // Xóa các size đã chọn khỏi trạng thái
    setSelectedSizes([]);
    setAlertTypeLike('success');
    setAlertVisibleLike(true);
    setTitleAlert('Tất cả các màu đã chọn đã được xoá khỏi yêu thích.');
  };

// Kết Thúc WishList

// console.log(userInfo);
  //Kết thúc
  return (
    <View>
      <ScrollView ref={scrollRef}>
        <View style={styles.productDetailContainer}>
          <View style={styles.iconHeader}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="angle-left" size={35} color="#000" />
            </Pressable>
            <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
            {/* <Pressable style={styles.shareButton} onPress={() => navigation.goBack()}>
              <Icon name="share" size={25} color="#000" />
            </Pressable> */}
          </View>

          <View>
            <FlatList
              data={productsState.productImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.productImageIndex}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openModal(item.productImagePath)}>
                  <View style={{
                    marginHorizontal: 5,
                    justifyContent: 'center',
                    alignItems: 'center', // Đảm bảo hình ảnh luôn căn giữa
                    flex: 1
                  }}>
                    <Image
                      source={{ uri: item.productImagePath }}
                      style={{
                        width: windowWidth - 50, // Chiều rộng hình ảnh là 90% chiều rộng màn hình
                        height: 350, // Chiều cao cố định
                        resizeMode: 'contain', // Đảm bảo hình ảnh không bị kéo dãn, giữ tỷ lệ gốc
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />

            <Modal visible={isModalVisible} transparent={true} onRequestClose={closeModal}>
              <View style={styles.modalBackground}>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>
                {selectedImage && (
                  <ImageViewer
                    imageUrls={selectedImage} // Thư viện yêu cầu array của các object với key `url`
                    enableSwipeDown
                    onSwipeDown={closeModal}
                    renderIndicator={() => null}
                    style={styles.fullScreenImage} // Ẩn số chỉ mục ảnh
                  />
                )}
              </View>
            </Modal>
          </View>




          {/* Product info */}
          <View style={styles.productInfo}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.productName}>{productsState.productName}</Text>
              {liked ? ( <TouchableOpacity
                style={{
                  borderColor: '#ccc',
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: '#FE3A30',
                }}
                onPress={openModalUnLike}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#FFF',
                    }}
                  >

                  </Text>
                  <Image
                    style={{ width: 20, height: 20, tintColor: '#fff' }}
                    source={require('../assets/heart.png')}
                  />
                </View>
              </TouchableOpacity>) : 
              ( <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={openModalLike}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#FFF',
                    }}
                  >

                  </Text>
                  <Image
                    style={{ width: 20, height: 20, tintColor: '#3669c9' }}
                    source={require('../assets/heart.png')}
                  />
                </View>
              </TouchableOpacity>)}
             
            </View>

            <View>
              {productsState.productSale == 0 ? (
                <Text style={styles.productPrice}>
                  {productsState.productPrice}
                </Text>
              ) : (
                <View>
                  <Text style={styles.productPrice}>
                    {productsState.productPriceSale}
                  </Text>
                  <Text style={styles.originalPrice}>
                    {productsState.productPrice}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.SoldProductInfo}>
              <View style={styles.productStar}>
                <Image source={require('../assets/star.png')} />
                <Text> {productsState.productRating}</Text>
                {/* <Text>{review} reviewes</Text> */}
              </View>
              <View>
                {/* <Text style={styles.totalSellProduct}>Sole : 250</Text> */}
              </View>
            </View>


          </View>

          {/* Description Product */}
          <View>
            <Text style={styles.descriptionProductTitle}>
              {productsState.post?.postName}
            </Text>
            <Text style={styles.descriptionProductText}>
              {productsState.post?.postContent}
            </Text>
          </View>

          {/* Review Product */}
          <View style={styles.reviewProductContainer}>
            <View style={styles.reviewProductHeader}>
              <View>
                <Text style={styles.reviewProductTitle}>Review</Text>
                {/* <Text style={styles.reviewProductTitle}>({review})</Text> */}
              </View>
              <View style={styles.productStar}>
                <Image source={require('../assets/star.png')} />
                <Text>{productsState.productRating}</Text>
              </View>
            </View>

            <View style={{}}>
              <View style={styles.sectionReviewerContainer}>
                <View style={{ flex: 1 }}>
                  <Image
                    style={styles.reviewerImage}
                    source={require('../assets/new3.png')}
                  />
                </View>
                <View style={{ flex: 6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text>Yelena Belova</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                      </View>
                    </View>
                    <View>
                      <Text>2 Minggu yang lalu</Text>
                    </View>
                  </View>
                  <View style={{ paddingTop: 10 }}>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionReviewerContainer}>
                <View style={{ flex: 1 }}>
                  <Image
                    style={styles.reviewerImage}
                    source={require('../assets/new3.png')}
                  />
                </View>
                <View style={{ flex: 6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text>Yelena Belova</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                      </View>
                    </View>
                    <View>
                      <Text>2 Minggu yang lalu</Text>
                    </View>
                  </View>
                  <View style={{ paddingTop: 10 }}>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionReviewerContainer}>
                <View style={{ flex: 1 }}>
                  <Image
                    style={styles.reviewerImage}
                    source={require('../assets/new3.png')}
                  />
                </View>
                <View style={{ flex: 6 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text>Yelena Belova</Text>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                        <Image source={require('../assets/star.png')} />
                      </View>
                    </View>
                    <View>
                      <Text>2 Minggu yang lalu</Text>
                    </View>
                  </View>
                  <View style={{ paddingTop: 10 }}>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ margin: 10 }}>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 15,
                marginVertical: 20,
                borderRadius: 10,
              }} onPress={() => navigation.navigate('ReviewProductScreen')}
            >
              <Text style={{ textAlign: 'center', fontWeight: '600' }}>
                See All Review
              </Text>
            </TouchableOpacity>
          </View>


        </View>
        <View style={styles.greySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Sản Phẩm Đề Xuất</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          <FlatList
            horizontal
            data={productRelate}
            renderItem={({ item }) => {
              // Kiểm tra xem mảng productImages có tồn tại và có ít nhất 1 phần tử

              const imageUrl = Array.isArray(item.productImages) && item.productImages.length > 0
                ? (item.productImages.find(img => img.productImageIndex === 1)?.productImagePath || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png')
                : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png';
              return (
                <ProductItem
                  id={item['productId']}
                  name={item['productName']}
                  price={item['productPriceSale']}
                  oldPrice={item['productPrice']}
                  image={item.productImages?.[0]?.productImagePath}  // Truyền URL của ảnh đầu tiên vào prop images
                  rating={item['productRating']}
                  sale={item['productSale']}
                  isLoading={false}  // Set isLoading to false when not loading

                />
              );
            }}
            keyExtractor={(item) => item['productId'].toString()}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />

        </View>
      </ScrollView>
      <View style={{
        flexDirection: 'row', height: '35%', paddingHorizontal: 20, gap: 10, justifyContent: 'center', backgroundColor: '#fff', paddingTop: 8, textAlign: 'center',
        borderTopWidth: 1, borderColor: '#DDD'
      }}>
        {!userInfo?.userId ?
          (<>

            <View style={{ flex: 1, position: 'relative', }}>
              {/* Số lượng */}
              <TouchableOpacity
                style={{
                  borderColor: '#3669C9',
                  borderWidth: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  borderRadius: 10,
                }}
                onPress={openModalLogin}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#3669C9',
                  }}
                >
                  Thêm vào giỏ hàng
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, position: 'relative', }}>
              {/* Số lượng */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#3669C9',
                  borderColor: '#ccc',
                  borderWidth: 1,
                  padding: 20,
                  borderRadius: 10,
                }}
                onPress={openModalLogin}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  Mua Ngay
                </Text>
              </TouchableOpacity>
            </View>
          </>) :
          (<>
            <View style={{ position: 'relative', }}>
              {/* Số lượng */}
              <TouchableOpacity
                style={{
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => navigation.navigate('ChatScreen')}
              >
                <Ionicons name="chatbox-ellipses-outline" size={30} color="#3669C9" />
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#3669C9',
                    marginTop: 3,
                  }}
                >
                  Chat
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, position: 'relative', }}>
              {/* Số lượng */}
              <TouchableOpacity
                style={{
                  borderColor: '#3669C9',
                  borderWidth: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 11,
                  borderRadius: 10,
                }}
                onPress={openModalBuy}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#3669C9',
                  }}
                >
                  Thêm vào giỏ hàng
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, position: 'relative', }}>
              {/* Số lượng */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#3669C9',
                  borderColor: '#ccc',
                  borderWidth: 1,
                  padding: 20,
                  borderRadius: 10,
                }}
                onPress={openModalBuyNow}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  Mua Ngay
                </Text>
              </TouchableOpacity>
            </View>
          </>)}
      </View>

      {/* Add To Cart */}
      <Modal
        visible={isBuyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModalBuy}
      >
        <TouchableWithoutFeedback onPress={closeModalBuy}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <ScrollView>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm giỏ hàng</Text>
            </View>
            <View style={styles.line}></View>
            {/* Product Info */}
            <View style={{ flexDirection: 'row', }}>
              <View style={styles.productInfo}>
                <Image
                  source={{ uri: image }}
                  style={styles.productImage}
                />

              </View>
              <View>
                <View style={styles.productDetails}>
                  <Text style={{ fontSize: 20, fontWeight: '500', }}>{productsState.productName}</Text>
                  {productsState.productSale == 0 ? (
                    <Text style={{ color: '#3669c9', fontWeight: '500', fontSize: 18, marginBottom: 10 }}>{productsState.productPrice}</Text>
                  ) : (
                    <View>
                      <Text style={{ color: '#FE3A30', fontWeight: '500', fontSize: 18, marginTop: 10 }}>{productsState.productPriceSale}</Text>
                      <Text style={{ color: '#ccc', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 10 }}>{productsState.productPrice}</Text>
                    </View>
                  )}
                </View>
                {/* Quantity Selector */}
                <View style={styles.quantitySelector}>
                  {/* Decrease Button */}

                  <TouchableOpacity
                    onPress={() => handleQuantityChange(-1)}
                    style={styles.quantityButtonLeft}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  {/* Quantity Input */}
                  <TextInput
                    style={{
                      width: 50,
                      height: 30,
                      borderColor: errorCheckQuantity ? 'red' : '#ccc',
                      borderWidth: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#3669c9',
                      backgroundColor: '#fff',
                    }}
                    value={String(quantity)}
                    onChangeText={(text) => {
                      const validText = text.replace(/[^0-9]/g, '').slice(0, 3);
                      handleInputChange(validText);
                    }}
                    keyboardType="numeric"
                  />

                  {/* Increase Button */}
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(1)}
                    style={styles.quantityButtonRight}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
            <View style={styles.line}></View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Màu: </Text>
            </View>
            <View style={styles.productOptions}>
              {loading ? (
                <Text>Loading...</Text> // Nếu không có thư viện, hãy thử thay bằng <Text>Loading...</Text>
              ) : (
                <View style={styles.sizesContainer}>
                  {productsState.productSizes.map((size) => (
                    <TouchableOpacity
                      key={size.productSizeId}
                      style={[
                        styles.sizeOption,
                        selectedSize === size.productSizeName && styles.selected,
                        size.productSizeQuantity.productSizeQuantity === 0 && styles.disabled,
                        errorCheck && size.productSizeQuantity.productSizeQuantity > 0 && styles.flashBorder
                      ]}
                      onPress={() => handleSelectSize(size.productSizeName)}
                      disabled={size.productSizeQuantity.productSizeQuantity === 0} // Disable if quantity is 0
                    >
                      <Text
                        style={
                          selectedSize === size.productSizeName
                            ? { color: '#fff' } // Màu trắng khi được chọn
                            : { color: '#000' } // Màu đen khi không được chọn
                        }
                      >
                        {size.productSizeName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 50, marginTop: 5 }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#000', fontSize: 18, }}>Tổng: </Text>
              <Text style={{ fontSize: 20, color: '#3669c9', fontWeight: 'bold' }}>{total.toLocaleString() + " ₫"}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleAddToCartUser}>
              <Text style={styles.confirmButtonText}>Thêm giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AlertComponent
          title={alertType === 'success' ? "Success" : "Error"}
          description={
            alertType === 'success'
              ? "Thêm Sản Phẩm Thành Công"
              : error
          }
          alertType={alertType}
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </Modal>

      {/* Mua Ngay */}
      <Modal
        visible={isBuyNowModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModalBuyNow}
      >
        <TouchableWithoutFeedback onPress={closeModalBuyNow}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <ScrollView>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mua Ngay</Text>
            </View>
            <View style={styles.line}></View>
            {/* Product Info */}
            <View style={{ flexDirection: 'row', }}>
              <View style={styles.productInfo}>
                <Image
                  source={{ uri: image }}
                  style={styles.productImage}
                />

              </View>
              <View>
                <View style={styles.productDetails}>
                  <Text style={{ flex: 1, fontSize: 19, fontWeight: '500' }}>{productsState.productName}</Text>
                  {productsState.productSale == 0 ? (
                    <Text style={{ color: '#3669c9', fontWeight: '500', fontSize: 18, marginBottom: 10 }}>{productsState.productPrice}</Text>
                  ) : (
                    <View>
                      <Text style={{ color: '#FE3A30', fontWeight: '500', fontSize: 18, marginTop: 10 }}>{productsState.productPriceSale}</Text>
                      <Text style={{ color: '#ccc', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 10 }}>{productsState.productPrice}</Text>
                    </View>
                  )}

                </View>
                {/* Quantity Selector */}
                <View style={styles.quantitySelector}>
                  {/* Decrease Button */}

                  <TouchableOpacity
                    onPress={() => handleQuantityChange(-1)}
                    style={styles.quantityButtonLeft}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>

                  {/* Quantity Input */}
                  <TextInput
                    style={{
                      width: 50,
                      height: 30,
                      borderColor: errorCheckQuantity ? 'red' : '#ccc',
                      borderWidth: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#3669c9',
                      backgroundColor: '#fff',
                    }}
                    value={String(quantity)}
                    onChangeText={(text) => {
                      const validText = text.replace(/[^0-9]/g, ''); // Lọc số
                      const newQuantity = validText ? parseInt(validText, 10) : 0; // Nếu không có số, đặt thành 1
                      handleInputChange(newQuantity);
                    }}
                    keyboardType="numeric"
                  />

                  {/* Increase Button */}
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(1)}
                    style={styles.quantityButtonRight}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
            <View style={styles.line}></View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Màu: </Text>
            </View>
            <View style={styles.productOptions}>
              {loading ? (
                <Text>Loading...</Text> // Nếu không có thư viện, hãy thử thay bằng <Text>Loading...</Text>
              ) : (
                <View style={styles.sizesContainer}>
                  {productsState.productSizes.map((size) => (
                    <TouchableOpacity
                      key={size.productSizeId}
                      style={[
                        styles.sizeOption,
                        selectedSize === size.productSizeName && styles.selected,
                        size.productSizeQuantity.productSizeQuantity === 0 && styles.disabled,
                        errorCheck && size.productSizeQuantity.productSizeQuantity > 0 && styles.flashBorder
                      ]}
                      onPress={() => handleSelectSize(size.productSizeName)}
                      disabled={size.productSizeQuantity.productSizeQuantity === 0} // Disable if quantity is 0
                    >
                      <Text
                        style={
                          selectedSize === size.productSizeName
                            ? { color: '#fff' } // Màu trắng khi được chọn
                            : { color: '#000' } // Màu đen khi không được chọn
                        }
                      >
                        {size.productSizeName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Confirm Button */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 50, marginTop: 5 }}>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#000', fontSize: 18, }}>Tổng: </Text>
              <Text style={{ fontSize: 20, color: '#3669c9', fontWeight: 'bold' }}>{total.toLocaleString() + " ₫"}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleBuyNowUser}>
              <Text style={styles.confirmButtonText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
        <AlertComponent
          title={alertType === 'success' ? "Success" : "Error"}
          description={
            alertType === 'success'
              ? "Thêm Sản Phẩm Thành Công"
              : error
          }
          alertType={alertType}
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </Modal>
      {/* No Login */}
      <Modal visible={isLoginModalVisible} animationType="slide"
        transparent={true}
        onRequestClose={closeModalLogin}>
        <TouchableWithoutFeedback onPress={closeModalLogin}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainerLogin}>
          {/* Close Button */}

          {/* Modal Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Đăng Nhập tài Khoản</Text>
            <View style={styles.line}></View>

            <Image source={require("../assets/hello.png")} style={{ width: 50, height: 50, marginVertical: 5 }} />
            <Text style={styles.message}>
              Chào Mừng Bạn Mới
            </Text>
            <Text style={styles.subMessage}>
              Có vẻ nhưng bạn chưa đăng nhập? Hãy đăng nhập hoặc đăng ký để có thể nhận thông báo về cái ưa đãi khủng
            </Text>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={closeModalLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Add WishList */}
      <Modal
        visible={isLikeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModalLike}
      >
        <TouchableWithoutFeedback onPress={closeModalLike}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Vào Danh Sách Yêu Thích:</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
              <View style={styles.productInfo}>
                <Image
                  source={{ uri: image }}
                  style={styles.productImage}
                />

              </View>
              <View>
                <View style={styles.productDetails}>
                  <Text style={{ fontSize: 20, fontWeight: '500', }}>{productsState.productName}</Text>
                  {productsState.productSale == 0 ? (
                    <Text style={{ color: '#3669c9', fontWeight: '500', fontSize: 18, marginBottom: 10 }}>{productsState.productPrice}</Text>
                  ) : (
                    <View>
                      <Text style={{ color: '#FE3A30', fontWeight: '500', fontSize: 18, marginTop: 10 }}>{productsState.productPriceSale}</Text>
                      <Text style={{ color: '#ccc', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 10 }}>{productsState.productPrice}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.line}></View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Màu: </Text>
            </View>
            <View style={styles.productOptions}>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <View style={styles.sizesContainer}>
                  {Array.isArray(productsState.productSizes) ? (
                    productsState.productSizes.map((size) => (
                      <TouchableOpacity
                        key={size.productSizeId}
                        style={[
                          styles.sizeOption,
                          selectedSizes.includes(size.productSizeName) && styles.selected,
                          size.productSizeQuantity.productSizeQuantity === 0 && styles.disabled,
                        ]}
                        onPress={() => handleSelectSizes(size.productSizeName)}
                        disabled={size.productSizeQuantity.productSizeQuantity === 0}
                      >
                        <Text
                          style={
                            selectedSizes.includes(size.productSizeName)
                              ? { color: "#fff" }
                              : { color: "#000" }
                          }
                        >
                          {size.productSizeName}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : null}
                </View>
              )}
            </View>

          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 50, marginTop: 5 }}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleWishListUser}>
              <Text style={styles.confirmButtonText}>Thêm Yêu Thích</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Un WishList */}
      <Modal
        visible={isUnLikeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModalUnLike}
      >
        <TouchableWithoutFeedback onPress={closeModalUnLike}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Màu Trong Danh Sách Yêu Thích:</Text>
            </View>
            <View style={styles.line}></View>
            <View style={{ flexDirection: 'row', marginVertical: 20 }}>
              <View style={styles.productInfo}>
                <Image
                  source={{ uri: image }}
                  style={styles.productImage}
                />
              </View>
              <View>
                <View style={styles.productDetails}>
                  <Text style={{ fontSize: 20, fontWeight: '500', }}>{productsState.productName}</Text>
                  {productsState.productSale == 0 ? (
                    <Text style={{ color: '#3669c9', fontWeight: '500', fontSize: 18, marginBottom: 10 }}>{productsState.productPrice}</Text>
                  ) : (
                    <View>
                      <Text style={{ color: '#FE3A30', fontWeight: '500', fontSize: 18, marginTop: 10 }}>{productsState.productPriceSale}</Text>
                      <Text style={{ color: '#ccc', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 10 }}>{productsState.productPrice}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.line}></View>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Màu: </Text>
            </View>
            <View style={styles.productOptions}>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <View style={styles.sizesContainer}>
                  {/* Lọc và hiển thị chỉ các size đã được chọn */}
                  {Array.isArray(productsState.productSizes) ? productsState.productSizes
                    .filter((s) => selectedSizes.includes(s.productSizeName)) // Lọc các size được chọn
                    .map((filteredSize) => (
                      <TouchableOpacity
                        key={filteredSize.productSizeId}
                        style={[
                          styles.sizeOption,
                          selectedSizes.includes(filteredSize.productSizeName) && styles.selected,
                        ]}
                        disabled={true} // Không cho phép thay đổi
                      >
                        <Text style={{ color: '#fff' }}>{filteredSize.productSizeName}</Text>
                      </TouchableOpacity>
                    )) : null}
                </View>
              )}
            </View>
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 50, marginTop: 5 }}>
            <TouchableOpacity style={styles.confirmButton} onPress={DeleteWishListUser}>
              <Text style={styles.confirmButtonText}>Xoá Yêu Thích</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <AlertComponent
        title={alertTypeLike === 'success' ? "Success" : "Error"}
        description={
          alertTypeLike === 'success'
            ? titleAlert
            : titleAlert
        }
        alertType={alertTypeLike}
        visible={alertVisibleLike}
        onClose={() => setAlertVisibleLike(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 5,
  },
  subMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#3669C9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
  },
  modalContainerLogin: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    height: '45%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  productImage: { width: 120, height: 120, resizeMode: 'contain', borderWidth: 1, borderColor: '#CCC', borderRadius: 15, marginRight: 20, },

  quantitySelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  quantityButtonLeft: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  quantityButtonRight: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  quantityText: { fontSize: 20, textAlign: 'center', marginBottom: 5 },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    borderRadius: 5,
  },
  confirmButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },

  productDetailContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  greySection: {
    flex: 1,
    padding: 20,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  shareButton: {
    marginLeft: 10,
  },

  productImgContainer: {
    position: 'relative',
    alignContent: 'center',
    justifyContent: 'center',
    height: 350,
  },
  scrollContainer: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 16,
  },

  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },


  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },

  productName: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '700',
  },

  productPrice: {
    color: '#FE3A30',
    fontWeight: '500',
    fontSize: 20,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 10,
  },


  SoldProductInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  productStar: {
    flexDirection: 'row',
    gap: 5,
  },

  totalSellProduct: {
    color: '#3A9B7A',
  },

  descriptionProductTitle: {
    fontWeight: '800',
    fontSize: 16,
    paddingTop: 10,
  },
  descriptionProductText: {
    lineHeight: 24,
    paddingBottom: 10,
    paddingBottom: 10,
  },

  reviewProductContainer: {
    flexDirection: 'column',
  },

  reviewProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewProductTitle: {
    fontWeight: '800',
    fontSize: 16,
  },

  sectionReviewerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  seeAll: {
    color: '#3669c9',
    marginBottom: 10,
    fontSize: 17,
  },
  productList: {
    marginBottom: 20,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
  },
  fullScreenImage: {
    width: '100%',
    height: '90%',
  },

  productOptions: {
    marginVertical: 10,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeLabel: {
    fontWeight: 'bold',
    fontSize: 18, // Tăng kích thước chữ
    marginBottom: 10,
    color: '#333', // Màu chữ tối hơn
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Cho phép các nút xuống dòng
  },
  sizeOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5, // Bo tròn các góc
    width: '30%', // Đặt kích thước động để 4 nút vừa 1 hàng, nút thứ 5 sẽ xuống dòng
    margin: 5, // Khoảng cách giữa các nút
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5, // Đổ bóng nhẹ
  },
  selected: {
    backgroundColor: '#3669c9', // Màu nền khi chọn
    color: '#fff', // Màu chữ khi chọn
    transform: [{ scale: 1.05 }], // Phóng to nhẹ
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8, // Đổ bóng đậm hơn
  },
  disabled: {
    backgroundColor: '#e0e0e0',
    color: '#aaa',
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  flashBorder: {
    borderColor: 'red',
    borderWidth: 2,
  },
});
export default AddedProductToWishlist;
