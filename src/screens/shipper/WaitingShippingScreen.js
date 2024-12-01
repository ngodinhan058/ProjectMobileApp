import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";

function WaitingShippingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đang chờ giao</Text>
        <View style={styles.searchBox}>
          <Icon name="search" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm đơn hàng"
          />
        </View>
      </View>

      {/* Tabs Section */}

      {/* Shipment List */}
      <ScrollView style={styles.shipments}>
        <View style={styles.shipmentCard}>
          <Text style={styles.shipmentId}>#HWDSF776567DS</Text>
          <Text style={styles.shipmentStatus}>Đang giao - 28 Aug, 4:39 PM</Text>
          <Text style={styles.shipmentRoute}>
            Địa chỉ: 87, South Lester Street, London Close Belgium
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("DetailWaitingShippingItemScreen")
            }
          >
            <Text style={styles.detailsButtonText}>Chi tiết</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shipmentCard}>
          <Text style={styles.shipmentId}>#MKZ8WT8762KCS47</Text>
          <Text style={styles.shipmentStatus}>Đang chờ xác nhận</Text>
          <Text style={styles.shipmentRoute}>
            Địa chỉ: 45, Central Park, New York City
          </Text>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate("DetailWaitingShippingItemScreen")
            }
          >
            <Text style={styles.detailsButtonText}>Chi tiết</Text>
          </TouchableOpacity>
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
    height: 150,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  searchIcon: {
    color: "#2490A9",
    fontSize: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20,
    marginTop: -20,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
  activeTab: {
    backgroundColor: "#3669C9",
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  shipments: {
    marginTop: 20,
    paddingHorizontal: 20,
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
  shipmentRoute: {
    fontSize: 12,
    color: "#333",
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: "#3669C9",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default WaitingShippingScreen;
