import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { Card, Divider } from 'react-native-elements';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AlertComponent from '../../../components/AlertComponent';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const HomeAdminScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [productsState, setProductsState] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const { alertVisible, alertType, title } = route.params || {}; // Nhận params từ navigation
  const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);

  // useEffect(() => {
  //     if (alertVisible) {
  //         // Tự động ẩn thông báo sau 2 giây
  //         const timer = setTimeout(() => {
  //             setIsAlertVisible(false);
  //         }, 2000);

  //         return () => clearTimeout(timer);
  //     }
  // }, [alertVisible]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}products`);
      setProductsState(response.data.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const ProductItem = ({ item }) => {
    const scale = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    // const navigateToDetail = () => {
    //     navigation.replace('DetailScreen', { id: item.productId });
    // };

    // const handlePress = () => {
    //     scale.value = withTiming(0.95, { duration: 100 });
    //     navigateToDetail();
    //     setTimeout(() => {
    //         scale.value = withTiming(1, { duration: 100 });
    //     }, 100);
    // };

    return (
      <AnimatedTouchableOpacity
        style={[styles.productItem, animatedStyles]}
        onPress={() =>
          navigation.navigate('DetailScreen', { id: item.productId })
        }
      >
        <Card containerStyle={styles.cardContainer}>
          <Card.Image
            source={{ uri: item.productImages[0].productImagePath }}
            style={styles.productImage}
            PlaceholderContent={
              <ActivityIndicator size="large" color="#2196F3" />
            }
          />
          <Card.Title style={styles.productTitle}>
            {item.productName}
          </Card.Title>
          <Divider />
          <View style={styles.productDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Giá:</Text>
              <Text style={styles.productPrice}>{item.productPrice}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Số lượng:</Text>
              <Text style={styles.productQuantity}>{item.productQuantity}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              navigation.navigate('DetailScreen', { id: item.productId })
            }
          >
            <Text style={styles.detailButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </Card>
      </AnimatedTouchableOpacity>
    );
  };

  const renderProduct = ({ item }) => {
    return <ProductItem item={item} />;
  };

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
              navigation.navigate('Người Dùng');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Thất bại', error);
    }
  };
  const handleRefresh = () => {
    fetchProducts();
  };
  // useEffect(() => {
  //     if (isAlertVisible && alertType === 'success') {
  //         fetchProducts();
  //     }
  // }, [isAlertVisible, alertType]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{
              uri: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474119Xok/hinh-anh-cho-cute-chibi-dep-nhat_100649530.png',
            }}
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>Hi Admin!</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <FlatList
        data={productsState}
        renderItem={renderProduct}
        keyExtractor={(item) => item.productId.toString()}
        style={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.emptyText}>Không có sản phẩm nào.</Text>
          )
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProductScreen')}
      >
        <LinearGradient
          colors={['#4CAF50', '#388E3C']}
          style={styles.addButtonGradient}
        >
          <Icon name="add-circle" size={40} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
      {/* {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            )} */}
      {isAlertVisible && (
        <AlertComponent
          title={alertType === 'success' ? 'Success' : 'Error'}
          description={
            alertType === 'success' ? title : 'Failed to add product.'
          }
          alertType={alertType}
          visible={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  cardContainer: {
    borderRadius: 15,
    padding: 12,
    margin: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  productImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    color: '#333',
  },
  productDetails: {
    flexDirection: 'column',
    padding: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginLeft: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  detailButton: {
    marginTop: 15,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  detailButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
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
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 30,
    fontStyle: 'italic',
  },
  productItem: {
    marginBottom: 20,
  },
  productList: {
    paddingHorizontal: 10,
  },
});

export default HomeAdminScreen;
