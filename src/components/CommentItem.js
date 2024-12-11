import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Modal, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const CommentItem = ({ reviewId, comment, rating, totalLike, userFullName, reviewImg, createdAt, isLikedByCurrentUser, children, userId, review, onActionComplete, openLogin }) => {
  const [userData, setUserData] = useState({});
  const [user, setUser] = useState();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [commentAdmin, setComment] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [reviews, setReviews] = useState(review || []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        // if (!userData) throw new Error('No user token found');

        const { token, role } = JSON.parse(userData);
        setUserData(role)
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userInfo = response.data.data;

        setUser({
          userId: userInfo.userId,
          name: `${userInfo.userLastName} ${userInfo.userFirstName}`,
        });
      } catch (error) {
        console.log('Failed to fetch user data123:', error);
      }
    };

    fetchUserData();
  }, []);
  const hasRole = (role) => Object.keys(userData).length !== 0 ? userData?.includes(role) : null
  const handleLikeToggle = async (reviewId, isCurrentlyLiked) => {
    if (user) {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) throw new Error("No user token found");

        const { token } = JSON.parse(userData);

        const apiUrl = `${BASE_URL}auth/review-like`;
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        if (isCurrentlyLiked) {
          // Gửi request DELETE để bỏ thích
          await axios.delete(apiUrl, {
            headers,
            params: {
              reviewId,
              userId: user.userId, // Giả sử bạn đã lưu userId trong state user
            },
          });
        } else {
          // Gửi request POST để thích
          await axios.post(
            apiUrl,
            {
              reviewId,
              userId: user.userId, // Giả sử bạn đã lưu userId trong state user
            },
            { headers }
          );
        }
        const updatedReviews = reviews.map((review) => {
          if (review.reviewId === reviewId) {
            return {
              ...review,
              isLikedByCurrentUser: !isCurrentlyLiked,
              totalLike: isCurrentlyLiked
                ? review.totalLike - 1
                : review.totalLike + 1,
            };
          }
          return review;
        });
        onActionComplete?.();
        setReviews(updatedReviews);
      } catch (error) {
        console.error("Failed to toggle like:", error);
        Alert.alert("Lỗi", "Không thể cập nhật trạng thái thích.");
      }
    } else {
      openLogin?.();
    }

  };
  const handleDeleteReview = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("No user token found");

      const { token } = JSON.parse(userData);
      const deleteUrl = `${BASE_URL}auth/reviews/delete/${reviewId}`;
      await axios.delete(deleteUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReviews((prevReviews) => prevReviews.filter((review) => review.reviewId !== reviewId));
      onActionComplete?.();
      Alert.alert("Thành công", "Bài đánh giá đã được xóa.");
    } catch (error) {
      console.error("Lỗi khi xóa bài đánh giá:", error);
      Alert.alert("Lỗi", "Không thể xóa bài đánh giá.");
    }
  };
  const handleReply = async () => {
    if (!commentAdmin.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung phản hồi.");
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');
      const { token } = JSON.parse(userData);
      console.log(token);

      const formData = new FormData();
      if (uploadedImage) {
        formData.append('image', {
          uri: uploadedImage,
          type: 'image/jpeg',
          name: 'reply.jpg',
        });
      }
      formData.append('request', JSON.stringify({
        parentId: selectedReview,
        userId: user?.userId,
        comment: commentAdmin,
      }));
      console.log(formData);

      await axios.post(`${BASE_URL}auth/reviews/reply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Thành công', 'Phản hồi đã được gửi!');
      onActionComplete?.();
      setReplyModalVisible(false);
      setComment('');
      setUploadedImage(null);
      // fetchProductReviews(id);
    } catch (error) {
      console.error('Lỗi gửi phản hồi:', error);
      Alert.alert('Lỗi', 'Không thể gửi phản hồi.');
    }
  };

  const handleImagePicker = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'You need to grant permission to access the gallery.');
        return;
      }

      // Mở thư viện ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ chọn ảnh
        allowsEditing: true, // Cho phép chỉnh sửa
        quality: 1, // Chất lượng ảnh cao
      });

      console.log('ImagePicker Result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadedImage(result.assets[0].uri); // Lưu đường dẫn ảnh
      } else {
        console.log('Image selection was canceled');
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };
  const showDeleteAlert = () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa review này không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy hành động xóa"),
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: () => handleDeleteReview(),
        }
      ]
    );
  };
  const isReviewOwner = (reviewUserId) => reviewUserId === user?.userId;
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.reviewerName}>{userFullName}</Text>
          <Text style={styles.reviewDate}>
            Thời gian: {new Date(createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.cardContent}>
          {reviewImg && (
            <Image
              style={{ width: 100, height: 100, marginBottom: 10 }}
              source={{ uri: reviewImg }}
            />
          )}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Lượt đánh giá: </Text>
            {Array.from({ length: Math.round(rating) }).map((_, index) => (
              <Text key={index} style={styles.star}>⭐</Text>

            ))}
          </View>
          <Text style={styles.reviewComment}>Nội dung: {comment}</Text>
          <View style={styles.likesContainer}>
            {hasRole("ROLE_ADMIN") ? (<TouchableOpacity
              onPress={() => {
                setSelectedReview(reviewId);
                setReplyModalVisible(true);
              }}
              style={styles.replyButton}
            >
              <Text style={styles.replyButtonText}>Phản hồi</Text>
            </TouchableOpacity>) : null}


            {isLikedByCurrentUser ? <TouchableOpacity
              style={{
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                backgroundColor: '#FE3A30',
              }}
              onPress={() => handleLikeToggle(reviewId, isLikedByCurrentUser)}>
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
                <Text style={{ color: '#FFF', }}>{totalLike}</Text>

              </View>
            </TouchableOpacity>
              : <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderColor: '#ccc',
                  borderWidth: 1,
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => handleLikeToggle(reviewId, isLikedByCurrentUser)}>
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
                    style={{ width: 20, height: 20, tintColor: '#3669c9', }}
                    source={require('../assets/heart.png')}
                  />
                  <Text>{totalLike}</Text>
                </View>
              </TouchableOpacity>}
            {isReviewOwner(userId) && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={showDeleteAlert}
                >
                  <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}


          </View>



        </View>

        {/* Hiển thị phản hồi */}
        {children && children.length > 0 && (
          <View style={styles.repliesContainer}>
            {/* Giới hạn hiển thị phản hồi đầu tiên */}
            {expandedReplies[reviewId] ? (
              children.map((reply) => (
                <View key={reply.reviewId} style={styles.replyCard}>
                  <Text style={styles.replyUser}>Phản hồi từ: Chăm sóc khách hàng</Text>
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
                <Text style={styles.replyUser}>Phản hồi từ: Chăm sóc khách hàng</Text>
                {children[0].reviewImagePath && (
                  <Image
                    style={{ width: 100, height: 100, marginTop: 5 }}
                    source={{ uri: children[0].reviewImagePath }}
                  />
                )}
                <Text style={styles.replyContent}>Nội dung: {children[0].reviewComment}</Text>
                <Text style={styles.replyDate}>
                  Thời gian: {new Date(children[0].createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
            )}

            {/* Nút xem thêm/thu lại */}
            {children.length > 1 && (
              <TouchableOpacity
                onPress={() =>
                  setExpandedReplies((prev) => ({
                    ...prev,
                    [reviewId]: !prev[reviewId],
                  }))
                }
              >
                <Text style={styles.toggleButtonText}>
                  {expandedReplies[reviewId] ? 'Thu lại' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <Modal
        visible={replyModalVisible} // Hiển thị modal dựa trên trạng thái
        animationType="slide"
        transparent={true}
        onRequestClose={() => setReplyModalVisible(false)} // Đóng modal khi nhấn nút back
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Phản hồi đánh giá</Text>

            {/* Trường nhập nội dung */}
            <TextInput
              style={styles.textInput}
              placeholder="Nhập nội dung phản hồi..."
              value={commentAdmin}
              onChangeText={setComment}
              multiline
            />

            {/* Nút chọn ảnh */}
            <TouchableOpacity style={styles.uploadButton}
              onPress={handleImagePicker}>
              <Text style={styles.uploadButtonText}>
                {uploadedImage ? 'Đã chọn ảnh' : 'Chọn ảnh'}
              </Text>
            </TouchableOpacity>


            {/* Nút gửi phản hồi */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setReplyModalVisible(false)} // Đóng modal
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleReply} // Gửi phản hồi
              >
                <Text style={styles.sendButtonText}>Gửi phản hồi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5, // Hiệu ứng bóng trên Android
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
  likeButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  liked: {
    backgroundColor: '#FE3A30',
  },
  unliked: {
    backgroundColor: '#ddd',
  },
  likeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  likeCount: {
    fontSize: 14,
    color: '#555',
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
  repliesContainer: {
    marginTop: 10,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#ccc',
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
  // Khu vực bộ lọc rating
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
  selectedRatingRow: {
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 80,
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
    backgroundColor: '#3669C9',
    borderRadius: 5,
  },
  ratingCount: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  replyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  replyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },


});

export default CommentItem;
