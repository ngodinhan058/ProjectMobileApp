import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useRef, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Easing } from 'react-native';

// Sử dụng React.memo để tránh render lại nếu props không thay đổi
const Footer = React.memo(({ state, descriptors, navigation, isVisible }) => {
  const handlePress = useCallback(
    (routeName) => {
      navigation.navigate(routeName);
    },
    [navigation]
  );

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        // Đặt tên icon cho từng route
        const iconName =
          route.name === 'Mega Mall'
            ? isFocused ? 'home' : 'home-outline'
            : route.name === 'Wishlist'
              ? isFocused ? 'heart' : 'heart-outline'
              : route.name === 'Order'
                ? isFocused ? 'bag' : 'bag-outline'
                : isFocused ? 'person' : 'person-outline';

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(route.name)}
            style={styles.tabButton}
          >
            <Icon name={iconName} size={24} color={isFocused ? '#3669c9' : '#999'} />
            <Text style={{color: isFocused ? '#3669c9' : '#999', fontSize: 12,}}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

export default Footer;

const styles = StyleSheet.create({
  tabBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
  },
  
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
