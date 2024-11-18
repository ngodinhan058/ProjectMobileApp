import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CategoryItem = ({ id, image, name, isLoading }) => {

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
    <View style={{paddingHorizontal: 10}}>
      {isLoading ? (
        // Skeleton with shimmer effect while loading
        <View>
          <Animated.View style={[styles.skeletonItem, {
            backgroundColor: shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
            })
          }]} />

        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => navigation.navigate('ProductByCateScreen', { id: id })}
          >
            <Image source={{ uri: image }} style={styles.categoryImage} />
            <Text style={styles.categoryName} numberOfLines={2}>
              {name}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonItem: {
    width: 100,
    height: 100,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  categoryButton: {
    width: 100,
    height: 100,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    color: '#222',
  },
});

export default CategoryItem;
