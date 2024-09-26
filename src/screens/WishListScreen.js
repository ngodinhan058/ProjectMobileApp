import React from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductItem from '../components/ProductItem';

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
  { 
    id: '3', 
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, 
    name: 'TMA-2 HD Wireless', 
    price: '1.500.000', 
    rating: '4.6', 
    review: '86' 
  },
  
];
const WishListScreen = () => {

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="Search Product Name" />
            <Image source={require('../assets/iconSeach.png')} style={styles.icon} />
          </View>
          {/* Lọc */}
          <View style={styles.filter}>
            <Image source={require('../assets/filter.png')} style={styles.iconCenter} />
          </View>

      {/* Danh sách sản phẩm dạng lưới */}
      <FlatList
        data={featuredProducts}
        renderItem={({ item }) => <ProductItem {...item} />}
        keyExtractor={(item) => item.id}
        numColumns={2} // Hiển thị 2 cột
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fafafa',
  },
  searchBar: {
    position: 'relative',
    marginVertical:10,
    marginTop: 30,
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
    marginVertical:10,
    marginTop: 30,
    right: 20,
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
  listContent: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 10,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#FF3D00',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  reviews: {
    marginLeft: 5,
    fontSize: 12,
    color: '#999',
  },
});

export default WishListScreen;
