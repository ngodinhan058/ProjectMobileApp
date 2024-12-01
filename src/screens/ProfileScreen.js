import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import ProductItem from '../components/ProductItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation, route }) => {
  const [user, setUserInfo] = useState(null);

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

  const isFocused = useIsFocused();

  useFocusEffect(() => {
    fetchUserInfo();
  });
  console.log('user', user);

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
              navigation.navigate('Mega Mall');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Thất bại', error);
    }
  };
  // Logout function

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.iconHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="angle-left" size={35} color="#000" />
          </Pressable>
          <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>
        </View>

        {/* Header thông tin cá nhân */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              style={styles.avatar}
              source={{
                uri: user?.userImagePath
                  ? user?.userImagePath
                  : 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doi-mu.jpg?1704788682389',
              }} // URL hình ảnh đại diện
            />
            <View>
              <Text style={styles.name}>
                {user?.userFirstName} {user?.userLastName}
              </Text>
              <Text style={styles.email}>{user?.userEmail}</Text>
              <Text style={styles.balance}>0đ</Text>
            </View>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() =>
                navigation.navigate('BioDataScreen', { userData: user })
              }
            >
              <Icon name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.line}></View> */}
        <View style={styles.containerRow}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.row}>
              <IconI name="settings-outline" size={22} color="#000" />
              <Text style={styles.textPro}>Settings</Text>
            </View>
            <Icon name="angle-right" size={32} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('MyOrderScreen')}
          >
            <View style={styles.row}>
              <IconI name="clipboard-outline" size={22} color="#000" />
              <Text style={styles.textPro}>Đơn Hàng Của Tôi</Text>
            </View>
            <Icon name="angle-right" size={32} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('CreateAddressScreen')}
          >
            <View style={styles.row}>
              <IconI name="location-outline" size={22} color="#000" />
              <Text style={styles.textPro}>Địa Chỉ</Text>
            </View>
            <Icon name="angle-right" size={32} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <View style={styles.row}>
              <IconI name="lock-closed-outline" size={22} color="#000" />
              <Text style={styles.textPro}>Thay Đổi Mật Khẩu</Text>
            </View>
            <Icon name="angle-right" size={32} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.containerRow}>
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('ChatScreen', {
                email: user?.userEmail,
                userFirstName: user?.userFirstName,
                userLastName: user?.userLastName,
              })
            }
          >
            <View style={styles.row}>
              <IconI name="chatbox-ellipses-outline" size={22} color="#000" />
              <Text style={styles.textPro}>Hỗ Trợ</Text>
            </View>
            <Icon name="angle-right" size={32} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={styles.row}>
              <IconI name="log-out-outline" size={22} color="#000" />
              <Text style={styles.textPro}>Đăng Xuất</Text>
            </View>
            <Icon name="angle-right" size={32} color="#000" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* <View style={{ position: 'relative' }}>
        <TouchableOpacity
          style={{
            position: 'absolute', // Để nút nằm ngoài luồng bình thường
            bottom: 15,// Vị trí so với cạnh trên
            right: 20,
            backgroundColor: '#3669c9',
            width: 60, // Định rõ kích thước hình ảnh
            height: 60,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          }}
          onPress={() => navigation.navigate('ChatScreen', {
            email: user?.userEmail,
            userFirstName: user?.userFirstName,
            userLastName: user?.userLastName,
          })}
        >
          <Ionicons name="chatbox-ellipses-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View> */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  textPro: {
    fontWeight: '500',
    marginLeft: 25,
    fontSize: 17,
  },

  containerRow: {
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 15,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 8,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
    marginLeft: 10,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    backgroundColor: '#3669c9',
    padding: 20,
    margin: 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#fff',
  },
  balance: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: 'auto',
    backgroundColor: '#1565C0',
    padding: 8,
    borderRadius: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#EDEDED',
    marginVertical: 20,
  },
  suggestionsSection: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  orderOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  icon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },

  productList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  logoutButton: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#d9534f', // Change to your desired color
  },
});

export default ProfileScreen;
