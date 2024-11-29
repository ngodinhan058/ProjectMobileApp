import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const RejectOrderConfirmationScreen = ({ route, navigation }) => {
  const { orderDetails } = route.params;

  const renderOrderItem = (item, index) => (
      <View style={styles.itemRow} key={index}>
        <Image style={styles.itemImage} source={{ uri: item.productImage }} />
        <View style={styles.itemDetails}>
          <Text style={styles.boldText}>{item.productName}</Text>
          <Text style={styles.detailText}>Màu: {item.productSize}</Text>
          <Text style={styles.detailText}>Số Lượng: {item.productQuantity}</Text>
          <Text style={styles.detailText}>Giảm Giá Voucher: {item.productDiscountPrice || 0}</Text>
          <Text style={styles.detailText}>Tổng Cộng: {item.productTotalPrice} ₫</Text>
        </View>
      </View>
  );

  return (
      <LinearGradient colors={['#a8dadc', '#f1faee']} style={styles.container}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Icon name="xmark" size={40} color="#FF0000" />
              </View>
              <View>
                <Text style={styles.headerText}>Xin Cảm Ơn</Text>
                <Text
                    style={[
                      styles.subHeaderText,
                      { backgroundColor: '#a8dadc', color: '#1d3557', padding: 5, borderRadius: 5 },
                    ]}
                >
                   Đơn Của Bạn Là #{orderDetails.orderId.substring(0, 8)}
                </Text>
              </View>
            </View>
            <Text style={styles.infoText}>
              Đơn hàng của bạn đã được hủy thành công!!!. Chúc bạn 1 ngày tốt lành
            </Text>
            <Text style={styles.boldText}>Thời Gian Đặt Hàng: {orderDetails.orderDate}</Text>
            <Text style={styles.sectionHeader}>Biên Lai</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.boldText}>{orderDetails.userName}</Text>
              <Text style={styles.label}>{orderDetails.userEmail}</Text>
              <Text style={styles.label}>{orderDetails.userPhone}</Text>
              <Text style={[styles.label, styles.addressText]}>{orderDetails.orderAddress}</Text>
            </View>
            <Text style={styles.sectionHeader}>Sản Phẩm Đã Đặt</Text>
            {orderDetails.items.length > 0 ? (
                orderDetails.items[0].cartItem.map((item, index) => renderOrderItem(item, index))
            ) : (
                <Text style={styles.label}>No items in the cart.</Text>
            )}
            <Text style={styles.sectionHeader}>Tóm tắt đơn hàng</Text>
            <View style={[styles.summaryRow, styles.summaryTopBorder]}>
              <Text style={styles.label}>Tổng Cộng:</Text>
              <Text style={styles.label}>{orderDetails.orderTotal} ₫</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    marginBottom: 20,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: '#a8dadc',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 24,
    color: '#1d3557',
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#457b9d',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1d3557',
    lineHeight: 24,
    marginBottom: 20,
  },
  boldText: {
    fontSize: 18,
    color: '#1d3557',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    color: '#457b9d',
    marginTop: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#f1faee',
    borderRadius: 10,
    marginTop: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    color: '#457b9d',
    marginVertical: 5,
    fontSize: 16,
  },
  addressText: {
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1faee',
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  detailText: {
    color: '#1d3557',
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  summaryTopBorder: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
});

export default RejectOrderConfirmationScreen;
