import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const SaleItem = ({ image, name, salePrice, originalPrice, rating, reviews }) => {
  const [loading, setLoading] = useState(true); // Track the loading state
  const shimmerAnim = useRef(new Animated.Value(0)).current; // Shimmer animation value

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };

  useEffect(() => {
    // Bắt đầu hiệu ứng shimmer khi component được mount
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

  return (
    <View style={styles.container}>
      {loading ? (
        // Skeleton with shimmer effect while loading
        <View>
          <Image
            source={image}
            onLoad={() => setLoading(false)} // Khi ảnh load xong, ẩn skeleton
          />
          <Animated.View style={[styles.skeletonImage, { backgroundColor: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
          })}]} />
          <Animated.View style={[styles.skeletonText, { backgroundColor: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#e0e0e0', '#f0f0f0'],
          })}]} />
          <Animated.View style={[styles.skeletonTextSmall, { backgroundColor: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#e0e0e0', '#f0f0f0'],
          })}]} />
        </View>
      ) : (
        <>
          {/* Nhãn SALE */}
          <View style={styles.saleLabel}>
            <Text style={styles.saleText}>SALE</Text>
          </View>

          <Image source={image} style={styles.image} />
          <Text style={styles.name}>{truncateName(name)}</Text>
          <Text style={styles.salePrice}>{salePrice}</Text>
          <Text style={styles.originalPrice}>{originalPrice}</Text>

          <View style={styles.rate}>
            <Text style={styles.rating}>
              <Image source={require('../assets/star.png')} style={styles.icon} /> {rating}
            </Text>
            <Text style={styles.review}>{reviews} Review</Text>
            <Text style={styles.heart}><Icon name="heart-outline" size={18} color="#000" /></Text>
          </View>
        </>
      )}
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
    height: 140,
    marginBottom: 10,
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
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  saleLabel: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  saleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  name: {
    height: 40,
    fontSize: 14,
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
  heart: {
    position: 'absolute',
    bottom: -3,
    right: 0,
    
  },
  icon: {
    width: 12,
    height: 12,
  },
});

export default SaleItem;
