import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Animated, Easing } from 'react-native';
import ProductItem from '../components/ProductItem';
import CategoriesItem from '../components/CategoryItem';
import SaleItem from '../components/SaleItem';
import NewItem from '../components/NewItem';
import { useNavigation } from '@react-navigation/native';
import Filter from '../components/Filter';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import  { BASE_URL }  from './api/config';


const featuredProducts = [
  {
    id: '1',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    name: 'TMA-2 HD Wireless0',
    price: '1.500.000',
    rating: '4.0',
    review: '860',
    like: true,
  },
  {
    id: '2',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp',
    name: 'TMA-2 HD Wireless2',
    price: '1.500.000',
    rating: '2.6',
    review: '6',
    like: false,
  },
  {
    id: '3',
    image: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    name: 'TMA-2 HD Wireless',
    price: '1.500.000',
    rating: '0.6',
    review: '106',
    like: true,
  },
];


const bestSellers = [
  { id: '1', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6' },
  { id: '2', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6' },
];
const saleProducts = [
  { id: '1', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, name: 'TMA-2 HD Wireless', salePrice: '1.500.000', originalPrice: '2.500.000', rating: '4.6', reviews: '86' },
  { id: '2', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, name: 'TMA-2 HD Wireless', salePrice: '1.500.000', originalPrice: '2.500.000', rating: '4.6', reviews: '86' },
];
const news = [
  { id: '1', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
  { id: '2', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },

];
const banners = [
  { id: '1', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
  { id: '2', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' }, },

];

// const categories = [
//   { id: '1', name: 'Laptop', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
//   { id: '2', name: 'Iphone', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
// ];


const HomeScreen = () => {
  {/* Loading Banner */ }
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [categories, setCategories] = useState([]); // Dữ liệu sản phẩm

  // const [minPrice, setMinPrice] = useState(0);
  // const [maxPrice, setMaxPrice] = useState(2000000);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    let apiUrl = `${BASE_URL}products/filters?search=samsung`;
    const queryParams = [];
    apiUrl += queryParams.join('&');
    console.log(apiUrl)
    axios.get(apiUrl)
      .then(response => {
        const { content } = response.data.data;
        setProductsState(content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    let apiUrl = `${BASE_URL}categories`;

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data.data;
        setCategories(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Bắt đầu hiệu ứng shimmer khi component được mount
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  {/* Search lấy dữ liệu để chuyển trang*/ }
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigation.navigate('SearchScreen', { query: searchQuery });
  };
  return (


    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3669c9']} />
    }>
      {/* Bắt đầu phần với background #fff */}
      <View style={styles.container}>
        <View style={styles.whiteSection}>
          {/* Line */}
          <View style={styles.line}></View>
          {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <TouchableOpacity onPress={() => navigation.navigate('StartSearchScreen')}>
              <Text style={styles.searchInput}>Search Product Name</Text>
              <Image
                source={require('../assets/iconSeach.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {/* Banner chính */}
          {loading ? (
            <View>
              <View style={styles.banner}>
                <Image source={banners.image} onLoad={() => setLoading(false)} />
              </View>

              <Animated.View style={[styles.skeletonText, {
                backgroundColor: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
                })
              }]} />
              <Animated.View style={[styles.skeletonTextSmall, {
                backgroundColor: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
                })
              }]} />
            </View>
          ) : (
            <>
              <FlatList
                horizontal
                data={banners}
                renderItem={({ item }) => (
                  <View style={styles.banner}>
                    <Image source={item.image} style={styles.bannerImage} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                style={styles.bannerCarousel}
              />
            </>
          )}
          {/* Danh mục sản phẩm */}
          <View style={{
          }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.textBold}>Danh Mục Sản Phẩm</Text>
              <Text style={styles.seeAll}></Text>
            </View>
          </View>
          {/* Xuất Danh mục sản phẩm */}
          {/* <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => <CategoriesItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
          /> */}
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item.categoryId.toString()}
            renderItem={({ item }) => (
              <CategoriesItem
                id={item.categoryId}
                name={item.categoryName}
                image={item.categoryImgPath}
                isLoading={false}
              />
            )}
            showsHorizontalScrollIndicator = {false}
          />
        </View>
      </View>


      {/* Sản phẩm nổi bật */}
      <View style={styles.containerPro}>
        <View style={styles.greySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Sản Phẩm Đề Xuất</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          {productsState.length > 0 ? (
            <FlatList
              horizontal
              data={productsState}
              renderItem={({ item }) => {
                // Kiểm tra xem mảng productImages có tồn tại và có ít nhất 1 phần tử

                const imageUrl = Array.isArray(item.productImages) && item.productImages.length > 0
                  ? item.productImages[0].productImagePath  // Lấy ảnh đầu tiên từ mảng
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png';  // Đường dẫn ảnh mặc định nếu không có ảnh


                return (
                  <ProductItem
                    id={item['productId']}
                    name={item['productName']}
                    price={item['productPriceSale']}
                    oldPrice={item['productPrice']}
                    image={imageUrl}  // Truyền URL của ảnh đầu tiên vào prop images
                    rating={item['productRating']}
                    sale={item['productSale']}
                    isLoading={false}  // Set isLoading to false when not loading
                  />
                );
              }}
              keyExtractor={(item) => item['productId'].toString()}
              showsHorizontalScrollIndicator={false}
              style={styles.productList}
            />
          ) : null}

          {/* Banner phụ */}
          <Image source={require('../assets/banner2.png')} style={{ width: 370, height: 180, marginBottom: 10 }} />

          {/* Best Sellers */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Đã Bán Nhiều Nhất</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          {productsState.length > 0 ? (
            <FlatList
              horizontal
              data={productsState}
              renderItem={({ item }) => {
                // Kiểm tra xem mảng productImages có tồn tại và có ít nhất 1 phần tử

                const imageUrl = Array.isArray(item.productImages) && item.productImages.length > 0
                  ? item.productImages[0].productImagePath  // Lấy ảnh đầu tiên từ mảng
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png';  // Đường dẫn ảnh mặc định nếu không có ảnh


                return (
                  <ProductItem
                    id={item['productId']}
                    name={item['productName']}
                    price={item['productPriceSale']}
                    oldPrice={item['productPrice']}
                    image={imageUrl}  // Truyền URL của ảnh đầu tiên vào prop images
                    rating={item['productRating']}
                    sale={item['productSale']}
                    isLoading={false}  // Set isLoading to false when not loading
                  />
                );
              }}
              keyExtractor={(item) => item['productId'].toString()}
              showsHorizontalScrollIndicator={false}
              style={styles.productList}
            />
          ) : null}

          {/* Banner phụ 2 */}
          <Image source={require('../assets/banner3.png')} style={{ width: 380, height: 190, marginBottom: 10 }} />

          {/* New Arrivals */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Sản Phẩm Mới</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          {productsState.length > 0 ? (
            <FlatList
              horizontal
              data={productsState}
              keyExtractor={(item) => item['productId'].toString()}
              renderItem={({ item }) => {
                // Kiểm tra xem mảng productImages có tồn tại và có ít nhất 1 phần tử

                const imageUrl = Array.isArray(item.productImages) && item.productImages.length > 0
                  ? item.productImages[0].productImagePath  // Lấy ảnh đầu tiên từ mảng
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png';  // Đường dẫn ảnh mặc định nếu không có ảnh


                return (
                  <ProductItem
                    id={item['productId']}
                    name={item['productName']}
                    price={item['productPriceSale']}
                    oldPrice={item['productPrice']}
                    image={imageUrl}  // Truyền URL của ảnh đầu tiên vào prop images
                    rating={item['productRating']}
                    sale={item['productSale']}
                    isLoading={false}  // Set isLoading to false when not loading
                  />
                );
              }}
              showsHorizontalScrollIndicator={false}
              style={styles.productList}
            />
          ) : null}
          {/* Top Rated Product */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Lượt Đánh Giá Cao Nhất</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          {productsState.length > 0 ? (
            <FlatList
              horizontal
              data={productsState}
              renderItem={({ item }) => {
                // Kiểm tra xem mảng productImages có tồn tại và có ít nhất 1 phần tử

                const imageUrl = Array.isArray(item.productImages) && item.productImages.length > 0
                  ? item.productImages[0].productImagePath  // Lấy ảnh đầu tiên từ mảng
                  : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png';  // Đường dẫn ảnh mặc định nếu không có ảnh


                return (
                  <ProductItem
                    id={item['productId']}
                    name={item['productName']}
                    price={item['productPriceSale']}
                    oldPrice={item['productPrice']}
                    image={imageUrl}  // Truyền URL của ảnh đầu tiên vào prop images
                    rating={item['productRating']}
                    sale={item['productSale']}
                    isLoading={false}  // Set isLoading to false when not loading
                  />
                );
              }}
              keyExtractor={(item) => item['productId'].toString()}
              showsHorizontalScrollIndicator={false}
              style={styles.productList}
            />
          ) : null}
          {/* Special Offers */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Giảm Giá Đặc Biệt</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          <FlatList
            horizontal
            data={saleProducts}
            renderItem={({ item }) => <SaleItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />
          {/* News */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Bản Tin Mới</Text>
          </View>
          {news.map((news) => (
            <NewItem
              key={news.id}
              title={news.title}
              description={news.description}
              date={news.date}
              image={news.image}

            />
          ))}
          <TouchableOpacity
            style={{
              padding: 15,
              marginVertical: 25,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#000',
              borderStyle: 'solid',
              alignItems: 'center',
            }} onPress={() => navigation.navigate('NewsScreen')}
          >
            <Text>Xem Tất Cả Bản Tin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  containerPro: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fafafa'
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#fafafa',
  },
  searchBar: {
    position: 'relative',
    marginTop: 30,
    marginBottom: 30,
    background: '#fff',
  },
  searchInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#FAFAFA',
    color: '#999999',
    borderRadius: 10,
    lineHeight: 50,
    paddingLeft: 10,
  },
  filter: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    right: 0,
  },
  iconCenter: {
    width: 20,
    height: 20,
    position: 'absolute',
    alignContent: 'center',
    top: 15,
  },
  icon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: '90%',
    top: 15,
  },
  whiteSection: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  greySection: {
    backgroundColor: '#fafafa',
    paddingTop: 20,
  },
  banner: {
    marginBottom: 20, l: 0
  },
  bannerImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  categories: {
    marginBottom: 20,
  },
  categoryItem: {
    backgroundColor: '#e4f3ea',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  seeAll: {
    color: '#3669c9',
    marginBottom: 10,
    fontSize: 17,
  },
  productList: {
    marginBottom: 20,
  },
  subBanner: {
    backgroundColor: '#d3ffd3',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  seeAllButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginTop: 20,
  },
  seeAllText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  skeletonText: {
    height: 20,
    width: '60%',
    borderRadius: 4,
    marginBottom: 20,
    marginLeft: '20%',
  },
  skeletonTextSmall: {
    height: 15,
    width: '40%',
    borderRadius: 4,
    marginBottom: 20,
    marginLeft: '20%',
  },
});

export default HomeScreen;
