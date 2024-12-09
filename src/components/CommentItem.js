import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CommentItem = ({ reviewId, comment, rating, totalLike, userFullName, createdAt, isLikedByCurrentUser, children  }) => {
  // const isReviewOwner = (reviewUserId) => reviewUserId === user.id;
  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.reviewerName}>Name: {userFullName}</Text>
          <Text style={styles.reviewDate}>
            Thời gian: {new Date(createdAt).toLocaleDateString('vi-VN')}
          </Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Lượt đánh giá: </Text>
            {Array.from({ length: Math.round(rating) }).map((_, index) => (
              <Image
                key={index}
                style={styles.starIcon}
                source={require('../assets/star.png')}
              />
            ))}
          </View>
          <Text style={styles.reviewComment}>Nội dung: {comment}</Text>
          <View style={styles.likesContainer}>
            <TouchableOpacity
              onPress={() => handleLikeToggle(reviewId, isLikedByCurrentUser)}
            >
              <Text
                style={[
                  styles.likeText,
                  isLikedByCurrentUser ? styles.liked : styles.unliked,
                ]}
              >
                Thích: {totalLike}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.replyButton}
              onPress={() => {
                setSelectedReview(item); // Lưu lại thông tin review được chọn
                setReplyModalVisible(true);
              }}
            >
              <Text style={styles.replyButtonText}>Phản hồi</Text>
            </TouchableOpacity>
          </View>
          {/* {isReviewOwner(item.userId) && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReview(reviewId)}
              >
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )} */}


        </View>

        {/* Hiển thị phản hồi */}
        {children && children.length > 0 && (
          <View style={styles.repliesContainer}>
            <Text style={styles.repliesTitle}>Phản hồi:</Text>

            {/* Giới hạn hiển thị phản hồi đầu tiên */}
            {expandedReplies[reviewId] ? (
              children.map((reply) => (
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
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
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
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },

});

export default CommentItem;
