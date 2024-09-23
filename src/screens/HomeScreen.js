import React from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList } from 'react-native';
import ProductItem from '../components/ProductItem';
import CategoriesItem from '../components/CategoryItem';

const featuredProducts = [
  { id: '1', image: require('../../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6', review: '86' },
  { id: '2', image: require('../../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6', review: '86' },
  { id: '3', image: require('../../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6', review: '86' },
];

const bestSellers = [
  { id: '1', image: require('../../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6' },
  { id: '2', image: require('../../assets/headphone.png'), name: 'TMA-2 HD Wireless', price: '1.500.000', rating: '4.6' },
];

const banners = [
  { id: '1', image: require('../../assets/banner.png') },
  { id: '2', image: require('../../assets/banner.png') },
];
const categories = [
  { id: '1', name: 'Laptop', image: require('../../assets/btn_1.png') },
  { id: '2', name: 'Iphone', image: require('../../assets/btn_2.png') },
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
            <Image source={require('../../assets/iconSeach.png')} style={styles.icon} />
          </View>
          {/* Lọc */}
          <View style={styles.filter}>
            <Image source={require('../../assets/filter.png')} style={styles.iconCenter} />
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
              <Text style={styles.textBold}>Categories</Text>
              <Text style={styles.seeAll}>See All</Text>
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
            <Text style={styles.textBold}>Featured Product</Text>
            <Text style={styles.seeAll}>See All</Text>
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
          <View style={styles.subBanner}>
            <Text>CO2 - Cable Multifunction</Text>
          </View>

          {/* Best Sellers */}
          <View style={styles.sectionHeader}>
            <Text>Best Sellers</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          <FlatList
            horizontal
            data={bestSellers}
            renderItem={({ item }) => <ProductItem {...item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.productList}
          />
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
    fontSize: 16,
  },
  seeAll: {
    color: '#3669c9',
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
});

export default HomeScreen;
