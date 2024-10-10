import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/FontAwesome';


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
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' },
    name: 'Macbook',
    price: '1.500.000',
    rating: '4.6',
    review: '86'
  },
  {
    id: '3',
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
    name: 'Wireless',
    price: '1.500.000',
    rating: '4.6',
    review: '86'
  },
  {
    id: '4',
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' },
    name: 'TMA-2 HD Wireless',
    price: '1.500.000',
    rating: '4.6',
    review: '86'
  },

];


const WishListScreen = ({ route, navigation }) => {
  // Kiểm tra nếu route.params tồn tại và lấy giá trị query, nếu không có thì để là chuỗi rỗng
  const { query = '' } = route?.params || {}; 
 const { image, name } = route.params;
  const [searchQuery, setSearchQuery] = useState(query); // Lưu trữ trạng thái cho thanh tìm kiếm
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const handleSearch = () => {
    navigation.replace('SearchScreen', { query: searchQuery });
  };
  const filteredProducts = featuredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
);
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
  };

  return (
    <View style={styles.container}>
         <View style={styles.iconHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={35} color="#000" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Danh Mục {name}</Text>
          
        </View>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Product Name"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Image
            source={require('../assets/iconSeach.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Lọc */}
        <TouchableOpacity style={styles.filter} onPress={toggleFilterModal}>
          <Image source={require('../assets/filter.png')} style={styles.iconCenter} />
        </TouchableOpacity>
      </View>

      <Filter
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Danh sách sản phẩm dạng lưới */}
      <FlatList
        data={filteredProducts}  // Sử dụng dữ liệu sản phẩm giả định
        renderItem={({ item }) => <ProductItem {...item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
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
  shareButton: {
    marginLeft: 10,
  },
  searchBar: {
    position: 'relative',
    marginVertical: 10,
    marginTop: 30,
  },
  searchInput: {
    width: '80%',
    height: 50,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    borderWidth: 5,
    borderColor: '#fafafa'
  },
  filter: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    alignItems: 'center',
    right: 0,
    borderWidth: 5,
    borderColor: '#fafafa'
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
    top: -35,
  },
  listContent: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },

});

export default WishListScreen;
