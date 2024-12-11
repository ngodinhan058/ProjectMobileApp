import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../api/config";
import { WS_URL } from '../api/configWS';
import useWebSocket from '../api/useWebSocket';


function ShipperHomeScreen({ navigation }) {
  const [user, setUser] = useState({
    id: null,
    name: "Loading...",
    address: "Loading...",
    avatar: "",
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) throw new Error("No user token found");

        const { token } = JSON.parse(userData);

        // Fetch user info
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userInfo = response.data.data;
        setUser({
          id: userInfo.userId,
          name: `${userInfo.userLastName} ${userInfo.userFirstName}`,
          address: `${userInfo.address.addressName}, ${userInfo.address.ward}, ${userInfo.address.district}, ${userInfo.address.city}`,
          avatar: userInfo.userImagePath,
        });

        // Fetch orders with status = 2
        const ordersResponse = await axios.get(
          `${BASE_URL}orders/status?status=2`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(ordersResponse.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        Alert.alert("Error", "Failed to fetch user information");
      }
    };

    fetchData();
  }, []);
  const wsUrl = `${WS_URL}/ws`;

  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prevOrders) => {
      if (updatedOrder.orderId) {
        // Check if the order already exists
        const orderIndex = prevOrders.findIndex(order => order.orderId === updatedOrder.orderId);
        if (updatedOrder.orderStatus == 3) {
          return prevOrders.filter(order => order.orderId !== updatedOrder.orderId);
        } else {
          if (orderIndex !== -1) {
            // Update the existing order
            const newOrders = [...prevOrders];
            newOrders[orderIndex] = updatedOrder;
            return newOrders;
          } else {
            return [...prevOrders, updatedOrder]
          }
        }
      } else {
        // Handle order deletion by `orderId`
        return prevOrders.filter(order => order.orderId !== updatedOrder.orderId);
      }
    });

  };
  const { client } = useWebSocket(wsUrl, handleOrderUpdate);

  const handleAcceptOrder = async (orderId) => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("No user token found");

      const { token } = JSON.parse(userData);

      const payload = {
        status: 3,
        orderId,
        shipper: user.id,
      };

      console.log("Sending payload:", payload);

      await axios.put(`${BASE_URL}order/change`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("Success", "Order accepted successfully!");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
    } catch (error) {
      console.error("Failed to accept order:", error);
      Alert.alert("Error", "Unable to accept the order");
    }
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            style={styles.avatar}
            source={
              user.avatar
                ? { uri: user.avatar }
                : require("../../assets/ship.png")
            }
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userAddress}>{user.address}</Text>
          </View>
          <View style={styles.notification}>
            <Image
              style={styles.notificationIcon}
              source={require("../../assets/bell.png")}
            />
            <Text style={styles.notificationBadge}>1</Text>
          </View>
        </View>
        <View style={styles.searchBox}>
          <Icon name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter your tracking number"
          />
        </View>
      </View>

      {/* Quick Navigation Section */}
      <View style={styles.quickNavContainer}>
        <View style={styles.quickNav}>
          <TouchableOpacity style={styles.quickNavItem}>
            <Image
              style={styles.quickNavIcon}
              source={require("../../assets/checkrate.png")}
            />
            <Text style={styles.quickNavText}>Check Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem}>
            <Image
              style={styles.quickNavIcon}
              source={require("../../assets/pickup.png")}
            />
            <Text style={styles.quickNavText}>Pick Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem}>
            <Image
              style={styles.quickNavIcon}
              source={require("../../assets/dropoff.png")}
            />
            <Text style={styles.quickNavText}>Drop Off</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavItem}>
            <Image
              style={styles.quickNavIcon}
              source={require("../../assets/history.png")}
            />
            <Text style={styles.quickNavText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.shipments}>
        {/* Đơn hàng hôm nay */}
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng hôm nay</Text>
          </View>
          {orders.length > 0 ? (
            orders.map((order) => (
              <View key={order.orderId} style={styles.shipmentCard}>
                <Text style={styles.shipmentId}>Mã đơn: {order.orderId}</Text>
                <Text style={styles.shipmentAddress}>
                  Địa chỉ: {order.orderAddress}
                </Text>
                <Text style={styles.shipmentPrice}>Giá: {order.orderTotal} VND</Text>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAcceptOrder(order.orderId)}
                >
                  <Text style={styles.acceptButtonText}>Nhận đơn</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noOrderContainer}>
              <Text style={styles.noOrderText}>Không có đơn hàng</Text>
            </View>
          )}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#3669C9",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
    height: 250,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userDetails: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  userAddress: {
    color: "#fff",
    fontSize: 14,
  },
  notification: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#fff",
  },

  notificationIcon: {
    width: 20,
    height: 20,
    tintColor: "#3669C9",
  },

  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF5E5E", // Màu đỏ của thông báo
    color: "#fff",
    width: 18, // Điều chỉnh kích thước
    height: 18,
    borderRadius: 9, // Bo tròn
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 50,
    alignItems: "center",
    elevation: 2, // Tạo bóng để nổi bật
  },
  searchIcon: {
    color: "#2490A9",
    fontSize: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
    height: 15,
  },

  quickNavContainer: {
    marginTop: -40,
    paddingHorizontal: 20,
  },
  quickNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickNavItem: {
    alignItems: "center",
  },
  quickNavIcon: {
    width: 24,
    height: 24,
  },
  quickNavText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
  },
  shipments: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewAll: {
    color: "#2490A9",
    fontSize: 14,
  },
  shipmentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  shipmentId: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },

  shipmentAddress: {
    color: "#666",
    fontSize: 14,
    marginBottom: 10,
  },
  shipmentPrice: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noOrderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // Đảm bảo chiều cao để căn giữa
  },
  noOrderText: {
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
  },

  acceptButton: {
    marginTop: 10,
    backgroundColor: "#3669C9",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  acceptButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  shipmentRoute: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
  },
  progressBar: {
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginTop: 10,
  },
  progress: {
    width: "50%",
    height: "100%",
    backgroundColor: "#3669C9",
    borderRadius: 3,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

});

export default ShipperHomeScreen;
