import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';

const Header = () => {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) throw new Error('No user token found');

        const { token, role } = JSON.parse(userData);
        setUserData(role)
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.log('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const hasRole = (role) => Object.keys(userData).length !== 0 ? userData?.includes(role) : null
  const navigation = useNavigation();
  return (
    <View style={ hasRole("ROLE_ADMIN") ? styles.headerContainerAdmin : styles.headerContainer}>
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.logo}>Mega Mall</Text>
      </TouchableOpacity>

      {/* Icon thông báo và giỏ hàng */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Yêu Thích')}>
          <Image source={require('../assets/heart.png')} style={{
            width: 28,
            height: 28,
            marginLeft: 20,
          }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddToCartScreen')}>
          <Image source={require('../assets/cart.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChatBotScreen')}>
          <Image source={require('../assets/cart.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingTop: 50,

  },
  headerContainerAdmin: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3669c9',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
});

export default Header;
