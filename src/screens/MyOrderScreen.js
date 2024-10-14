import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import OrderItem from '../components/OrderItem';

const MyOrderScreen = ({ route, navigation }) => {
  const layout = useWindowDimensions();  // Lấy thông tin kích thước màn hình

  
  
  const orders = [
    {
      id: 'order1',
      date: '01/10/2024',
      status: 'Chờ Xác Nhận',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },
    {
      id: 'order7',
      date: '01/10/2024',
      status: 'Chờ Xác Nhận',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },
    {
      id: 'order2',
      date: '01/10/2024',
      status: 'Chuẩn Bị Hàng',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },
    {
      id: 'order3',
      date: '01/10/2024',
      status: 'Đang Giao Hàng',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },
    {
      id: 'order4',
      date: '01/10/2024',
      status: 'Đã Giao Hàng',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },
    {
      id: 'order5',
      date: '01/10/2024',
      status: 'Đã Huỷ',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },
    {
      id: 'order6',
      date: '01/10/2024',
      status: 'Trả Hàng',
      products: [
        {
          id: '1',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 1',
          color: 'Đen',
          quantity: 1,
          price: '1.500.000',
        },
        {
          id: '2',
          image: {
            uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
          },
          name: 'Tai Nghe Sieu Ngau 2',
          color: 'Trắng',
          quantity: 1,
          price: '1.500.000',
        },
      ],
      total: '3.000.000',
    },

    // Thêm các đơn hàng với status khác
  ];
  const flatListRef = useRef(null);
  // Lọc danh sách người dùng theo status
  const filterByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };
  const getItemLayout = (data, index) => ({
    length: 20, // Chiều cao của mỗi item (cần thay đổi theo chiều cao thực tế của item)
    offset: 200 * index, // Offset dựa trên index của item
    index, 
  });
  
  const handleScrollToIndexFailed = (info) => {
    const wait = new Promise(resolve => setTimeout(resolve, 500));
    wait.then(() => {
      flatListRef.current?.scrollToIndex({ index: info.highestMeasuredFrameIndex, animated: true });
    });
  };
  
  

  const PendingConfirmationRoute = () => (
    <FlatList
      data={filterByStatus('Chờ Xác Nhận')}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id}
      style={{ marginTop: 40 }}
    />
  );

  const PreparingRoute = () => (
    <FlatList
      data={filterByStatus('Chuẩn Bị Hàng')}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id}
      style={{ marginTop: 40 }}
    />
  ); 

  const ShippingRoute = () => (
    <FlatList
      data={filterByStatus('Đang Giao Hàng')}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id}
       style={{ marginTop: 40 }}
    />
  );
  const SuccessRoute = () => (
    <FlatList
      data={filterByStatus('Đã Giao Hàng')}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id}
       style={{ marginTop: 40 }}
    />
  );
  const cancelRoute = () => (
    <FlatList
      data={filterByStatus('Đã Huỷ')}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id}
       style={{ marginTop: 40 }}
    />
  );
  const returnRoute = () => (
    <FlatList
      data={filterByStatus('Trả Hàng')}
      renderItem={({ item }) => <OrderItem order={item} />}
      keyExtractor={(item) => item.id}
       style={{ marginTop: 40 }}
    />
  );

  // State để quản lý tab hiện tại
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'pending', title: 'Chờ Xác Nhận' },
    { key: 'preparing', title: 'Chờ Lấy Hàng' },
    { key: 'shipping', title: 'Chờ Giao Hàng' },
    { key: 'success', title: 'Đã Giao Hàng' },
    { key: 'cancel', title: 'Đã Huỷ' },
    { key: 'return', title: 'Trả Hàng' },

  ]);
  useEffect(() => {
    const {initialRoute} = route.params;
    if (initialRoute !== null) {
      const tabIndex = routes.findIndex(r => r.key === initialRoute);
      console.log("test",initialRoute);
      if (tabIndex !== -1) {
        setIndex(tabIndex);
      }
    }
  }, [route.params]);
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
       <View style={styles.iconHeader}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={35} color="#000" />
                </Pressable>
                <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>

            </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          pending: PendingConfirmationRoute,
          preparing: PreparingRoute,
          shipping: ShippingRoute,
          success: SuccessRoute,
          cancel: cancelRoute,
          return: returnRoute,
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
            getItemLayout={getItemLayout} // Cung cấp getItemLayout
            onScrollToIndexFailed={handleScrollToIndexFailed} // Xử lý khi scroll thất bại
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

});

export default MyOrderScreen;
