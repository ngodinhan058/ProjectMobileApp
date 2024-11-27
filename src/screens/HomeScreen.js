import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Animated, useWindowDimensions, ImageBackground } from 'react-native';
import ProductItem from '../components/ProductItem';
import CategoriesItem from '../components/CategoryItem';
import SaleItem from '../components/SaleItem';
import NewItem from '../components/NewItem';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from './api/config';
import { WS_URL } from './api/configWS';
import ScrollHandler from '../components/ScrollHandler';
import Filter from '../components/FilterFull';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useWebSocket from './api/useWebSocket';



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
  { id: '3', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
  { id: '4', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' }, },
];

const HomeScreen = () => {
  {/* Loading Banner */ }
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [categories, setCategories] = useState([]); // Dữ liệu sản phẩm

  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();
  const [selectedCategories, setSelectedCategories] = useState();

  const [appliedFilters, setAppliedFilters] = useState(null);

  const [refreshing, setRefreshing] = React.useState(false);
  const wsUrl = `${WS_URL}/ws`;

  const handleProductUpdate = (updatedProduct) => {
    setProductsState(prevProducts => {

      if (updatedProduct.productId) {
        const productIndex = prevProducts.findIndex(p => p.productId === updatedProduct.productId);
        if (productIndex !== -1) {

          const newProducts = [...prevProducts];
          newProducts[productIndex] = updatedProduct;
          return newProducts;
        } else {

          return [...prevProducts, updatedProduct];
        }
      } else {
        return prevProducts.filter(p => p.productId !== updatedProduct);
      }
    });
  };

  const { client } = useWebSocket(wsUrl, handleProductUpdate);

  const fetchData = async () => {
    try {
      const productsApiUrl = `${BASE_URL}products/filters?`;
      const categoriesApiUrl = `${BASE_URL}categories`;

      const queryParams = new URLSearchParams();

      // Add query parameters based on the current filter state
      if (minPrice !== null && minPrice !== undefined) queryParams.append('minPrice', minPrice);
      if (maxPrice !== null && maxPrice !== undefined) queryParams.append('maxPrice', maxPrice);
      if (selectedCategories && selectedCategories.length > 0) {
        queryParams.append('categoryId', selectedCategories);
      }
      if (Array.isArray(selectedSizes) && selectedSizes.length > 0) {
        queryParams.append('sizeIds', selectedSizes.join(','));
      }
      if (Array.isArray(selectedSupplier) && selectedSupplier.length > 0) {
        queryParams.append('supplierIds', selectedSupplier.join(','));
      }
      const finalProductsApiUrl = productsApiUrl + queryParams.toString();
      // console.log('Products API URL:', finalProductsApiUrl);

      // Fetch products and categories in parallel
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(finalProductsApiUrl),
        axios.get(categoriesApiUrl),
      ]);

      // Extract data
      const productsData = productsResponse.data?.data?.content || [];
      const categoriesData = categoriesResponse.data?.data || [];

      // Update state
      setProductsState(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Optional: Notify the user about the error
    } finally {
      setTimeout(() => setLoading(false), 1000); // Simulate loading delay
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [minPrice, maxPrice, selectedSizes, selectedSupplier, selectedCategories]);

  // Filters
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };
  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setMinPrice(filters.priceRange[0]);
    setMaxPrice(filters.priceRange[1]);
    setSelectedSizes(filters.sizes);
    setSelectedSupplier(filters.supplier);
    setSelectedCategories(filters.categories)
  };
  //Kết thúc

  const handleResetFilters = () => {
    setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
    setMinPrice();
    setMaxPrice();
    setSelectedSizes([]);
    setSelectedSupplier();
  };



  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    fetchData();
  }, []);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const { width: windowWidth } = useWindowDimensions();
  const intervalRef = useRef(null);

  useEffect(() => {
    let currentIndex = 0;

    intervalRef.current = setInterval(() => {
      if (scrollViewRef.current) {
        currentIndex = (currentIndex + 1) % banners.length; // Sử dụng banners.length
        scrollViewRef.current.scrollTo({
          x: currentIndex * windowWidth,
          animated: true,
        });
      }
    }, 3000); // Thời gian auto-scroll mỗi 3 giây

    return () => {
      clearInterval(intervalRef.current); // Xóa interval khi component bị unmount
    };
  }, [windowWidth, banners.length]); // Thêm banners.length vào dependency array
  const renderSearchBar = () => (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate('SearchScreen')}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#F8F9FA', '#FFFFFF']}
        style={styles.searchGradient}
      >
        <Ionicons name="search-outline" size={22} color="#666" />
        <Text style={styles.searchPlaceholder}>Tìm kiếm sản phẩm...</Text>
        <View style={styles.searchDivider} />
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
          <FontAwesome5 name="sliders-h" size={18} color="#3669C9" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
  return (
    <ScrollHandler refreshing={refreshing} onRefresh={onRefresh}>
      {/* Bắt đầu phần với background #fff */}
      <View style={styles.container}>
        <View style={styles.whiteSection}>
          {/* Line */}
          <View style={styles.line}></View>
          {/* Thanh tìm kiếm */}

          {/* <View style={styles.searchBar}>
              <TouchableOpacity onPress={() => navigation.navigate('StartSearchScreen')}>
                <Text style={styles.searchInput}>Search Product Name</Text>
                <Image
                  source={require('../assets/iconSeach.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.filter} onPress={toggleFilterModal}>
                <Image source={require('../assets/filter.png')} style={styles.iconCenter} />
              </TouchableOpacity>
            </View> */}
          {renderSearchBar()}

          <Filter
            isVisible={isFilterModalVisible}
            // id={id}
            onClose={toggleFilterModal}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          {/* Banner chính */}
          {loading ? (
            <View>
              <Animated.View style={[styles.skeletonText, {
                backgroundColor: shimmerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
                })
              }]} />

            </View>

          ) : (
            <>
              <View style={styles.scrollContainer}>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: {
                          contentOffset: {
                            x: scrollX,
                          },
                        },
                      },
                    ],
                    { useNativeDriver: false },
                  )}
                  scrollEventThrottle={1}>
                  {banners.map((banner, imageIndex) => (
                    <View
                      style={{ width: windowWidth, height: 200 }}
                      key={banner.id}>
                      <ImageBackground
                        source={banner.image}
                        style={styles.card}>
                      </ImageBackground>
                    </View>
                  ))}
                </ScrollView>

                {/* Indicator */}
                <View style={styles.indicatorContainer}>
                  {banners.map((banner, imageIndex) => {
                    const width = scrollX.interpolate({
                      inputRange: [
                        windowWidth * (imageIndex - 1),
                        windowWidth * imageIndex,
                        windowWidth * (imageIndex + 1),
                      ],
                      outputRange: [8, 16, 8], // Dot lớn ở trang hiện tại
                      extrapolate: 'clamp',
                    });
                    return (
                      <Animated.View
                        key={banner.id}
                        style={[styles.normalDot, { width }]}
                      />
                    );
                  })}
                </View>
              </View>

            </>
          )}
          {/* Danh mục sản phẩm */}
          <View style={{ paddingHorizontal: 20, }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.textBold}>Danh Mục Sản Phẩm</Text>
              <Text style={styles.seeAll}></Text>
            </View>
          </View>
          {/* Xuất Danh mục sản phẩm */}
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item.categoryId.toString()}
            renderItem={({ item }) => (
              <CategoriesItem
                id={item['categoryId']}
                name={item['categoryName']}
                image={item['categoryImgPath']}
                isLoading={loading}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>


      {/* Sản phẩm nổi bật */}
      <View style={styles.containerPro}>
        <View style={styles.greySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Tất cả sản phẩm</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          {productsState.length > 0 ? (
            // <View style={styles.gridContainer}>
            //   {productsState.map((item, index) => (
            //     <View key={index} style={styles.itemWrapper}>
            //       <ProductItem
            //         id={item['productId']}
            //         name={item['productName']}
            //         price={item['productPriceSale']}
            //         oldPrice={item['productPrice']}
            //         image={item['productImages']?.[0].productImagePath}
            //         rating={item['productRating']}
            //         sale={item['productSale']}
            //         isLoading={loading}
            //       />
            //     </View>
            //   ))}
            // </View>
            <View style={styles.listContent}>
              {productsState
                .reduce((result, _, index, array) => {
                  // Nhóm các sản phẩm thành từng nhóm 2 phần tử
                  if (index % 2 === 0) result.push(array.slice(index, index + 2));
                  return result;
                }, [])
                .map((group, groupIndex) => (
                  <View key={groupIndex} style={styles.row}>
                    {group.map((item) => (
                      <ProductItem
                        key={item.productId}
                        id={item.productId}
                        name={item.productName}
                        price={item.productPriceSale}
                        oldPrice={item.productPrice}
                        image={item.productImages?.[0]?.productImagePath}
                        rating={item.productRating}
                        sale={item.productSale}
                        isLoading={false}
                      />
                    ))}
                  </View>
                ))}
            </View>
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
          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
      </View>
    </ScrollHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 16,
  },

  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: 'silver',
    marginHorizontal: 4,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: 16,
    marginVertical: 20,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  decelerationRate: 0.98,
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999',
    marginLeft: 12,
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EEE',
    marginHorizontal: 12,
  },
  filterButton: {
    padding: 8,
  },
  iconCenter: {
    width: 20,
    height: 20,
    position: 'absolute',
    alignContent: 'center',
    top: 10,
  },
  icon: {
    width: 20,
    height: 20,
    position: 'absolute',
    left: '70%',
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
    height: 200,
    width: '100%',
    marginBottom: 20,

  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

});

export default HomeScreen;