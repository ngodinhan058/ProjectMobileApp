import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

// Sử dụng React.memo để tránh render lại nếu props không thay đổi
const Footer = React.memo(({ state, descriptors, navigation, isVisible }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 100, // Ẩn hoặc hiện footer khi cuộn lên/xuống
      duration: 250, // Giảm duration để animation nhanh hơn
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

 // Tối ưu hóa callback cho việc điều hướng
  const handlePress = useCallback(
    (routeName) => {
      navigation.navigate(routeName);
    },
    [navigation]
  );

  return (
    <Animated.View style={[styles.tabBarContainer, { transform: [{ translateY }] }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Đặt tên icon cho từng route
        const iconName =
          route.name === 'Mega Mall'
            ? isFocused ? 'home' : 'home-outline'
            : route.name === 'Wishlist'
            ? isFocused ? 'heart' : 'heart-outline'
            : route.name === 'MyOrderScreen'
            ? isFocused ? 'bag' : 'bag-outline'
            : isFocused ? 'person' : 'person-outline';

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(route.name)}
            style={styles.tabButton}
          >
            <Icon name={iconName} size={24} color={isFocused ? '#3669c9' : '#999'} />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
});

export default Footer;

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    margin: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
