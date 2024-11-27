  import Icon from 'react-native-vector-icons/Ionicons';
  import React, { useEffect, useState, useCallback } from 'react';
  import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { BASE_URL } from '../screens/api/config';

  const Footer = React.memo(({ state, descriptors, navigation, isVisible }) => {
    if (!isVisible) return null;
    const [user, setUser] = useState({});
    const [userInfo, setUserData] = useState({});

    const getItem = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('userData');

        if (savedCart) {
          const { username, token } = JSON.parse(savedCart);
          setUser({ username, token });
        } else {
          setUser({});
        }
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
      }
    };
    useEffect(() => {
      getItem();
    }, []);

    useEffect(() => {
      // Gọi API lấy thông tin người dùng nếu token có giá trị
      const loadUserInfo = async () => {
        if (user) {
          try {
            const response = await fetch(`${BASE_URL}auth/users/myInfo`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
            });

            // Kiểm tra mã trạng thái phản hồi
            if (response.ok) {
              const result = await response.json();
              console.log('API response data:', result.data);

              if (result) {
                setUserData(result.data); // Lưu thông tin người dùng vào state

                // Lưu thông tin người dùng vào AsyncStorage
                await AsyncStorage.setItem(
                  'userInfo',
                  JSON.stringify(result.data)
                );
                console.log('User info saved to AsyncStorage');
              } else {
                console.log('No data in API response');
              }
            } else {
              console.log('Failed to fetch user info. Status:', response.status);
            }
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        } else {
          await AsyncStorage.removeItem('userInfo');
          await AsyncStorage.removeItem('userData');
        }
      };

      loadUserInfo();
    }, [user.token]);

    const handlePress = useCallback(
      (routeName) => {
        navigation.navigate(routeName);
      },
      [navigation]
    );
    // const [userName, setUserName] = useState(userInfo?.userFirstName+" "+userInfo?.userLastName);
    // console.log(userInfo);
    
    return (
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          let iconName;
          let customComponent = null;

          // Điều kiện gán icon hoặc component tuỳ theo route và trạng thái userInfo
          if (route.name === 'Mega Mall') {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === 'Yêu Thích') {
            iconName = isFocused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Đơn Hàng') {
            iconName = isFocused ? 'bag' : 'bag-outline';
          } else if (userInfo) {
            if (route.name === 'Đăng Nhập') {
              iconName = isFocused ? 'person' : 'person-outline';
            }
          } else if (route.name === 'Tài Khoản' && userInfo?.userImagePath) {
            // Custom hình ảnh đại diện nếu user đã đăng nhập
            customComponent = isFocused ? (
              <View style={[styles.profileContainer, styles.profileContainerFocused]}>
                <Image
                  source={{ uri: userInfo.userImagePath }}
                  style={styles.profileImage}
                />
              </View>
            ) : (
              <Image
                source={{ uri: userInfo.userImagePath }}
                style={[styles.profileImage, styles.profileImageUnfocused]}
              />
            );
          }

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(route.name)}
              style={styles.tabButton}
            >
              {customComponent || (
                <>
                  <Icon name={iconName} size={25} color={isFocused ? '#3669c9' : '#999'} />
                </>
              )}

              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {route.name}
              </Text>


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
    tabLabel: {
      color: '#999',
      fontSize: 12,
    },
    tabLabelFocused: {
      color: '#3669c9',
    },
    profileContainer: {
      width: 27,
      height: 27,
      borderWidth: 2,
      borderColor: '#999',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    profileContainerFocused: {
      borderColor: '#3669c9',
    },
    profileImage: {
      width: 20,
      height: 20,
      borderRadius: 20,
    },
    profileImageUnfocused: {
      width: 27,
      height: 27,
      borderRadius: 25,
    },
  });
