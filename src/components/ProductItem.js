import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

const ProductItem = ({ id, image, name, price, oldPrice,rating, review, like: initialLike }) => {
  const [loading, setLoading] = useState(true); // Track the loading state
  const [liked, setLiked] = useState(initialLike);
  // const [localUri, setLocalUri] = useState(null);
  const shimmerAnim = useRef(new Animated.Value(0)).current; // Shimmer animation value

  const navigation = useNavigation();

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };
  const toggleLike = () => {
    setLiked(!liked); // Chuyển đổi trạng thái like
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
  useEffect(() => {
    if (typeof image === 'string') {
      imageString(image);
    }
  }, [image]);
  
  const imageString = (image) => {
    return typeof image === 'string'
      ? { uri: image }
      :  setLoading(true) ; // Default placeholder image
  };
  return (
    <View style={styles.container}>
      {loading ? (
        // Skeleton with shimmer effect while loading
        <View>
          <Image
            source={image} 
            onLoad={() => setLoading(false)}  // Ẩn skeleton khi ảnh load xong
          />

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
            const currentRoute = navigation.getState().routes[navigation.getState().index].name;

            if (currentRoute === 'AddedProductToWishlist') {
              // Nếu đang ở ProductDetailScreen, dùng replace
              navigation.replace('AddedProductToWishlist', { image: imageString(image), name, price, rating, review });
            } else {
              // Nếu không, dùng navigate
              navigation.navigate('AddedProductToWishlist', { image: imageString(image), name, price, rating, review });
            }
          }}
        >
          <View>

            <Image
              source={imageString(image)} 
              style={styles.image}
            />
            <Text style={styles.name}>{truncateName(name)}</Text>
            <Text style={styles.price}>{oldPrice}</Text>
            <View style={styles.rate}>
              <Text style={styles.rating}>
                <Image source={require('../assets/star.png')} style={styles.icon} /> {rating}
              </Text>
              <Text style={styles.review}>{review} Review</Text>
              <TouchableOpacity onPress={toggleLike}>
                <Text style={styles.heart}>
                  <Icon name={liked ? "heart" : "heart-outline"} size={18} color="#3669c9" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>


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
    marginHorizontal: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    height: 40,
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    color: 'red',
    fontSize: 14,
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

export default ProductItem;
