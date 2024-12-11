import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';
import * as ImagePicker from 'expo-image-picker';
import CommentItem from '../components/CommentItem';
import { ScrollView } from 'react-native-gesture-handler';
function ReviewProductScreen({ navigation, route }) {
  const { productId, userInfo } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const openModalLogin = () => {
    setIsLoginModalVisible(true);
  };
  const closeModalLogin = () => setIsLoginModalVisible(false);
  useEffect(() => {
    if (reviews.length > 0) {
      const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach((review) => {
        const roundedRating = Math.round(review.rating);
        ratingsCount[roundedRating] = (ratingsCount[roundedRating] || 0) + 1;
      });
      setRatings(ratingsCount);
      setTotalReviews(reviews.length);
    }
  }, [reviews]);

  const [userData, setUserData] = useState({});
  const [userDataToken, setUserDataToken] = useState({});



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        // if (!userData) throw new Error('No user token found');

        const { token, role } = JSON.parse(userData);
        setUserData(role)
        setUserDataToken(token)
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userInfo = response.data.data;

        setUser({
          id: userInfo.userId,
          name: `${userInfo.userLastName} ${userInfo.userFirstName}`,
        });
      } catch (error) {
        console.log('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const fetchReviews = async () => {
    setLoading(true);
    try {
      if (userInfo) {
        const response = await axios.get(
          `${BASE_URL}auth/reviews/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userDataToken}`, // Gắn token vào header
            },
          }
        );
        const reviewsData = response.data.data;
        setReviews(reviewsData);

      } else {
        const response = await axios.get(`${BASE_URL}auth/reviews/product/${productId}`);
        const reviewsData = response.data.data;
        setReviews(reviewsData);
      }
    } catch (error) {
      console.log("Lỗi khi lấy đánh giá sản phẩm:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, [productId, userDataToken]); // Thêm token vào dependency nếu cần
  //fiter rating 
  const handleFilterByRating = async (rating) => {
    try {
      setLoading(true);

      if (selectedRating === rating) {
        // Xóa bộ lọc nếu nhấn lại vào cùng một sao
        setSelectedRating(null);

        const response = await axios.get(
          `${BASE_URL}auth/reviews/product/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userDataToken}`, // Gắn token vào header
            },
          }
        );
        const reviewsData = response.data.data;

        // Thêm trạng thái "like" vào từng đánh giá
        const updatedReviews = await Promise.all(
          reviewsData.map(async (review) => {
            const storedData = await AsyncStorage.getItem(`review_like_${review.reviewId}`);
            const isLiked = storedData ? JSON.parse(storedData).isLiked : false;
            return { ...review, isLiked };
          })
        );

        setReviews(updatedReviews); // Hiển thị tất cả đánh giá
      } else {
        // Lưu bộ lọc mức sao được chọn
        setSelectedRating(rating);

        const response = await axios.get(
          `${BASE_URL}auth/reviews/${productId}/rating?rating=${rating}`,
          {
            headers: {
              Authorization: `Bearer ${userDataToken}`,
            },
          }
        );

        const reviewsData = response.data?.data || [];
        if (!Array.isArray(reviewsData)) {
          throw new Error('Dữ liệu đánh giá không hợp lệ');
        }

        // Thêm trạng thái "like" vào dữ liệu đã lọc
        const filteredReviews = await Promise.all(
          reviewsData.map(async (review) => {
            const storedData = await AsyncStorage.getItem(`review_like_${review.reviewId}`);
            const isLiked = storedData ? JSON.parse(storedData).isLiked : false;
            return { ...review, isLiked };
          })
        );

        setReviews(filteredReviews);
      }
    } catch (error) {
      console.log('Lỗi khi lọc đánh giá theo sao:', error);
      Alert.alert('Lỗi', 'Không thể lọc đánh giá.');
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    fetchReviews();
  }, []);
  return (
    <>
      <View style={styles.reviewContainer} >
        {/* <Text style={styles.reviewTitle}>Đánh Giá Sản Phẩm</Text> */}
        <View style={styles.ratingStats}>
          {[5, 4, 3, 2, 1].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleFilterByRating(star)}
              style={[
                styles.ratingRow,
                selectedRating === star && styles.selectedRatingRow,
              ]}
            >
              <View style={styles.starRow}>
                {[...Array(star)].map((_, index) => (
                  <Text key={index} style={styles.star}>⭐</Text>
                ))}
              </View>
              <View style={styles.progressBar}>
                <View
                  style={{
                    ...styles.progress,
                    width: `${(ratings[star] / totalReviews) * 100 || 0}%`,
                  }}
                />
              </View>
              <Text style={styles.ratingCount}>{ratings[star]?.toString() || '0'}</Text>
            </TouchableOpacity>
          ))}
        </View>


        {loading ? (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#3669c9" />
          </View>
        ) :
          <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3669c9']} />
          }>
            {selectedRating && (
              <Text style={styles.selectedRatingTitle}>
                Hiển thị đánh giá với {selectedRating} ⭐
              </Text>
            )}
            {reviews.length > 0 ? (
              reviews?.map((item) => {
                return (
                  <CommentItem
                    key={item?.reviewId}
                    reviewId={item?.reviewId}
                    comment={item?.comment}
                    rating={item?.rating}
                    totalLike={item?.totalLike}
                    userFullName={item?.userFullName}
                    reviewImg={item?.reviewImg}
                    createdAt={item?.createdAt}
                    isLikedByCurrentUser={item?.isLikedByCurrentUser}
                    children={item?.children}
                    userId={item?.userId}
                    review={reviews}
                    onActionComplete={() => fetchProductReviews()}
                    openLogin={openModalLogin}

                  />
                );
              })
            ) : <Text style={styles.emptyText}>Chưa có đánh giá nào.</Text>}

          </ScrollView>
        }
      </View>
      {/* No Login */}
      <Modal visible={isLoginModalVisible} animationType="slide"
        transparent={true}
        onRequestClose={closeModalLogin}>
        <TouchableWithoutFeedback onPress={closeModalLogin}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainerLogin}>
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
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Đăng Nhập')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  reviewContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#888',
  },
  cardContent: {
    marginTop: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 5,
    color: '#666',
  },
  starIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeCount: {
    fontSize: 14,
    color: '#555',
  },
  repliesContainer: {
    marginTop: 10,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
  },
  repliesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  replyCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  replyUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  replyContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  replyDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  toggleButtonText: {
    color: '#3669C9',
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  iconButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  iconButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  //RATING
  ratingStats: {
    marginVertical: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 80, // Đảm bảo chiều rộng cố định cho hàng sao
  },
  star: {
    color: '#FFD700',
    fontSize: 12,
    marginHorizontal: 2,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 18,
  },
  progress: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
  ratingCount: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedRatingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3669C9',
    marginBottom: 10,
    textAlign: 'center',
  },
  selectedRatingRow: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
  },
  selectedRatingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3669C9',
    marginBottom: 10,
    textAlign: 'center',
  },

  ownerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  updateButton: {
    marginLeft: 10,
  },

  likeText: {
    fontSize: 16,
    marginLeft: 5,
  },
  liked: {
    color: "red",
  },
  unliked: {
    color: "black",
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 30,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
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
});

export default ReviewProductScreen;
