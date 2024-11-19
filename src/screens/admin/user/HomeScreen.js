import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import { BASE_URL } from '../../api/config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const HomeAdminScreen = ({ navigation }) => {
  const layout = useWindowDimensions(); // Lấy thông tin kích thước màn hình
  const [usersState, setUsersState] = useState([]); // Danh sách người dùng
  const [user, setUser] = useState({}); // Thông tin người dùng hiện tại
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('userData');

        if (savedCart) {
          const { username, token } = JSON.parse(savedCart);
          setUser({ username, token });
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };

    loadUser();
  }, []);
  const fetchData = async () => {
    if (!user.token) {
      // Đợi token sẵn sàng trước khi fetch
      console.warn('Token is not available yet');
      return;
    }

    const apiUrl = `${BASE_URL}auth/users`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Gửi token trong headers
        },
      });

      const data = response.data.data; // Đảm bảo đường dẫn đúng
      setUsersState(data);
    } catch (error) {
      console.error(
        'Error fetching data:',
        error.response ? error.response.data : error.message
      );
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]);
  const handleRefresh = () => {
    fetchData();
  };

  // Dữ liệu sản phẩm (users) với các vai trò khác nhau


  // Lọc danh sách người dùng theo role
  const filterByRole = (role) => {
    return usersState.filter((item) => item.roles?.roleName === role);
  };

  // Render từng sản phẩm (người dùng)
  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() =>
        navigation.navigate('DetailUserScreen', {
          id: item['userId'],
          // image: { uri: item['userImagePath'] },
          // email: item['userEmail'],
          // first_name: item['user_first_name'],
          // last_name: item['user_last_name'],
          // id_image_front: {
          //   uri: 'https://cdn.tgdd.vn/Files/2021/04/18/1344478/cach-lam-can-cuoc-cong-dan-cccd-online_800x450.jpg',
          // },
          // id_image_back: { uri: item.iCard.imageBackPath },
          // pass: item.pass,
          // birthday: item['userBirthday'],
          // address: item['userAddress'],
          // phone: item['userPhone'],
          // money: item['userMoney'],
          // role: item.role,
          // rank: item.rank,
          // number_id: item.iCard.idCardNumber,
        })
      }
    >
      <View style={{ marginRight: 20 }}>
        <Image
          source={{ uri: item['userImagePath'] }}
          style={styles.productIcon}
        />
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.productCode}>
          {item['userFirstName']}&#160;{item['userLastName']}
        </Text>
        {/* <Image source={} style={styles.rankIcon} /> */}
        <Text style={styles.productStatus}>Email: {item['userEmail']}</Text>
        <View style={styles.line}></View>
        <Text style={styles.productCode}>Ví Tiền: {item['userMoney']}</Text>
      </View>

      <Pressable>
        <Icon name="arrow-forward-circle-outline" size={25} color="#000" />
      </Pressable>
    </TouchableOpacity>
  );

  // Các Scene tương ứng với mỗi tab (mỗi role)
  const CustomerRoute = () => (
    <FlatList
      data={filterByRole('USER')}
      renderItem={renderProduct}
      keyExtractor={(item) => item.userId}
      style={styles.productList}
    />
  );

  const StaffRoute = () => (
    <FlatList
      data={filterByRole('ADMIN')}
      renderItem={renderProduct}
      keyExtractor={(item) => item.userId}
      style={styles.productList}
    />
  );

  const ShipperRoute = () => (
    <FlatList
      data={filterByRole('SHIPPER')}
      renderItem={renderProduct}
      keyExtractor={(item) => item.userId}
      style={styles.productList}
    />
  );

  // State để quản lý tab hiện tại
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'ADMIN', title: 'Customer' },
    { key: 'USER', title: 'Staff' },
    { key: 'SHIPPER', title: 'Shipper' },
  ]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      Alert.alert('Thành công', 'Đăng xuất thành công!');
      navigation.navigate('Danh Sách Người Dùng'); // Điều hướng sau khi đăng nhập
    } catch (error) {
      Alert.alert('Thất bại', error);
    }
  };

  return (
    <View style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }>
      <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{ uri: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474119Xok/hinh-anh-cho-cute-chibi-dep-nhat_100649530.png' }}
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>Hi Admin!</Text>
        </View>
        <TouchableOpacity>
          <Icon name="log-out-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          USER: CustomerRoute,
          ADMIN: StaffRoute,
          SHIPPER: ShipperRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#3669c9' }}
            style={{ backgroundColor: 'white' }}
            labelStyle={{ color: '#000' }}
          />
        )}
      />
      {/* <FlatList
        data={usersState}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      /> */}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddUserScreen')}
      >
        <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.addButtonGradient}>
          <Icon name="add-circle" size={40} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 15,
    borderRadius: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  productList: {
    flex: 1,
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ededed',
    borderWidth: 2,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  productIcon: {
    width: 55,
    height: 55,
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 55,
  },
  rankIcon: {
    position: 'absolute',
    width: 25,
    height: 25,
    right: 0,
  },
  productDetails: {
    flex: 1,
  },
  productCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productStatus: {
    fontSize: 14,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeAdminScreen;
