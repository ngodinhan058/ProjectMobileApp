import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';

const MyOrderScreen = ({ navigation }) => {
  const layout = useWindowDimensions();  // Lấy thông tin kích thước màn hình

  // Dữ liệu sản phẩm (users) với các vai trò khác nhau
  const products = [
    {
      id: '1', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '123@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'An', first_name: 'Ngô Định', money: '200', rank: require('../assets/diamond.png'), number_id: '079203000000',
      id_image_front: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.2-1024x0.jpg' },
      id_image_back: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.3-1024x0.jpg' }, role: 'customer',
    },
    {
      id: '2', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '456@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'A', first_name: 'Nguyễn Văn', money: '200', rank: require('../assets/silver.png'), number_id: '079203000000',
      id_image_front: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.2-1024x0.jpg' },
      id_image_back: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.3-1024x0.jpg' }, role: 'customer',
    },
    {
      id: '3', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '789@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'B', first_name: 'Phạm Thị', money: '200', rank: require('../assets/bronze.png'), number_id: '079203000000',
      id_image_front: require('../assets/silver.png'),
      id_image_back: require('../assets/silver.png'), role: 'customer',
    },
    {
      id: '4', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '789@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'Sếp', first_name: 'Phạm Thị', money: '200', rank: require('../assets/bronze.png'), number_id: '079203000000',
      id_image_front: require('../assets/silver.png'),
      id_image_back: require('../assets/silver.png'), role: 'staff',
    },
    {
      id: '5', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '789@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'Shipper', first_name: 'Phạm Thị', money: '200', rank: require('../assets/bronze.png'), number_id: '079203000000',
      id_image_front: require('../assets/silver.png'),
      id_image_back: require('../assets/silver.png'), role: 'shipper',
    },
    {
      id: '6', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '789@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'Shipper 1', first_name: 'Phạm Thị', money: '200', rank: require('../assets/bronze.png'), number_id: '079203000000',
      id_image_front: require('../assets/silver.png'),
      id_image_back: require('../assets/silver.png'), role: 'shipper',
    },
    {
      id: '7', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '123@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'An', first_name: 'Ngô Định', money: '200', rank: require('../assets/diamond.png'), number_id: '079203000000',
      id_image_front: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.2-1024x0.jpg' },
      id_image_back: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.3-1024x0.jpg' }, role: 'customer',
    },
    {
      id: '8', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '456@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'A', first_name: 'Nguyễn Văn', money: '200', rank: require('../assets/silver.png'), number_id: '079203000000',
      id_image_front: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.2-1024x0.jpg' },
      id_image_back: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.3-1024x0.jpg' }, role: 'customer',
    },
    {
      id: '9', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '789@gmail.com', phone: '0923039880',
      birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'B', first_name: 'Phạm Thị', money: '200', rank: require('../assets/bronze.png'), number_id: '079203000000',
      id_image_front: require('../assets/silver.png'),
      id_image_back: require('../assets/silver.png'), role: 'customer',
    },

  ];


  const flatListRef = useRef(null);

  // Lọc danh sách người dùng theo role
  const filterByRole = (role) => {
    return products.filter((item) => item.role === role);
  };

  // Render từng sản phẩm (người dùng)
  const renderProduct = ({ item }) => (

    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('DetailUserScreen', {
        image: item.image,
        email: item.email,
        first_name: item.first_name,
        last_name: item.last_name,
        id_image_front: item.id_image_front,
        id_image_back: item.id_image_back,
        pass: item.pass,
        birthday: item.birthday,
        address: item.address,
        phone: item.phone,
        money: item.money,
        role: item.role,
        rank: item.rank,
        number_id: item.number_id,
      })}
    >
      <View style={{ marginRight: 20 }}>
        <Image source={item.image} style={styles.productIcon} />
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productCode}>{item.first_name}&#160;{item.last_name}</Text>
        <Image source={item.rank} style={styles.rankIcon} />
        <Text style={styles.productStatus}>Email: {item.email}</Text>
        <View style={styles.line}></View>
        <Text style={styles.productCode}>Ví Tiền: {item.money} ₫</Text>
      </View>
      <Pressable>
        <Icon name="angle-right" size={25} color="#000" />
      </Pressable>
    </TouchableOpacity>
  );

  // Các Scene tương ứng với mỗi tab (mỗi role)
  const CustomerRoute = () => (
    <FlatList
      data={filterByRole('customer')}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      style={styles.productList}
    />
  );

  const StaffRoute = () => (
    <FlatList
      data={filterByRole('staff')}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      style={styles.productList}
    />
  );

  const ShipperRoute = () => (
    <FlatList
      data={filterByRole('shipper')}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      style={styles.productList}
    />
  );

  // State để quản lý tab hiện tại
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'customer', title: 'Customer' },
    { key: 'staff', title: 'Staff' },
    { key: 'shipper', title: 'Shipper' },
    { key: 'staff1', title: 'Staff' },
    { key: 'shipper2', title: 'Shipper' },
    { key: 'staff3', title: 'Staff' },
    { key: 'shipper4', title: 'Shipper' },

  ]);

  useEffect(() => {
    // Cuộn đến tab được chọn
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5, // Đặt tab ở giữa màn hình
      });
    }
  }, [index]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi Admin!</Text>
          <Text style={styles.subtitleText}>Welcome back to your panel.</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Image source={require('../assets/right_from_bracket.png')} style={{ width: 30, height: 30, marginLeft: 115 }} />
        </TouchableOpacity>
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          customer: CustomerRoute,
          staff: StaffRoute,
          shipper: ShipperRoute,
          staff1: StaffRoute,
          shipper2: ShipperRoute,
          staff3: StaffRoute,
          shipper4: ShipperRoute,
        })}
        onIndexChange={setIndex}
        initialLayout={{ width: 300 }} // Thay đổi theo layout của bạn
        renderTabBar={(props) => (
          <FlatList
            ref={flatListRef}
            data={props.navigationState.routes}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index: tabIndex }) => (
              <TouchableOpacity onPress={() => props.jumpTo(item.key)} style={{ paddingHorizontal: 20 }}>
                <Text style={{ color: tabIndex === props.navigationState.index ? '#3669c9' : '#000' }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.key}
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
    marginTop: 20,
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
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3669c9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 40,
    color: '#fff',
  },
});

export default MyOrderScreen;
