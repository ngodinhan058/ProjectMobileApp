import Icon from 'react-native-vector-icons/Ionicons';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function Footer({ state, descriptors, navigation, isVisible }) {
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 100, // Ẩn hoặc hiện footer khi cuộn lên/xuống
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  return (
    <Animated.View style={[styles.tabBarContainer, { transform: [{ translateY }] }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        // Đặt tên icon cho từng route
        let iconName;
        if (route.name === 'Mega Mall') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Wishlist') {
          iconName = isFocused ? 'heart' : 'heart-outline';
        } else if (route.name === 'MyOrderScreen') {
          iconName = isFocused ? 'bag' : 'bag-outline';
        } else if (route.name === 'Login') {
          iconName = isFocused ? 'person' : 'person-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <Icon name={iconName} size={24} color={isFocused ? '#3669c9' : '#999'} />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

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
