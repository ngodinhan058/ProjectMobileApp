import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Switch,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../api/config';

function WaitingShippingScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState(3);
  const [productStatus, setProductStatus] = useState({});
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const cancelReasons = ['Khách hàng không nhận', 'Giao hàng thất bại', 'Khác'];
  const [expandedOrders, setExpandedOrders] = useState([]);

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

      const fetchedOrders = response.data.data;

      if (!Array.isArray(fetchedOrders)) {
        throw new Error('Invalid data format from API');
      }

      // Initialize productStatus
      const initialProductStatus = {};
      fetchedOrders.forEach((order) => {
        if (Array.isArray(order.items)) {
          order.items.forEach((item) => {
            if (Array.isArray(item.cartItem)) {
              item.cartItem.forEach((product) => {
                initialProductStatus[
                  `${order.orderId}-${product.productId}`
                ] = false;
              });
            }
          });
        }
      });

      setProductStatus(initialProductStatus);
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error.message);
      Alert.alert('Error', 'Failed to fetch orders');
    }
  };
  const areAllProductsToggled = (order) => {
    return order.items.every((item) =>
      item.cartItem.every(
        (product) =>
          productStatus[`${order.orderId}-${product.productId}`] === true
      )
    );
  };
  const handleToggleProduct = (orderId, productId) => {
    setProductStatus((prevStatus) => ({
      ...prevStatus,
      [`${orderId}-${productId}`]: !prevStatus[`${orderId}-${productId}`],
    }));
  };
  const handleCancelOrder = async () => {
    if (selectedReason === 'Khác' && !customReason.trim()) {
      Alert.alert('Lỗi', "Vui lòng nhập lý do khi chọn 'Khác'");
      return;
    }

    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);

      const payload = {
        status: 8,
        orderId: selectedOrderId,
        shipper: '',
        reason: selectedReason === 'Khác' ? customReason : selectedReason,
      };

      await axios.put(`${BASE_URL}order/change`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Thành công', 'Đơn hàng đã được hủy!');
      setOrders(orders.filter((order) => order.orderId !== selectedOrderId));
      setCancelModalVisible(false); // Đóng Modal sau khi hủy
    } catch (error) {
      console.error('Không thể hủy đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể hủy đơn hàng');
    }
  };

  useEffect(() => {
    fetchOrders(currentStatus);
  }, [currentStatus]);

  // Handle order status updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
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
        newStatus === 8 ? 'Đơn hàng đã được hủy!' : 'Đơn hàng đã được cập nhật!'
      );

      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error('Không thể cập nhật đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật đơn hàng');
    }
  };
  //thu gon
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prevExpandedOrders) =>
      prevExpandedOrders.includes(orderId)
        ? prevExpandedOrders.filter((id) => id !== orderId) // Thu gọn nếu đã mở
        : [...prevExpandedOrders, orderId] // Mở rộng nếu chưa mở
    );
  };
  

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
      </View>

      {/* Tabs for status selection */}
      <View style={styles.tabs}>
        {[
          { label: 'Lấy hàng', status: 3 },
          { label: 'Giao hàng', status: 4 },
          { label: 'Thành công', status: 5 },
          { label: 'Trả hàng', status: 8 },
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
              <Text style={styles.shipmentId}>Mã đơn: {order.orderId.substring(0, 8)}</Text>
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
              <Text style={styles.shipmentPrice}>
                  Giá: {new Intl.NumberFormat('vi-VN').format(order.orderPayment === 0 ? 0 : order.orderTotal)}đ
              </Text>
              <Text style={styles.pay}>
                  {order.orderPayment === 0 ? "Đã thanh toán" : "Chưa thanh toán"}
              </Text>
              <TouchableOpacity onPress={() => toggleOrderExpansion(order.orderId)}>
                <Text style={styles.toggleText}>
                  {expandedOrders.includes(order.orderId) ? 'Thu gọn' : 'Xem chi tiết'}
                </Text>
              </TouchableOpacity>
            {/* Chỉ hiển thị sản phẩm nếu đơn hàng đang mở rộng và trạng thái là 3 */}
              {expandedOrders.includes(order.orderId) && currentStatus === 3 && (
                <View>
                  {order.items.map((item, itemIndex) =>
                    item.cartItem.map((product, productIndex) => (
                      <View
                        key={`${order.orderId}-${itemIndex}-${productIndex}`}
                        style={styles.productRow}
                      >
                        <Image
                          source={{ uri: product.productImage }}
                          style={styles.productImage}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.productName}>
                            {product.productName}
                          </Text>
                          <Switch
                            value={
                              productStatus[
                                `${order.orderId}-${product.productId}`
                              ]
                            }
                            onValueChange={() =>
                              handleToggleProduct(
                                order.orderId,
                                product.productId
                              )
                            }
                            thumbColor={
                              productStatus[
                                `${order.orderId}-${product.productId}`
                              ]
                                ? '#4CAF50'
                                : '#D9534F'
                            }
                            trackColor={{ false: '#D3D3D3', true: '#90EE90' }}
                          />
                        </View>
                      </View>
                    ))
                  )}

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      !areAllProductsToggled(order) && styles.disabledButton,
                    ]}
                    disabled={!areAllProductsToggled(order)}
                    onPress={() =>
                      Alert.alert(
                        'Xác nhận',
                        'Bạn có muốn cập nhật trạng thái đơn hàng không?',
                        [
                          {
                            text: 'Hủy',
                            style: 'cancel',
                          },
                          {
                            text: 'Xác nhận',
                            onPress: () =>
                              handleUpdateOrderStatus(order.orderId, 4),
                          },
                        ]
                      )
                    }
                  >
                    <Text style={styles.confirmButtonText}>Cập nhật</Text>
                  </TouchableOpacity>
                </View>
              )}

              {currentStatus === 4 && (
                <View>
                  {/* Hiển thị chi tiết chỉ khi mở rộng */}
                  {expandedOrders.includes(order.orderId) && (
                    <>
                      {order.items.map((item, itemIndex) =>
                        item.cartItem.map((product, productIndex) => (
                          <View
                            key={`${order.orderId}-${itemIndex}-${productIndex}`}
                            style={styles.productRow}
                          >
                            <Image
                              source={{ uri: product.productImage }}
                              style={styles.productImage}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.productName}>{product.productName}</Text>
                              <Text style={styles.productDetails}>
                                Kích thước: {product.productSize}
                              </Text>
                              <Text style={styles.productDetails}>
                                Số lượng: {product.productQuantity}
                              </Text>
                            </View>
                          </View>
                        ))
                      )}

                      <TouchableOpacity
                        style={styles.mapButton}
                        onPress={() =>
                          handleUpdateOrderStatus(order.orderId, 5, order.orderAddress)
                        }
                      >
                        <Icon name="map" size={20} color="#fff" style={styles.mapIcon} />
                        <Text style={styles.mapButtonText}>Chỉ đường</Text>
                      </TouchableOpacity>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                          style={styles.confirmButton}
                          onPress={() =>
                            Alert.alert(
                              'Xác nhận',
                              'Bạn có muốn xác nhận đơn hàng này không?',
                              [
                                { text: 'Hủy', style: 'cancel' },
                                {
                                  text: 'Xác nhận',
                                  onPress: () => handleUpdateOrderStatus(order.orderId, 5),
                                },
                              ]
                            )
                          }
                        >
                          <Text style={styles.confirmButtonText}>Xác nhận</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={() => {
                            setSelectedOrderId(order.orderId);
                            setCancelModalVisible(true);
                          }}
                        >
                          <Text style={styles.cancelButtonText}>Hủy hàng</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}

              {currentStatus === 5 && (
                <View>
                  {expandedOrders.includes(order.orderId) &&
                    order.items.map((item, itemIndex) =>
                      item.cartItem.map((product, productIndex) => (
                        <View
                          key={`${order.orderId}-${itemIndex}-${productIndex}`}
                          style={styles.productRow}
                        >
                          <Image
                            source={{ uri: product.productImage }}
                            style={styles.productImage}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.productName}>{product.productName}</Text>
                            <Text style={styles.productDetails}>
                              Kích thước: {product.productSize}
                            </Text>
                            <Text style={styles.productDetails}>
                              Số lượng: {product.productQuantity}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                </View>
              )}

              {currentStatus === 8 && (
                <View>
                  {expandedOrders.includes(order.orderId) &&
                    order.items.map((item, itemIndex) =>
                      item.cartItem.map((product, productIndex) => (
                        <View
                          key={`${order.orderId}-${itemIndex}-${productIndex}`}
                          style={styles.productRow}
                        >
                          <Image
                            source={{ uri: product.productImage }}
                            style={styles.productImage}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.productName}>{product.productName}</Text>
                            <Text style={styles.productDetails}>
                              Kích thước: {product.productSize}
                            </Text>
                            <Text style={styles.productDetails}>
                              Số lượng: {product.productQuantity}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                </View>
              )}

            </View>
          ))
        ) : (
          <View style={styles.noOrderContainer}>
            <Text style={styles.noOrderText}>Không có đơn hàng nào</Text>
          </View>
        )}
      </ScrollView>
      {/* Cancel Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCancelModalVisible(false)} // Đóng Modal khi nhấn nút quay lại
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lý do hủy đơn hàng</Text>
            {cancelReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonButton}
                onPress={() => setSelectedReason(reason)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    selectedReason === reason && styles.selectedReasonText,
                  ]}
                >
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
            {selectedReason === 'Khác' && (
              <TextInput
                style={styles.reasonInput}
                placeholder="Nhập lý do khác"
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  if (!selectedReason) {
                    Alert.alert('Lỗi', 'Vui lòng chọn lý do hủy');
                    return;
                  }
                  handleCancelOrder(); // Gọi API hủy đơn hàng
                }}
              >
                <Text style={styles.confirmButtonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCancelModalVisible(false)} // Đóng Modal
              >
                <Text style={styles.cancelButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    height: 100,
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
  shipmentPrice: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#D9534F',
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
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#4CAF50', // Xanh lá khi bật
  },
  toggleButtonInactive: {
    backgroundColor: '#D9534F', // Đỏ khi tắt
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc', // Màu xám khi không thể nhấn
  },
  productImage: {
    width: 60, // Độ rộng của hình ảnh
    height: 60, // Chiều cao của hình ảnh
    borderRadius: 8, // Bo góc cho hình ảnh
    marginRight: 10, // Khoảng cách giữa hình ảnh và nội dung bên cạnh
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Nền mờ
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reasonButton: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 10,
  },
  reasonText: {
    fontSize: 16,
  },
  selectedReasonText: {
    fontWeight: 'bold',
    color: '#3669C9',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  pay: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  toggleText: {
    color: '#3669C9',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  
});

export default WaitingShippingScreen;
