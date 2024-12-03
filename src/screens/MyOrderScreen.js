import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ScrollView, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import OrderItem from '../components/OrderItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './api/config';
import { LinearGradient } from 'expo-linear-gradient';
import { WS_URL } from './api/configWS';
import useWebSocket from './api/useWebSocket';

const MyOrderScreen = ({ route, navigation }) => {
  const layout = useWindowDimensions();
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          let userInfoData = JSON.parse(userInfoString);

          if (!userInfoData.cartId) {
            userInfoData = await createCartForUser(userInfoData);
          }

          setUserInfo(userInfoData);
          await fetchOrderDetails(userInfoData.userId);
        }
      } catch (error) {
        console.error('Error fetching user info from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);
  const flatListRef = useRef(null);

  const wsUrl = `${WS_URL}/ws`;

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) => {
        if (updatedOrder.orderId) {
          // Check if the order already exists
          const orderIndex = prevOrders.findIndex(order => order.orderId === updatedOrder.orderId);
    
          if (orderIndex !== -1) {
            // Update the existing order
            const newOrders = [...prevOrders];
            newOrders[orderIndex] = updatedOrder;
            return newOrders;
          } else {
            // Add the new order
            return [...prevOrders, updatedOrder];
          }
        } else {
          // Handle order deletion by `orderId`
          return prevOrders.filter(order => order.orderId !== updatedOrder);
        }
      });
    };


  const { client } = useWebSocket(wsUrl, handleOrderUpdate);
  const getItemLayout = (data, index) => ({
    length: 30, // Chiều cao của mỗi item (cần thay đổi theo chiều cao thực tế của item)
    offset: 150 * index, // Offset dựa trên index của item
    index,
  });

  const createCartForUser = async (userInfoData) => {
    try {
      const response = await axios.post(`${BASE_URL}cart/user/`, {
        userId: userInfoData.userId,
      });
      if (response.status === 201) {
        const { cartId } = response.data.data;
        userInfoData.cartId = cartId;
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfoData));
        return userInfoData;
      } else {
        Alert.alert('Error', 'Failed to create cart');
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      Alert.alert('Error', 'Failed to create cart');
    }
    return userInfoData;
  };
  const fetchOrderDetails = async (cartId) => {
    try {
      const response = await axios.get(`${BASE_URL}order/user/${cartId}`);
      if (response.status === 200) {
        const data = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        setOrders(data);
      } else {
        Alert.alert('Error', 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };



  const filterByStatus = (statuses) => {
    if (!orders) return [];
    if (Array.isArray(orders)) {
      return orders.filter((order) => statuses.includes(order?.orderStatus));
    }
    return statuses.includes(orders.orderStatus) ? [orders] : [];
  };


  // console.log(orders);

  const PendingConfirmationRoute = () => (
    <FlatList
      data={filterByStatus([0])}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.orderId.toString()}
      style={{ marginTop: 40 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
      }
    />
  );

  const PreparingRoute = () => (
    <FlatList
      data={filterByStatus([1])}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.orderId.toString()}
      style={{ marginTop: 40 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
      }
    />
  );
  const PreparedRoute = () => (
    <FlatList
      data={filterByStatus([2])}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.orderId.toString()}
      style={{ marginTop: 40 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
      }
    />
  );
  const ShippingRoute = () => {
    return (
      <FlatList
        data={filterByStatus([3])}
        renderItem={({ item }) => <OrderItem order={item} />}
        keyExtractor={(item) => item.orderId.toString()}
        style={{ marginTop: 40 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
        }
      />
    );
  };

  const SuccessRoute = () => (
    <FlatList
      data={filterByStatus([4])}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.orderId.toString()}
      style={{ marginTop: 40 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
      }
    />
  );
  const CompleteRoute = () => (
    <FlatList
      data={filterByStatus([5])}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.orderId.toString()}
      style={{ marginTop: 40 }}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không Có Đơn Hàng Nào.</Text>
      }
    />
  );
  
 

  // State để quản lý tab hiện tại
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Chờ Xác Nhận' },
    { key: 'preparing', title: 'Chờ Đóng Gói' },
    { key: 'prepared', title: 'Đã Đóng Gói' },
    { key: 'shipping', title: 'Đang Giao Hàng' },
    { key: 'success', title: 'Đã Giao Hàng' },
    { key: 'complete', title: 'Hoàn Tất' },

  ]);
  useEffect(() => {
    const { initialRoute } = route?.params || {};

    if (initialRoute) {
      const tabIndex = routes.findIndex(r => r.key === initialRoute);
      if (tabIndex !== -1) {
        setIndex(tabIndex);
      }
    } else {
      setIndex(0);
    }
  }, [route.params]);

  useEffect(() => {
    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.3,
      });
    }
  }, [index]);

  return (
    <View style={styles.container}>
      <View style={styles.iconHeader}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>
        <Text style={styles.textHeader}>Đơn Hàng Của Tôi</Text>

      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          pending: PendingConfirmationRoute,
          preparing: PreparingRoute,
          prepared: PreparedRoute,
          shipping: ShippingRoute,
          success: SuccessRoute,
          complete: CompleteRoute,
        })}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <FlatList
            style={{ position: 'absolute', zIndex: 99 }}
            ref={flatListRef}
            data={props.navigationState.routes}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index: tabIndex }) => (
              <TouchableOpacity onPress={() => props.jumpTo(item.key)} style={{ paddingHorizontal: 10, }}>
                <Text style={{
                  color: tabIndex === props.navigationState.index ? '#fff' : '#000', width: 'auto', height: 30, backgroundColor: tabIndex === props.navigationState.index ? '#3669c9' : '#fafafa',
                  paddingHorizontal: 20, lineHeight: 28, borderRadius: 30,
                }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.key}
            getItemLayout={getItemLayout}

          />
        )}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  line: {
    width: '95%',
    height: 1,
    backgroundColor: '#ededed',
    marginVertical: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  productList: {
    flex: 1,
    marginTop: 50,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ededed',
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,

  },
  productIcon: {
    width: 55,
    height: 55,
    marginLeft: 5,
    marginTop: 5,
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
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 30,
    fontStyle: 'italic',
  },
});

export default MyOrderScreen;
