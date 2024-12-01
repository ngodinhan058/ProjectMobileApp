import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../api/config";

function ShipperHomeScreen({ navigation }) {
  const [user, setUser] = useState({
    name: "Loading...",
    address: "Loading...",
    avatar: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) throw new Error("No user token found");
        
        const { token } = JSON.parse(userData);
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userInfo = response.data.data;

        setUser({
          name: `${userInfo.userLastName} ${userInfo.userFirstName}`,
          address: `${userInfo.address.addressName}, ${userInfo.address.ward}, ${userInfo.address.district}, ${userInfo.address.city}`,
          avatar: userInfo.userImagePath,
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        Alert.alert("Error", "Failed to fetch user information");
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
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
      {/* Shipment Section */}
      <ScrollView style={styles.shipments}>
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Shipment</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>
          <View style={styles.shipmentCard}>
            <Text style={styles.shipmentId}>#HWDSF776567DS</Text>
            <Text style={styles.shipmentStatus}>On the way - 00:01:00</Text>
            <Text style={styles.shipmentRoute}>
              From: Vũng Tàu - To: Hồ Chí Minh
            </Text>
          </View>
        </View>

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Shipment</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>
          <View style={styles.shipmentCard}>
          <Text style={styles.shipmentId}>#MKZ8WT8762KCS47</Text>
          <Text style={styles.shipmentStatus}>Delivered - 10:00:00</Text>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Nhận đơn</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shipmentCard}>
          <Text style={styles.shipmentId}>#HWDSF776567DS</Text>
          <Text style={styles.shipmentStatus}>Delivered - 10:00:00</Text>
          <TouchableOpacity style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Nhận đơn</Text>
          </TouchableOpacity>
        </View>

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
  
  shipmentStatus: {
    color: "#666",
    fontSize: 14,
    marginBottom: 10,
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
});

export default ShipperHomeScreen;
