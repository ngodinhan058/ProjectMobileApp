import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import CategoriesItem from '../components/CategoryItem';
import SaleItem from '../components/SaleItem';
import NewItem from '../components/NewItem';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from './api/config';
import ScrollHandler from '../components/ScrollHandler';

const saleProducts = [
  {
    id: '1',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
    name: 'TMA-2 HD Wireless',
    salePrice: '1.500.000',
    originalPrice: '2.500.000',
    rating: '4.6',
    reviews: '86',
  },
  {
    id: '2',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
    name: 'TMA-2 HD Wireless',
    salePrice: '1.500.000',
    originalPrice: '2.500.000',
    rating: '4.6',
    reviews: '86',
  },
];
const news = [
  {
    id: '1',
    title: 'Philosophy That Addresses Topics Such As Goodness',
    description: 'Agar tetap kinclong, bodi motor ten...',
    date: '13 Jan 2021',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
  },
  {
    id: '2',
    title: 'Philosophy That Addresses Topics Such As Goodness',
    description: 'Agar tetap kinclong, bodi motor ten...',
    date: '13 Jan 2021',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
  },
];
const banners = [
  {
    id: '1',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
  },
  {
    id: '2',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp',
    },
  },
];

const HomeScreen = ({ onScroll }) => {
  {
    /* Loading Banner */
  }
  const [loading, setLoading] = useState(true);
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [categories, setCategories] = useState([]); // Dữ liệu sản phẩm

  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = async () => {
    try {
      const productsApiUrl = `${BASE_URL}products/filters?`;
      const categoriesApiUrl = `${BASE_URL}categories`;

      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(productsApiUrl),
        axios.get(categoriesApiUrl),
      ]);

      const productsData = productsResponse.data.data.content;
      const categoriesData = categoriesResponse.data.data;
      setProductsState(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    fetchData();
  }, []);

  return (
    <ScrollHandler
      onScroll={onScroll}
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {/* Bắt đầu phần với background #fff */}
      <View style={styles.container}>
        <View style={styles.whiteSection}>
          {/* Line */}
          <View style={styles.line}></View>
          {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <TouchableOpacity
              onPress={() => navigation.navigate('StartSearchScreen')}
            >
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
                <Image source={banners.image} />
              </View>

              <Animated.View
                style={[
                  styles.skeletonText,
                  {
                    backgroundColor: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
                    }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.skeletonTextSmall,
                  {
                    backgroundColor: shimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['#e0e0e0', '#f0f0f0'], // Dark to light gray
                    }),
                  },
                ]}
              />
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
          <View style={{}}>
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
            <TouchableOpacity
              style={{
                borderRadius: 10,
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('SeeAllProductScreen')}
            >
              <Text style={styles.seeAll}>Xem Tất Cả</Text>
            </TouchableOpacity>
          </View>

          {/* {productsState.length > 0 ? (
            <FlatList
              data={productsState}
              renderItem={({ item }) => {
                return (
                  <ProductItem
                    id={item['productId']}
                    name={item['productName']}
                    price={item['productPriceSale']}
                    oldPrice={item['productPrice']}
                    image={item['productImages']?.[0].productImagePath} // Truyền URL của ảnh đầu tiên vào prop images
                    rating={item['productRating']}
                    sale={item['productSale']}
                    isLoading={loading} // Set isLoading to false when not loading
                  />
                );
              }}
              keyExtractor={(item) => item['productId'].toString()}
              showsHorizontalScrollIndicator={false}
              style={styles.productList}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
            />
          ) : null} */}

          {productsState.length > 0 ? (
            <View style={styles.gridContainer}>
              {productsState.map((item, index) => (
                <View key={index} style={styles.itemWrapper}>
                  <ProductItem
                    id={item['productId']}
                    name={item['productName']}
                    price={item['productPriceSale']}
                    oldPrice={item['productPrice']}
                    image={item['productImages']?.[0].productImagePath} 
                    rating={item['productRating']}
                    sale={item['productSale']}
                    isLoading={loading} 
                  />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </ScrollHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '50%',  // 2 columns layout, adjust the width as needed
    marginTop: 10,
  },
  containerPro: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fafafa',
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
    marginBottom: 20,
    l: 0,
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
  listContent: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
