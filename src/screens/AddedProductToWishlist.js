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
  Button,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './api/config';

function AddedProductToWishlist({ route, navigation, onScroll }) {
  const scrollRef = React.useRef();
  const [loading, setLoading] = useState(true); // Track the loading state
  const [productRelate, setProductRelate] = useState([]); // Dữ liệu sản phẩm
  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [image, setImage] = useState(); // Dữ liệu sản phẩm
  const [selectedSize, setSelectedSize] = useState(); // Đặt size mặc định
  const { id } = route.params;

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
    const categoriesApiUrl = `${BASE_URL}products/relate/${categoryId}`; // API lấy sản phẩm liên quan theo categoryId
    try {
      const response = await axios.get(categoriesApiUrl, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      return response.data.data.content; // Trả về dữ liệu sản phẩm liên quan
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm liên quan:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  };
  // Hàm chính để gọi đồng thời hết API
  const fetchData = async () => {
    try {
      const productsData = await fetchProductData(id);
      const categoryId = productsData.categories[0].categoryId;
      const image = productsData.productImages[0].productImagePath;
      const productRelateData = await fetchRelatedProducts(categoryId);

      setProductsState(productsData);
      setProductRelate(productRelateData);
      setImage(image);
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
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (imagePath) => {
    setSelectedImage([{ url: imagePath }]);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };


  const handleSelectSize = (sizeName) => {
    // Nếu kích thước đã được chọn, nhấn lần nữa sẽ hủy chọn
    if (selectedSize === sizeName) {
      setSelectedSize(null);
    } else {
      setSelectedSize(sizeName);
    }
  };
  //Cart
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [errorCheck, setErrorCheck] = useState(false);
  const [errorCheckQuantity, setErrorCheckQuantity] = useState(false);

  // Hàm để tính thời gian hết hạn của cart
  const getExpiryTime = () => Date.now() + 24 * 60 * 60 * 1000; // 24 giờ

  useEffect(() => {
    if (selectedSize && quantity >= 0) {
      setError('');
    }
  }, [selectedSize, quantity]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          const { items, expiry } = JSON.parse(savedCart);
          if (Date.now() > expiry) {
            await AsyncStorage.removeItem('cart');
          } else {
            setCart(items);
          }
        }
      } catch (error) {
        console.error("Error loading cart from AsyncStorage:", error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      if (cart.length > 0) {
        const cartData = {
          items: cart,
          expiry: getExpiryTime(),
        };
        try {
          await AsyncStorage.setItem('cart', JSON.stringify(cartData));
        } catch (error) {
          console.error("Error saving cart to AsyncStorage:", error);
        }
      }
    };

    saveCart();
  }, [cart]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError('Vui lòng chọn kích thước sản phẩm');
      setErrorCheck(false);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    if (quantity < 1) {
      setError('Vui lòng chọn số lượng hợp lệ');
      setErrorCheck(false);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    const selectedProductSize = productsState.productSizes.find(
      (size) => size.productSizeName === selectedSize
    );

    if (!selectedProductSize) {
      setError('Kích thước sản phẩm không tồn tại');
      setErrorCheck(false);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    const availableQuantity = selectedProductSize.productSizeQuantity.productSizeQuantity;
    if (quantity > availableQuantity) {
      setError(`Số lượng yêu cầu vượt quá số lượng tồn kho (${availableQuantity} sản phẩm)`);
      setErrorCheck(false);
      setErrorCheckQuantity(true);
      setTimeout(() => setErrorCheck(true), 0);
      return;
    }

    setError('');
    setErrorCheck(false);

    const basePrice = parseInt(productsState.productPriceSale.replace(/\D/g, ''), 10);

    const existingProductIndex = cart.findIndex(
      (item) => item.id === id && item.size === selectedSize
    );

    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? {
            ...item,
            quantity: item.quantity + quantity,
            total: (basePrice * (item.quantity + quantity)).toLocaleString() + " ₫",
          }
          : item
      );
      setCart(updatedCart);
    } else {
      const newProduct = {
        id,
        name: productsState.productName,
        size: selectedSize,
        quantity,
        price: productsState.productPriceSale,
        total: (basePrice * quantity).toLocaleString() + " ₫",
        image: image,
      };
      setCart([...cart, newProduct]);
    }
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
      setQuantity(1); // Set to 1 if input is invalid
      setErrorCheckQuantity(true); // Set error state if input is invalid
    }
  };
  //Kết thúc
  // useEffect(() => {
  //   console.log("Cart data:", cart);
  //   AsyncStorage.clear();
  // }, [cart]);



  return (
    <View>
      <ScrollView ref={scrollRef}>
        <View style={styles.productDetailContainer}>
          <View style={styles.iconHeader}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="angle-left" size={35} color="#000" />
            </Pressable>
            <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
            <Pressable style={styles.shareButton} onPress={() => navigation.goBack()}>
              <Icon name="share" size={25} color="#000" />
            </Pressable>
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
            <FlatList
              data={productsState.productImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `${item.productImageIndex}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openModal(item.productImagePath)}>
                  <View style={{ marginHorizontal: 5 }}>
                    <Image
                      source={{ uri: item.productImagePath }}
                      style={{ width: 345, height: 350, resizeMode: 'contain' }}
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
            <View>
              <Text style={styles.productName}>{productsState.productName}</Text>

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
                  image={imageUrl}  // Truyền URL của ảnh đầu tiên vào prop images
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
      <View style={{ flexDirection: 'row', height: '37%', paddingHorizontal: 20, gap: 10, justifyContent: 'center', backgroundColor: '#fff', paddingTop: 8, }}>
        <View>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 20,
              borderRadius: 10,
              backgroundColor: '#FE3A30',
            }}
          >
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
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, position: 'relative', }}>
          {/* Số lượng */}
          <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', zIndex: 9, right: 0, top: 5, }}>
            <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={{ padding: 10, }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', }}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={{
                width: 50,
                height: 40,
                borderColor: '#ccc',
                borderWidth: 2,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#3669c9',

                borderColor: errorCheckQuantity ? 'red' : '#ccc',
                backgroundColor: '#fff',
                borderRadius: 10,

              }}
              value={String(quantity)}
              onChangeText={handleInputChange}
              keyboardType="numeric"
            />

            <TouchableOpacity onPress={() => handleQuantityChange(1)} style={{ padding: 10, right: 2 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Thêm vào giỏ hàng */}
          <TouchableOpacity
            style={{

              backgroundColor: '#3669C9',
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 20,
              borderRadius: 10,

            }}
            onPress={handleAddToCart}
          >
            <Text
              style={{

                fontWeight: '600',
                color: '#fff',
              }}
            >
              Thêm vào giỏ hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>



  );
}

const styles = StyleSheet.create({
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

  numberOfImage: {
    position: 'absolute',
    left: '10%',
    bottom: '10%',

    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  productInfo: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
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
  currencyHighlight: {
    fontWeight: 'bold',
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
    marginVertical: 20,
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
    backgroundColor: '#e0e0e0', // Màu nền cho kích cỡ không khả dụng
    color: '#aaa', // Màu chữ cho kích cỡ không khả dụng
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  flashBorder: {
    borderColor: 'red', // Viền màu đỏ cho hiệu ứng chớp
    borderWidth: 2,
    // Để tạo hiệu ứng flash, bạn có thể sử dụng thư viện 'react-native-reanimated' hoặc 'react-native-animatable'
  },
});
export default AddedProductToWishlist;
