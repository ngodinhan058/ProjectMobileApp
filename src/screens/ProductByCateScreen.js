import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from './api/config';


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


const ProductByCateScreen = ({ route, navigation }) => {
  // Kiểm tra nếu route.params tồn tại và lấy giá trị query, nếu không có thì để là chuỗi rỗng
  const [loading, setLoading] = useState(true);
  const { query = '' } = route?.params || {};
  const { id, image, name } = route.params;
  const [searchQuery, setSearchQuery] = useState(query); // Lưu trữ trạng thái cho thanh tìm kiếm
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [categoryId, setCategoryId] = useState([]);

  const [appliedFilters, setAppliedFilters] = useState(null);


  useEffect(() => {

    let apiUrl = `${BASE_URL}products/filters?`;
    const queryParams = [];
    if (minPrice !== null && minPrice !== undefined) queryParams.push(`minPrice=${minPrice}`);
    if (maxPrice !== null && maxPrice !== undefined) queryParams.push(`maxPrice=${maxPrice}`);
    if (id !== null && id !== "") queryParams.push(`categoryId=${id}`);

    apiUrl += queryParams.join('&');
    console.log(apiUrl)
    axios.get(apiUrl)
      .then(response => {
        const { content } = response.data.data;
        setProductsState(content);
        setLoading(false);
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        setProductsState([]);
        setLoading(false);
      });
  }, [minPrice, maxPrice, id]);

  const handleSearch = () => {
    navigation.replace('SearchScreen', { query: searchQuery });
  };
  const filteredSuggestions = productsState.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setMinPrice(filters.priceRange[0]); // Sử dụng trực tiếp giá trị từ filters
    setMaxPrice(filters.priceRange[1]); // Sử dụng trực tiếp giá trị từ filters
    setCategoryId(filters.categories)
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
      {productsState.length > 0 ? (
        <FlatList
          data={filteredSuggestions}
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
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
        />

      ) :
        <View style={{ position: 'relative' }}>
          <View style={{ marginBottom: '70%' }} ></View>
          <Image source={require('../assets/NoProduct.png')} style={{ position: 'absolute', width: '100%', height: '75%', top: 100 }} />
        </View>}
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

export default ProductByCateScreen;
