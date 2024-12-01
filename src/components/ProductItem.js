import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, Animated, Modal, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';
import AlertComponent from '../components/AlertComponent';
import { useFocusEffect } from '@react-navigation/native';

const ProductItem = ({ id, image, name, price, oldPrice, rating, review, sale, size, sizeName, isLoading, setAlertType, setAlertVisible, setTitleAlert, onActionComplete}) => {
  const [liked, setLiked] = useState();
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [isUnLikeModalVisible, setIsUnLikeModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(); // Đặt size mặc định
  const [selectedSizes, setSelectedSizes] = useState([]); // Lưu danh sách các size đã chọn
  const [errorCheck, setErrorCheck] = useState(false);
  const [cartDataUser, setCartDataUser] = useState([]);



  // const [localUri, setLocalUri] = useState(null);
  const shimmerAnim = useRef(new Animated.Value(0)).current; // Shimmer animation value

  const navigation = useNavigation();

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };
  // const toggleLike = () => {
  //   setLiked(!liked); // Chuyển đổi trạng thái like
  // };


  useEffect(() => {
    if (typeof image === 'string') {
      imageString(image);
    }
  }, [image]);

  const imageString = (image) => {
    return typeof image === 'string'
      ? { uri: image }
      : isLoading == true; // Default placeholder image
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

  const handleSelectSize = (sizeName) => {
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
  const openModalBuy = () => {
    setIsBuyModalVisible(true);
  };
  const closeModalBuy = () => setIsBuyModalVisible(false);
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
      setAlertType('error')
      setAlertVisible(true)
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
      // console.log(cartItemData);

      try {
        const response = await axios.put(
          `${BASE_URL}cart/${userInfo.wishListId}`,
          cartItemData
        );

        if (response.status === 200) {
          console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
          setAlertType('success')
          setAlertVisible(true)
          setTitleAlert('Sản phẩm đã được thêm vào danh sách yêu thích')
        } else {
          setAlertType('error')
          setAlertVisible(true)
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
        } else {
          // console.error("Không thể xoá:", response.data.message || "Lỗi không xác định");
          setAlertType('error')
          setAlertVisible(true)
          setTitleAlert('Không thể thêm sản phẩm vào giỏ hàng')
        }
      } catch (error) {
        // console.error("Lỗi mạng hoặc lỗi không xác định:", error.message);
        setAlertType('error')
        setAlertVisible(true)
        setTitleAlert('Không thể thêm sản phẩm vào giỏ hàng')
      }
    });

    // Đợi tất cả yêu cầu xóa hoàn tất
    await Promise.all(deleteRequests);

    // Xóa các size đã chọn khỏi trạng thái
    fetchData();
    setSelectedSizes([]);
    setAlertType('success');
    setAlertVisible(true);
    setTitleAlert('Xoá Yêu Thích Thành Công');
  };
  const DeleteOneWishListUser = async () => {
    const cartItemData = {
      cartItem: {
        productId: id,
        sizeId: size,
      }
    };
    try {
      const response = await axios.delete(`${BASE_URL}cart/${userInfo?.wishListId}`, { data: cartItemData });

      if (response.status === 200) {
        // console.log("Sản phẩm đã được thêm vào giỏ hàng:", response.data);
        setAlertType('success')
        setAlertVisible(true)
        setTitleAlert('Xoá Yêu Thích Thành Công')
      } else {
        // console.error("Không thể thêm sản phẩm vào giỏ hàng:", response.data.message || "Lỗi không xác định");
        setAlertType('error')
        setAlertVisible(true)
        setTitleAlert('Không thể thêm sản phẩm vào giỏ hàng')
      }

    } catch (error) {
      setAlertType('error')
      setAlertVisible(true)
      setTitleAlert('Lỗi mạng hoặc lỗi không xác định')
      // console.error("Lỗi mạng hoặc lỗi không xác định:", error.message);
    }
    onActionComplete?.();
    fetchData();
  };
  const fetchData = async () => {
    // Lấy dữ liệu giỏ hàng từ API nếu userId tồn tại
    const apiUrl = `${BASE_URL}carts/wishlist/user/${userInfo?.userId}`;
    try {
      const response = await axios.get(apiUrl);
      const userData = response.data.data.cartItem;

      setCartDataUser(userData);
      const isLiked = userData.some((item) => item.productId === id );
      console.log(isLiked);
      
      setLiked(isLiked); // Cập nhật trạng thái liked
      // Tìm các size đã chọn từ danh sách cartDataUser
      const matchingSizes = userData
        .filter((item) => item.productId === id) // Chỉ giữ lại sản phẩm có id khớp size
        .map((item) => item.productSize); // Lấy tên size

      setSelectedSizes(matchingSizes); // Cập nhật trạng thái các size được chọn
    } catch (error) {
      // console.log('Error fetching data:', error);
    }
  };
  // useEffect(() => {
  //   fetchData();
  // }, [userInfo?.userId]);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userInfo?.userId])
  );


  return (
    <View style={styles.container}>
      {isLoading ? (
        // Skeleton with shimmer effect while loading
        <View>
          <Animated.View style={[styles.skeletonImage, {
            backgroundColor: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
            })
          }]} />
          <Animated.View style={[styles.skeletonText, {
            backgroundColor: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e0e0e0', '#f0f0f0'],
            })
          }]} />
          <Animated.View style={[styles.skeletonTextSmall, {
            backgroundColor: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e0e0e0', '#f0f0f0'],
            })
          }]} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddedProductToWishlist', { id });
          }}
        >
          {sale == 0 ? (
            <View>
              <Image
                source={imageString(image)}
                style={styles.image}
              />
              <Text style={styles.name}>{truncateName(name)}</Text>
              {Array.isArray(size) ? null :
                (<Text>Màu: {sizeName}</Text>)}
              <Text style={styles.price}>{oldPrice}</Text>
              <Text style={styles.originalPrice}></Text>
              <View style={styles.rate}>
                <Text style={styles.rating}>
                  <Image source={require('../assets/star.png')} style={styles.icon} /> {rating}
                </Text>
                <Text style={styles.review}>{review} Review</Text>
                {liked ?
                  Array.isArray(size) ? (
                    (<TouchableOpacity onPress={openModalUnLike}>
                      <Text style={styles.heart}>
                        <Icon name="heart" size={18} color="#3669c9" />
                      </Text>
                    </TouchableOpacity>)
                  ) :
                    (<TouchableOpacity onPress={DeleteOneWishListUser}>
                      <Text style={styles.heart}>
                        <Icon name="heart" size={18} color="#3669c9" />
                      </Text>
                    </TouchableOpacity>)
                  : (<TouchableOpacity onPress={openModalBuy}>
                    <Text style={styles.heart}>
                      <Icon name="heart-outline" size={18} color="#3669c9" />
                    </Text>
                  </TouchableOpacity>)
                }
              </View>
            </View>


          ) : (
            <>
              {/* Nhãn SALE */}
              <View style={styles.saleLabel}>
                <Text style={styles.saleText}>-{sale}%</Text>
              </View>

              <Image
                source={imageString(image)}
                style={styles.image}
              />
              <Text style={styles.name}>{truncateName(name)}</Text>
              {Array.isArray(size) ? null :
                (<Text style={{ marginBottom: 10, fontWeight: '500' }}>Màu: {sizeName}</Text>)}
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.originalPrice}>{oldPrice}</Text>

              <View style={styles.rate}>
                <Text style={styles.rating}>
                  <Image source={require('../assets/star.png')} style={styles.icon} /> {rating}
                </Text>
                <Text style={styles.review}>{review} Review</Text>
                {liked ?
                  Array.isArray(size) ? (
                    (<TouchableOpacity onPress={openModalUnLike}>
                      <Text style={styles.heart}>
                        <Icon name="heart" size={18} color="#3669c9" />
                      </Text>
                    </TouchableOpacity>)
                  ) :
                    (<TouchableOpacity onPress={DeleteOneWishListUser}>
                      <Text style={styles.heart}>
                        <Icon name="heart" size={18} color="#3669c9" />
                      </Text>
                    </TouchableOpacity>)
                  : (<TouchableOpacity onPress={openModalBuy}>
                    <Text style={styles.heart}>
                      <Icon name="heart-outline" size={18} color="#3669c9" />
                    </Text>
                  </TouchableOpacity>)
                }
              </View>
            </>
          )}
        </TouchableOpacity>

      )}
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
                  <Text style={{ fontSize: 20, fontWeight: '500', }}>{name}</Text>
                  {sale == 0 ? (
                    <Text style={{ color: '#3669c9', fontWeight: '500', fontSize: 18, marginBottom: 10 }}>{oldPrice}</Text>
                  ) : (
                    <View>
                      <Text style={{ color: '#FE3A30', fontWeight: '500', fontSize: 18, marginTop: 10 }}>{price}</Text>
                      <Text style={{ color: '#ccc', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 10 }}>{oldPrice}</Text>
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
              {isLoading ? (
                <Text>Loading...</Text>
              ) : (
                <View style={styles.sizesContainer}>
                  {Array.isArray(size) ? (
                    size.map((size) => (
                      <TouchableOpacity
                        key={size.productSizeId}
                        style={[
                          styles.sizeOption,
                          selectedSizes.includes(size.productSizeName) && styles.selected,
                          size.productSizeQuantity.productSizeQuantity === 0 && styles.disabled,
                        ]}
                        onPress={() => handleSelectSize(size.productSizeName)}
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
                  <Text style={{ fontSize: 20, fontWeight: '500', }}>{name}</Text>
                  {sale === 0 ? (
                    <Text style={{ color: '#3669c9', fontWeight: '500', fontSize: 18, marginBottom: 10 }}>{oldPrice}</Text>
                  ) : (
                    <View>
                      <Text style={{ color: '#FE3A30', fontWeight: '500', fontSize: 18, marginTop: 10 }}>{price}</Text>
                      <Text style={{ color: '#ccc', textDecorationLine: 'line-through', fontSize: 14, marginBottom: 10 }}>{oldPrice}</Text>
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
              {isLoading ? (
                <Text>Loading...</Text>
              ) : (
                <View style={styles.sizesContainer}>
                  {/* Lọc và hiển thị chỉ các size đã được chọn */}
                  {Array.isArray(size) ? size
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
    </View>
  );
};

const styles = StyleSheet.create({
  // Style khi đang loading (skeleton)
  skeletonImage: {
    width: 150,
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain'
  },
  skeletonText: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 10,
  },
  skeletonTextSmall: {
    height: 15,
    width: '60%',
    borderRadius: 4,
  },
  // Style khi hết loading
  container: {
    width: 171,
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
  name: {
    height: 30,
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  rate: {
    position: 'relative',
    width: '100%',
    height: 15,

  },
  rating: {
    fontSize: 12,
  },
  review: {
    position: 'absolute',
    fontSize: 12,
    left: '32%',
  },
  saleLabel: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  saleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 10,
  },
  heart: {
    position: 'absolute',
    bottom: -3,
    right: 0,

  },
  icon: {
    width: 12,
    height: 12,
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
    height: '50%',
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
  confirmButton: {
    flex: 1,
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    borderRadius: 5,
  },
  confirmButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },

});

export default ProductItem;