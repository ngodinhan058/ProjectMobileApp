import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductItem from '../components/ProductItemWish';
import Filter from '../components/Filter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';
import axios from 'axios';
import AlertComponent from '../components/AlertComponent';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const WishListScreen = ({ route }) => {
  const navigation = useNavigation();
  // Kiểm tra nếu route.params tồn tại và lấy giá trị query, nếu không có thì để là chuỗi rỗng
  const { query = '' } = route?.params || {};
  const [searchQuery, setSearchQuery] = useState(query || '');

  const [refreshing, setRefreshing] = React.useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const [idCart, setIdCart] = useState([]);

  const [cartDataUser, setCartDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [titleAlert, setTitleAlert] = useState('');



  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
  };
  const openModalLogin = () => {
    setIsLoginModalVisible(true);
  };
  const closeModalLogin = () => setIsLoginModalVisible(false);
  const [userInfo, setUserInfo] = useState(null);
  const fetchUserInfo = async () => {
    try {
      // Lấy dữ liệu từ AsyncStorage
      const userInfoString = await AsyncStorage.getItem('userInfo');

      // Nếu có dữ liệu thì parse nó thành JSON
      if (userInfoString) {
        const userInfoData = JSON.parse(userInfoString);
        setUserInfo(userInfoData); // Lưu vào state
      } else {
        openModalLogin();
      }
    } catch (error) {
      console.error('Error fetching user info from AsyncStorage:', error);
    }
  };

  const fetchData = async () => {
    // Lấy dữ liệu giỏ hàng từ API nếu userId tồn tại
    setIsLoading(true);
    const apiUrl = `${BASE_URL}carts/wishlist/user/${userInfo?.userId}`;
    try {
      const response = await axios.get(apiUrl);
      const userData = response.data.data.cartItem;
      const idCart = response.data.data.cartId;
      setIdCart(idCart)
      setCartDataUser(userData); // Lưu giỏ hàng vào state
    } catch (error) {
      // console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userInfo?.userId])
  );
  const filteredProducts = (cartDataUser || []).filter(product =>
    product?.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // console.log(cartDataUser);
  const onRefresh = React.useCallback(() => {
    fetchData();
  }, []);
  return (
    <>
      <ScrollView style={styles.container} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3669c9']} />
      }>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Product Name"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity>
            <Image
              source={require('../assets/iconSeach.png')}
              style={styles.icon}
            />
          </TouchableOpacity>

          {/* Lọc */}
          <TouchableOpacity style={styles.filter} onPress={toggleFilterModal}>
            <Image source={require('../assets/filter.png')} style={styles.iconCenter} />
          </TouchableOpacity>
        </View>

        <Filter
          isVisible={isFilterModalVisible}
          onClose={toggleFilterModal}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        {/* Danh sách sản phẩm dạng lưới */}
        {cartDataUser.length > 0 ? (
          <View style={styles.listContent}>
            {filteredProducts
              .reduce((result, _, index, array) => {
                // Nhóm các sản phẩm thành từng nhóm 2 phần tử
                if (index % 2 === 0) result.push(array.slice(index, index + 2));
                return result;
              }, [])
              .map((group, groupIndex) => (
                <View key={groupIndex} style={styles.row}>
                  {group.map((item, index) => (
                    <ProductItem
                      key={index}
                      id={item.productId}
                      name={item.productName}
                      price={item.productDiscountPrice}
                      oldPrice={item.productPrice}
                      image={item.productImage}
                      rating={item.productRating}
                      sale={item.productDiscount}
                      size={item.productSizeId}
                      sizeName={item.productSize}
                      setAlertType={setAlertType}
                      setAlertVisible={setAlertVisible}
                      setTitleAlert={setTitleAlert}
                      isLoading={false}
                      onActionComplete={() => fetchData()}
                    />
                  ))}
                </View>
              ))}
          </View>
        ) : <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginBottom: '100%', }}></View>
          <Image
            source={require('../assets/NoProduct.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: '55%',
            }}
          />
        </View>}
      </ScrollView>
      <AlertComponent
        title={alertType === 'success' ? "Success" : "Error"}
        description={
          alertType === 'success'
            ? titleAlert
            : titleAlert
        }
        alertType={alertType}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
      {/* No Login */}
      <Modal visible={isLoginModalVisible} animationType="slide"
        transparent={true}
        onRequestClose={closeModalLogin}>
        <TouchableWithoutFeedback onPress={closeModalLogin}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainerLogin}>
          <View style={styles.content}>
            <Text style={styles.title}>Đăng Nhập tài Khoản</Text>
            <View style={styles.line}></View>

            <Image source={require("../assets/hello.png")} style={{ width: 50, height: 50, marginVertical: 5 }} />
            <Text style={styles.message}>
              Chào Mừng Bạn Mới
            </Text>
            <Text style={styles.subMessage}>
              Có vẻ nhưng bạn chưa đăng nhập? Hãy đăng nhập hoặc đăng ký để có thể nhận thông báo về cái ưa đãi khủng
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Đăng Nhập')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchBar: {
    position: 'relative',
    marginVertical: 10,
    marginTop: 30,
  },
  searchInput: {
    width: '80%',
    height: 50,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 5,
    borderColor: '#fafafa'
  },
  filter: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    alignItems: 'center',
    right: 0,
    borderWidth: 5,
    borderColor: '#fafafa'
  },
  iconCenter: {
    width: 20,
    height: 20,
    position: 'absolute',
    alignContent: 'center',
    top: 10,
  },
  icon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: '70%',
    top: -35,
  },
  listContent: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  modalContainerLogin: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    height: '45%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  productImage: { width: 120, height: 120, resizeMode: 'contain', borderWidth: 1, borderColor: '#CCC', borderRadius: 15, marginRight: 20, },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 5,
  },
  subMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#3669C9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WishListScreen;


