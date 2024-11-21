import React, { useEffect, useState } from 'react';
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
import { CommonActions } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('userData');

        if (savedCart) {
          const { username, token } = JSON.parse(savedCart);
          setUser({ username, token });
        }
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
      }
    };

    loadUser();
  }, []);

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
    <ScrollView style={styles.container}>
      <View style={styles.iconHeader}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>
        <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <IconI name="log-out-outline" size={25} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.whiteSection}>
        {/* Header thông tin cá nhân */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doi-mu.jpg?1704788682389',
              }} // URL hình ảnh đại diện
            />
            <View>
              <Text style={styles.name}>{user.username}</Text>
              <Text style={styles.email}>{user.username}</Text>
              <Text style={styles.balance}>0đ</Text>
            </View>
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => navigation.navigate('BioDataScreen')}
            >
              <Icon name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Đơn hàng của tôi */}
        <View style={styles.orderSection}>
          <Text style={styles.sectionTitle}>Đơn Hàng Của Tôi</Text>

          <View style={styles.line}></View>
          <View style={styles.orderOptionContainer}>
            <TouchableOpacity
              style={styles.orderOption}
              onPress={() =>
                navigation.navigate('MyOrderScreen', { initialRoute: '' })
              }
            >
              <Image
                source={require('../assets/pay.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderOption}
              onPress={() =>
                navigation.navigate('MyOrderScreen', {
                  initialRoute: 'preparing',
                })
              }
            >
              <Image
                source={require('../assets/ship.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Ship</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderOption}
              onPress={() =>
                navigation.navigate('MyOrderScreen', {
                  initialRoute: 'shipping',
                })
              }
            >
              <Image
                source={require('../assets/box_pro.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Đang giao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderOption}
              onPress={() => navigation.navigate('')}
            >
              <Image
                source={require('../assets/review.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Đánh Giá</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orderOption}
              onPress={() => navigation.navigate('')}
            >
              <Image
                source={require('../assets/undo.png')}
                style={styles.icon}
              />
              <Text style={styles.text}>Trả Hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  whiteSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderTopRightRadius: 10,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
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
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 30,
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
    height: 1,
    backgroundColor: '#EDEDED',
    marginHorizontal: 10,
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
  orderOption: {
    alignItems: 'center',
    flex: 1,
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
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#E91E63',
    marginBottom: 5,
  },
  productReviews: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#d9534f', // Change to your desired color
  },
});

export default ProfileScreen;
