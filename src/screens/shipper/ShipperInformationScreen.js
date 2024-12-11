import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { Axios } from 'axios';
import { BASE_URL } from '../api/config';

function ShipperInformationScreen({ navigation }) {
  const [user, setUser] = useState({
    name: 'Loading...',
    phone: 'Loading...',
    avatar: '',
  });

  const handleLogout = async () => {
    try {
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn muốn đăng xuất phải không?',
        [
          {
            text: 'Huỷ',
            style: 'cancel',
          },
          {
            text: 'Đúng',
            onPress: async () => {
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('userInfo');
              Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất.');
              {
                hasPermission('PERMISSION_ADMIN') &&
                  navigation.navigate('Trang Chủ Admin');
              }
              {
                hasPermission('ROLE_USER') && navigation.navigate('Mega Mall');
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Thất bại', error);
    }
  };
  // L

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) throw new Error('No user token found');

        const { token } = JSON.parse(userData);
        const response = await Axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userInfo = response.data.data;

        setUser({
          name: `${userInfo.userLastName} ${userInfo.userFirstName}`,
          phone: userInfo.userPhone,
          avatar: userInfo.userImagePath || '',
        });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        Alert.alert('Error', 'Failed to fetch user information');
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={
            user.avatar
              ? { uri: user.avatar }
              : require('../../assets/profile.png')
          }
          style={styles.avatar}
        />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.phoneNumber}>{user.phone}</Text>
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài Khoản</Text>
        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('ProfileSettingScreen')}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../assets/profile.png')}
                style={styles.icon}
              />
            </View>
            <Text style={styles.settingText}>Thông tin </Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('ChangePasswordScreen')}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../assets/Lock.png')}
                style={styles.icon}
              />
            </View>
            <Text style={styles.settingText}>Đổi mật khẩu</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout and Deactivate Section */}
      <View style={styles.footerSection}>
        <TouchableOpacity style={styles.footerItem}>
          <Image
            source={require('../../assets/Download.png')}
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#925BFE',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  settingsList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#999',
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 20,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    color: 'red',
  },
  footerText: {
    fontSize: 16,
    color: '#FF4310',
  },
});

export default ShipperInformationScreen;
