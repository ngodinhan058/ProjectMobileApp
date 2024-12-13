import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Alert, TouchableOpacity, ActivityIndicator, Modal, TouchableWithoutFeedback, FlatList, Keyboard  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';
import { Rating, AirbnbRating } from 'react-native-ratings';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';


const OrderItem = ({ order, setLoading, onAction }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [unreviewedProducts, setUnreviewedProducts] = useState([]);
  const [isReviewButtonVisible, setReviewButtonVisible] = useState(true);
  


  useEffect(() => {
    const fetchUnreviewedProducts = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) throw new Error('No user token found');
        const { token } = JSON.parse(userData);

        // Kiểm tra từng sản phẩm trong order
        const unreviewed = await Promise.all(
          order?.items?.[0]?.cartItem?.map(async (product) => {
            const response = await axios.get(
              `${BASE_URL}auth/reviews/exists?orderId=${order.orderId}&productId=${product.productId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (response.data === 0) {
              return product; // Sản phẩm chưa được đánh giá
            }
            return null;
          })
        );

        // Lọc và loại bỏ các sản phẩm null hoặc trùng lặp productId
        const uniqueProducts = Array.from(
          new Map(
            unreviewed
              .filter((product) => product !== null) // Loại bỏ null
              .map((product) => [product.productId, product]) // Loại bỏ trùng lặp
          ).values()
        );

        setUnreviewedProducts(uniqueProducts);

        // Ẩn nút "Đánh Giá" nếu không còn sản phẩm chưa được đánh giá
        setReviewButtonVisible(uniqueProducts.length > 0);
      } catch (error) {
        console.error('Error fetching unreviewed products:', error);
      }
    };

    fetchUnreviewedProducts();
  }, [order]);
  useEffect(() => {
    setReviewButtonVisible(unreviewedProducts.length > 0);
  }, [unreviewedProducts]);

  const openModalRate = () => {
    setStep(1);
    setModalVisible(true);
  };
  const openImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setUploadedImage(result.assets[0].uri); // Lưu đường dẫn ảnh đã chọn
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };
  const handleProductSelect = (product) => {
    console.log('Product ID:', product.productId);
    setSelectedProduct(product);
    setStep(2);
  };

  const closeModalRate = () => {
    setModalVisible(false);
    setStep(1);
    setSelectedProduct(null);
    setRating(0);
    setComment('');
    setUploadedImage(null);
  };
  const handleRatingComplete = (ratingValue) => {
    setRating(ratingValue);
  };
  const fetchAndStoreUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);
      const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = response.data.data.userId;
      await AsyncStorage.setItem('userId', userId); // Lưu userId vào AsyncStorage
      return userId;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };
  const handleSubmit = async () => {
    try {
      let userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        userId = await fetchAndStoreUserId();
      }

      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);

      const formData = new FormData();
      if (uploadedImage) {
        const imageFile = {
          uri: uploadedImage,
          type: 'image/jpeg',
          name: 'review.jpg',
        };
        formData.append('image', imageFile);
      }

      const requestPayload = {
        orderId: order.orderId,
        userId,
        productId: selectedProduct.productId,
        comment,
        rating,
      };

      formData.append('request', JSON.stringify(requestPayload));

      const response = await axios.post(`${BASE_URL}auth/reviews/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Review submitted successfully!');

      // Reload danh sách sản phẩm chưa được đánh giá
      const updatedProducts = await Promise.all(
        order?.items?.[0]?.cartItem?.map(async (product) => {
          const response = await axios.get(
            `${BASE_URL}auth/reviews/exists?orderId=${order.orderId}&productId=${product.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data === 0) {
            return product; // Sản phẩm chưa được đánh giá
          }
          return null;
        })
      );

      setUnreviewedProducts(updatedProducts.filter((product) => product !== null));

      closeModalRate(); // Đóng modal sau khi reload thành công
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit the review');
    }
  };

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };
  const handleCancelOrder = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
    onAction?.()

  };

  const handleConfirmOrder = async () => {
    setLoading(true)

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
    } finally {
      setLoading(false)

    }
    onAction?.()
  };
  const handleConfirmCompleteOrder = async () => {
    setLoading(true)
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
    } finally {
      setLoading(false)

    }
    onAction?.()
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
    else if (order?.orderStatus === 3 || 4) {
      setStatusName('Đang Giao Hàng');
    }
    else if (order?.orderStatus === 7) {
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
        ) : order.orderStatus === 3 || 4 ? (
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
        ) : order.orderStatus === 7 ? (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
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
        ) : order.orderStatus === 5 && isReviewButtonVisible ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={openModalRate}
            >
              <Text style={styles.confirmText}>Đánh giá</Text>
            </TouchableOpacity>
          </View>
        ) : order.orderStatus === 5 && !isReviewButtonVisible ? (
          <View style={styles.noReviewContainer}>
            <Text style={styles.noReviewText}></Text>
          </View>
        ) : null
      }
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModalRate}
      >
        <TouchableWithoutFeedback onPress={closeModalRate}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          {step === 1 ? (
            <View>
              <Text style={styles.modalTitle}>Chọn sản phẩm để đánh giá</Text>
              <FlatList
                data={unreviewedProducts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{ flexDirection: 'row', marginHorizontal: 20,}}
                    onPress={() => handleProductSelect(item)}
                  >
                    <Image
                      source={{ uri: item.productImage }}
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: 5,
                        marginBottom: 10,
                      }}
                    />
                    <View style={{ marginTop: 65, marginLeft: 10, }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}>{truncateName(item.productName)}</Text>
                    </View>

                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.productId.toString()}
                ListEmptyComponent={<Text style={styles.noReviewText}>Không có sản phẩm để đánh giá</Text>}
              />

            </View>
          ) : (
            <View>
              <Text style={styles.modalTitle}>Đánh giá sản phẩm</Text>
              {selectedProduct && (
                <View style={styles.imageUploadContainer}>
                  {!uploadedImage ? (
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={openImagePicker}
                    >
                      <Icon name="camera" size={30} color="#3669C9" />
                    </TouchableOpacity>
                  ) : (
                    <Image
                      source={{ uri: uploadedImage }}
                      style={styles.uploadedImage}
                    />
                  )}
                </View>
              )}
              <Rating
                type="star"
                startingValue={0}
                imageSize={30}
                onFinishRating={handleRatingComplete}
                style={{ marginVertical: 10 }}
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Nhập nhận xét của bạn..."
                multiline={true}
                value={comment}
                onChangeText={setComment}
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>


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
    borderRadius: 5,
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
    color: '#000',
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

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  productImageSmall: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 50, // Kích thước tương đương hình ảnh
    height: 50,
    backgroundColor: '#f0f0f0',
  },
  uploadedImage: {
    width: 200,
    height: 150,
    borderRadius: 5,
    resizeMode: 'contain'
  },
  commentInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3669C9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 20  // Căn đều các item trong hàng
  },
  noReviewText: {
    textAlign: 'center',
    color: '#888',
  },
});

export default OrderItem;
