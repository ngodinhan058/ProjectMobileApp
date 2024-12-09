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
  TextInput,

} from 'react-native';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';
import * as ImagePicker from 'expo-image-picker';
import CommentItem from '../components/CommentItem';



function ReviewProductScreen({ route }) {
  const { productId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [comment, setComment] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ratings, setRatings] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedRating, setSelectedRating] = useState(null);


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
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}auth/reviews/product/${productId}`);
        const reviewsData = response.data;

        if (!Array.isArray(reviewsData)) {
          throw new Error("Dữ liệu đánh giá không hợp lệ");
        }

        // Không thêm giá trị mặc định `isLikedByCurrentUser`
        setReviews(reviewsData);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá sản phẩm:", error);
        Alert.alert("Lỗi", "Không thể tải đánh giá sản phẩm.");
      } finally {
        setLoading(false);
      }
    };



    fetchReviews();
  }, [productId]);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) throw new Error('No user token found');

        const { token, role } = JSON.parse(userData);
        setUserData(role)
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userInfo = response.data.data;

        setUser({
          id: userInfo.userId,
          name: `${userInfo.userLastName} ${userInfo.userFirstName}`,
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const hasRole = (role) => Object.keys(userData).length !== 0 ? userData?.includes(role) : null

  //thich
  const handleLikeToggle = async (reviewId, isCurrentlyLiked) => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("No user token found");

      const { token } = JSON.parse(userData);

      const apiUrl = `${BASE_URL}auth/review-like`;
      const headers = { Authorization: `Bearer ${token}` };

      if (isCurrentlyLiked) {
        await axios.delete(apiUrl, {
          headers,
          params: {
            reviewId,
            userId: user.id, // Đảm bảo user.id đã được set trước đó
          },
        });
      } else {
        await axios.post(
          apiUrl,
          { reviewId, userId: user.id },
          { headers }
        );
      }

      // Cập nhật trực tiếp trạng thái reviews
      const updatedReviews = reviews.map((review) => {
        if (review.reviewId === reviewId) {
          return {
            ...review,
            isLikedByCurrentUser: !isCurrentlyLiked,
            totalLike: isCurrentlyLiked ? review.totalLike - 1 : review.totalLike + 1,
          };
        }
        return review;
      });

      console.log("Updated Reviews:", updatedReviews);
      setReviews(updatedReviews);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái thích.");
    }
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
        quality: 1,
      });

      console.log('ImagePicker Result:', result);

      if (!result.canceled) {
        setUploadedImage(result.assets[0].uri); // Đảm bảo truy cập đúng `uri`
      } else {
        console.error('Image selection was canceled');
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };


  const handleReply = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);

      const formData = new FormData();
      if (uploadedImage) {
        formData.append('image', {
          uri: uploadedImage,
          type: 'image/jpeg',
          name: 'reply.jpg',
        });
      }

      const requestPayload = {
        parentId: selectedReview.reviewId,
        userId: user.id,
        comment,
      };

      formData.append('request', JSON.stringify(requestPayload));

      const response = await axios.post(`${BASE_URL}auth/reviews/reply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Reply submitted successfully!');
      setModalVisible(false);
      setComment('');
      setUploadedImage(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      Alert.alert('Error', 'Failed to submit the reply.');
    }
  };

  //fiter rating 
  const handleFilterByRating = async (rating) => {
    try {
      setLoading(true);

      if (selectedRating === rating) {
        setSelectedRating(null); // Xóa bộ lọc nếu nhấn lại vào cùng một sao
        const response = await axios.get(`${BASE_URL}auth/reviews/product/${productId}`);
        const reviewsData = response.data;

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
        setSelectedRating(rating); // Lưu bộ lọc mức sao được chọn
        const response = await axios.get(
          `${BASE_URL}auth/reviews/${productId}/rating?rating=${rating}`
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

        setReviews(filteredReviews); // Hiển thị đánh giá đã lọc
      }
    } catch (error) {
      console.error('Lỗi khi lọc đánh giá theo sao:', error);
      Alert.alert('Lỗi', 'Không thể lọc đánh giá.');
    } finally {
      setLoading(false); // Đảm bảo trạng thái loading luôn tắt
    }
  };




  const renderReviewItem = ({ item }) => {
    const isOwner = user && user.id === item.userId;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.reviewerName}>Người đánh giá: {item.userFullName}</Text>
          <Text style={styles.reviewDate}>
            Thời gian: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Lượt đánh giá: </Text>
            {Array.from({ length: Math.round(item.rating) }).map((_, index) => (
              <Image
                key={index}
                style={styles.starIcon}
                source={require('../assets/star.png')}
              />
            ))}
          </View>
          <Text style={styles.reviewComment}>Nội dung: {item.comment}</Text>
          <View style={styles.likesContainer}>
            <TouchableOpacity
              onPress={() => handleLikeToggle(item.reviewId, item.isLikedByCurrentUser)}
            >
              <Text
                style={[
                  styles.likeText,
                  item.isLikedByCurrentUser ? styles.liked : styles.unliked, // Đảm bảo logic điều kiện này
                ]}
              >
                Thích: {item.totalLike}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                setSelectedReview(item);
                setModalVisible(true);
              }}
              style={styles.replyButton}
            >
              {hasRole("ROLE_ADMIN") && (<Text style={styles.replyButtonText}>Phản hồi</Text>)}

            </TouchableOpacity>

            {isOwner && (
              <View style={styles.ownerActions}>
                <TouchableOpacity
                  onPress={() => handleDeleteReview(item.reviewId)}
                  style={styles.deleteButton}
                >
                  <FontAwesomeIcon name="trash" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedReview(item);
                    setModalVisible(true);
                  }}
                  style={styles.updateButton}
                >
                  <FontAwesomeIcon name="edit" size={24} color="blue" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        {item.children && item.children.length > 0 && (
          <View style={styles.repliesContainer}>
            <Text style={styles.repliesTitle}>Phản hồi:</Text>

            {/* Giới hạn hiển thị phản hồi đầu tiên */}
            {expandedReplies[item.reviewId] ? (
              item.children.map((reply, index) => (
                <View key={reply.reviewId} style={styles.replyCard}>
                  <Text style={styles.replyUser}>Name: Chăm sóc khách hàng</Text>
                  {reply.reviewImagePath && (
                    <Image
                      style={{ width: 100, height: 100, marginTop: 5 }}
                      source={{ uri: reply.reviewImagePath }}
                    />
                  )}
                  <Text style={styles.replyContent}>Nội dung: {reply.reviewComment}</Text>
                  <Text style={styles.replyDate}>
                    Thời gian: {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.replyCard}>
                <Text style={styles.replyUser}>Name: Chăm sóc khách hàng</Text>
                {item.children[0].reviewImagePath && (
                  <Image
                    style={{ width: 100, height: 100, marginTop: 5 }}
                    source={{ uri: item.children[0].reviewImagePath }}
                  />
                )}
                <Text style={styles.replyContent}>Nội dung: {item.children[0].reviewComment}</Text>
                <Text style={styles.replyDate}>
                  Thời gian: {new Date(item.children[0].createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )}

            {/* Nút xem thêm/thu lại */}
            {item.children.length > 1 && (
              <TouchableOpacity
                onPress={() =>
                  setExpandedReplies((prev) => ({
                    ...prev,
                    [item.reviewId]: !prev[item.reviewId],
                  }))
                }
              >
                <Text style={styles.toggleButtonText}>
                  {expandedReplies[item.reviewId] ? 'Thu lại' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

      </View>
    );
  };

  return (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewTitle}>Đánh Giá Sản Phẩm</Text>
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
        <ActivityIndicator size="large" color="#3669C9" />
      ) : reviews.length > 0 ? (
        <>
          {selectedRating && (
            <Text style={styles.selectedRatingTitle}>
              Hiển thị đánh giá với {selectedRating} ⭐
            </Text>
          )}
          {/* <FlatList
          data={reviews}
          extraData={reviews} // Buộc render lại khi reviews thay đổi
          keyExtractor={(item) => item.reviewId.toString()}
          renderItem={renderReviewItem}
        /> */}
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
                  createdAt={item?.createdAt}
                  isLikedByCurrentUser={item?.isLikedByCurrentUser}
                  children={item?.children}

                />
              );
            })
          ) : null}

        </>
      ) : (
        <Text>Chưa có đánh giá nào cho sản phẩm này.</Text>
      )}



      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Nhập phản hồi của bạn..."
            value={comment}
            onChangeText={setComment}
            style={styles.input}
          />
          <TouchableOpacity onPress={openImagePicker} style={styles.uploadButton}>
            <Text>Upload Hình</Text>
          </TouchableOpacity>
          {uploadedImage && <Image source={{ uri: uploadedImage }} style={styles.imagePreview} />}
          <TouchableOpacity onPress={handleReply} style={styles.submitButton}>
            <Text>Gửi phản hồi</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

export default ReviewProductScreen;
