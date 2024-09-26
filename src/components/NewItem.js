import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';

const NewItem = ({ title, description, date, image }) => {
  const [loading, setLoading] = useState(true); // Theo dõi trạng thái loading
  const shimmerAnim = useRef(new Animated.Value(0)).current; // Giá trị animation cho shimmer

  // Hàm để giới hạn mô tả, cắt chuỗi sau 30 ký tự
  const truncateDescription = (text) => {
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  // useEffect(() => {
  //   // Giả lập thời gian tải dữ liệu
  //   const timer = setTimeout(() => setLoading(false), 2000);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    // Tạo hiệu ứng shimmer bằng cách lặp lại animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  if (loading) {
    const shimmerBackground = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#e0e0e0', '#f0f0f0'], // Màu sáng và tối của skeleton
    });

    return (
      
      <View style={styles.skeletonContainer}>
        <Image
            source={image}
            onLoad={() => setLoading(false)} // Khi ảnh load xong, ẩn skeleton
          />
        <View style={styles.skeletonTextContainer}>
          <Animated.View style={[styles.skeletonTitle, { backgroundColor: shimmerBackground }]} />
          <Animated.View style={[styles.skeletonDescription, { backgroundColor: shimmerBackground }]} />
          <Animated.View style={[styles.skeletonDate, { backgroundColor: shimmerBackground }]} />
        </View>
        <Animated.View style={[styles.skeletonImage, { backgroundColor: shimmerBackground }]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nội dung bài viết */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{truncateDescription(description)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Hình ảnh bài viết */}
      <Image source={image} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Style khi đang loading (skeleton)
  skeletonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  skeletonTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  skeletonTitle: {
    width: '80%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  skeletonDescription: {
    width: '90%',
    height: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  skeletonDate: {
    width: '40%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonImage: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },

  // Style khi hết loading
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default NewItem;
