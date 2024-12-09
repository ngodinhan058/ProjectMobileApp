import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../api/config';

function WaitingShippingScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState(3); // Default: Lấy hàng (status = 3)

  // Fetch orders based on status
  const fetchOrders = async (status) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);

      const response = await axios.get(
        `${BASE_URL}orders/status?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchOrders(currentStatus);
  }, [currentStatus]);

  // Handle order status updates
  const handleUpdateOrderStatus = async (
    orderId,
    newStatus,
    orderAddress = ''
  ) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);

      const payload = {
        status: newStatus, // Update to new status
        orderId,
      };

      await axios.put(`${BASE_URL}order/change`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert(
        'Thành công',
        newStatus === 6 ? 'Đơn hàng đã được hủy!' : 'Đơn hàng đã được cập nhật!'
      );

      setOrders(orders.filter((order) => order.orderId !== orderId));

      if (currentStatus === 4) {
        navigation.navigate('Map', { orderAddress });
      }
    } catch (error) {
      console.error('Không thể cập nhật đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật đơn hàng');
    }
  };

  console.log('Data', orders);

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
        <View style={styles.searchBox}>
          <Icon name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đơn hàng"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs for status selection */}
      <View style={styles.tabs}>
        {[
          { label: 'Lấy hàng', status: 3 },
          { label: 'Giao hàng', status: 4 },
          { label: 'Thành công', status: 5 },
          { label: 'Hủy hàng', status: 6 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.status}
            style={[
              styles.tab,
              currentStatus === tab.status && styles.activeTab,
            ]}
            onPress={() => setCurrentStatus(tab.status)}
          >
            <Text
              style={[
                styles.tabText,
                currentStatus === tab.status && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.shipments}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <View key={order.orderId} style={styles.shipmentCard}>
              <Text style={styles.shipmentId}>Mã đơn: {order.orderId}</Text>
              <Text style={styles.shipmentStatus}>
                Trạng thái:{' '}
                {currentStatus === 3
                  ? 'Lấy hàng'
                  : currentStatus === 4
                  ? 'Giao hàng'
                  : currentStatus === 5
                  ? 'Thành công'
                  : 'Hủy hàng'}
              </Text>
              <Text style={styles.shipmentRoute}>
                Địa chỉ: {order.orderAddress}
              </Text>

              {currentStatus === 4 && (
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() =>
                    handleUpdateOrderStatus(
                      order.orderId,
                      5,
                      order.orderAddress
                    )
                  }
                >
                  <Icon
                    name="map"
                    size={20}
                    color="#fff"
                    style={styles.mapIcon}
                  />
                  <Text style={styles.mapButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
              )}

              {currentStatus === 4 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() =>
                      handleUpdateOrderStatus(
                        order.orderId,
                        5,
                        order.orderAddress
                      )
                    }
                  >
                    <Text style={styles.confirmButtonText}>Xác nhận</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleUpdateOrderStatus(order.orderId, 6)}
                  >
                    <Text style={styles.cancelButtonText}>Hủy hàng</Text>
                  </TouchableOpacity>
                </View>
              ) : currentStatus !== 6 ? (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() =>
                    handleUpdateOrderStatus(order.orderId, currentStatus + 1)
                  }
                >
                  <Text style={styles.confirmButtonText}>
                    {currentStatus === 5 ? 'Hoàn tất' : 'Cập nhật'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ))
        ) : (
          <View style={styles.noOrderContainer}>
            <Text style={styles.noOrderText}>Không có đơn hàng nào</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapButton: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Vertically center the icon and text
    backgroundColor: '#3669c9', // Background color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
  },
  mapIcon: {
    marginRight: 10, // Space between icon and text
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#3669C9',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 150,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  searchIcon: {
    color: '#2490A9',
    fontSize: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#3669C9',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  shipments: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  shipmentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  shipmentId: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  shipmentStatus: {
    color: '#666',
    fontSize: 14,
    marginBottom: 10,
  },
  shipmentRoute: {
    fontSize: 12,
    color: '#333',
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#3669C9',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#D9534F', // Red color for cancel button
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  noOrderText: {
    fontSize: 18,
    color: '#888',
  },
});

export default WaitingShippingScreen;
