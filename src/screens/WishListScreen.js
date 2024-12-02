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


const WishListScreen = ({ route, navigation }) => {
  // Kiểm tra nếu route.params tồn tại và lấy giá trị query, nếu không có thì để là chuỗi rỗng
  const { query = '' } = route?.params || {};
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState(query); // Lưu trữ trạng thái cho thanh tìm kiếm
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [idCart, setIdCart] = useState([]);

  const [cartDataUser, setCartDataUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [titleAlert, setTitleAlert] = useState('');
  const handleSearch = () => {
    navigation.replace('SearchScreen', { query: searchQuery });
  };
  // const filteredProducts = (cartDataUser || []).filter(product =>
  //   product?.productName.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
  };

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
  // useEffect(() => {
  //   fetchData();
  // }, [userInfo?.userId]);
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userInfo?.userId])
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
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
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
            {cartDataUser
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

});

export default WishListScreen;
