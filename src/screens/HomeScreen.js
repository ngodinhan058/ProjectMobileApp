import React from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import CategoriesItem from '../components/CategoryItem';
import SaleItem from '../components/SaleItem';
import NewItem from '../components/NewItem';

// const featuredProducts = [
//   { id: '1', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless0', price: '1.500.000', rating: '4.6', review: '86' },
//   { id: '2', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6', review: '86' },
//   { id: '3', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6', review: '86' },
// ];
const featuredProducts = [
  { 
    id: '1', 
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, 
    name: 'TMA-2 HD Wireless0', 
    price: '1.500.000', 
    rating: '4.6', 
    review: '86' 
  },
  { 
    id: '2', 
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, 
    name: 'TMA-2 HD Wireless', 
    price: '1.500.000', 
    rating: '4.6', 
    review: '86' 
  },
  { 
    id: '3', 
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, 
    name: 'TMA-2 HD Wireless', 
    price: '1.500.000', 
    rating: '4.6', 
    review: '86' 
  },
];


const bestSellers = [
  { id: '1', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6' },
  { id: '2', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6' },
];
const saleProducts = [
  { id: '1', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', salePrice: '1.500.000', originalPrice: '2.500.000', rating: '4.6', reviews: '86' },
  { id: '2', image: require('../assets/headphone.png'), name: 'TMA-2 HD Wireless', salePrice: '1.500.000', originalPrice: '2.500.000', rating: '4.6', reviews: '86' },
];
const news = [
  { id: '1', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: require('../assets/new1.png') },
  { id: '2', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: require('../assets/new2.png') },

];

const banners = [
  { id: '1', image: require('../assets/banner.png') },
  { id: '2', image: require('../assets/banner.png') },
];

const categories = [
  { id: '1', name: 'Laptop', image: require('../assets/btn_1.png') },
  { id: '2', name: 'Iphone', image: require('../assets/btn_2.png') },
];


const HomeScreen = () => {
  return (
    <ScrollView>
      {/* Bắt đầu phần với background #fff */}
      <View style={styles.container}>
        <View style={styles.whiteSection}>
          {/* Line */}
          <View style={styles.line}></View>
          {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="Search Product Name" />
            <Image source={require('../assets/iconSeach.png')} style={styles.icon} />
          </View>
          {/* Lọc */}
          <View style={styles.filter}>
            <Image source={require('../assets/filter.png')} style={styles.iconCenter} />
          </View>
          {/* Banner chính (Có thể vuốt ngang) */}
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

          {/* Danh mục sản phẩm */}
          <View style={{

          }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.textBold}>Danh Mục</Text>
              <Text style={styles.seeAll}>Xem Tất Cả</Text>
            </View>
          </View>
          {/* Xuất Danh mục sản phẩm */}
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => <CategoriesItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
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
          <FlatList
            horizontal
            data={featuredProducts}
            renderItem={({ item }) => <ProductItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />

          {/* Banner phụ */}
          <Image source={require('../assets/banner2.png')} style={{ width: 370, height: 180, marginBottom: 10 }} />

          {/* Best Sellers */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Đã Bán Nhiều Nhất</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          <FlatList
            horizontal
            data={bestSellers}
            renderItem={({ item }) => <ProductItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />

          {/* Banner phụ 2 */}
          <Image source={require('../assets/banner3.png')} style={{ width: 380, height: 190, marginBottom: 10 }} />

          {/* New Arrivals */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Sản Phẩm Mới</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          <FlatList
            horizontal
            data={bestSellers}
            renderItem={({ item }) => <ProductItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />
          {/* Top Rated Product */}
          <View style={styles.sectionHeader}>
            <Text style={styles.textBold}>Lượt Đánh Giá Cao Nhất</Text>
            <Text style={styles.seeAll}>Xem Tất Cả</Text>
          </View>
          <FlatList
            horizontal
            data={bestSellers}
            renderItem={({ item }) => <ProductItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />
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
            }}
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
    width: '80%',
    height: 50,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
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
});

export default HomeScreen;
