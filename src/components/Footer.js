import Icon from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sử dụng React.memo để tránh render lại nếu props không thay đổi
const Footer = React.memo(({ state, descriptors, navigation, isVisible }) => {
  if (!isVisible) return null
  const handlePress = useCallback(
    (routeName) => {
      navigation.navigate(routeName);
    },
    [navigation]
  );

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Lấy dữ liệu từ AsyncStorage
        const userInfoString = await AsyncStorage.getItem('userInfo');

        // Nếu có dữ liệu thì parse nó thành JSON
        if (userInfoString) {
          const userInfoData = JSON.parse(userInfoString);
          setUserInfo(userInfoData); // Lưu vào state
        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      }
    };

    fetchUserInfo();
  }, []);

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
              <>
                <Icon name={iconName} size={24} color={isFocused ? '#3669c9' : '#999'} />
                <Text style={{ color: isFocused ? '#3669c9' : '#999', fontSize: 12 }}>{route.name}</Text>
              </>
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
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },

  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
