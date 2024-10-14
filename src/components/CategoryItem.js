import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CategoryItem = ({ image, name }) => {
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
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
    <View>
      {loading ? (
        // Skeleton with shimmer effect while loading
        <View>
          <Image
            source={image}
            onLoad={() => setLoading(false)} // Khi ảnh load xong, ẩn skeleton
          />
          <Animated.View style={[styles.skeletonItem, {
            backgroundColor: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
            })
          }]} />

        </View>
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('ProductByCateScreen',{ image, name })}>
            <View style={styles.categoryItem}>
              <Image source={image} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryName}>{name}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonItem: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative',
    borderRadius: 10,
    marginRight: 30,
    alignItems: 'center',
  },
  // Style khi hết loading
  categoryItem: {
    position: 'relative',
    backgroundColor: '#e9f3ea',
    borderRadius: 10,
    marginRight: 30,
    alignItems: 'center',
    width: 48,
    height: 48,
  },
  categoryImage: {
    position: 'absolute',
    width: 30,
    height: 30,
    marginTop: 9,
  },
  categoryName: {
    width: 48,
    marginTop: 8,
    textAlign: 'center'

  },
});

export default CategoryItem;
