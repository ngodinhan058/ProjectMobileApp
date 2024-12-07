import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import Filter from '../components/Filter';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import ScrollHandler from '../components/ScrollHandler';
import { BASE_URL } from './api/config';

const ProductByCateScreen = ({ route, navigation, onScroll }) => {
  // Kiểm tra nếu route.params tồn tại và lấy giá trị query, nếu không có thì để là chuỗi rỗng
  const [loading, setLoading] = useState();
  const { query = '' } = route?.params || {};
  const { id, image, name } = route.params;
  const [searchQuery, setSearchQuery] = useState(query); // Lưu trữ trạng thái cho thanh tìm kiếm
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState();

  const [refreshing, setRefreshing] = React.useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false); // Track scroll direction

  const [appliedFilters, setAppliedFilters] = useState(null);

  const renderProductItem = (item) => {

    return (
      <ProductItem
        id={item.productId}
        name={item.productName}
        price={item.productPriceSale}
        oldPrice={item.productPrice}
        image={item['productImages']?.[0].productImagePath}
        rating={item.productRating}
        sale={item.productSale}
        size={item.productSizes}
        isLoading={false}
      />
    );
  };

    // Fetch data function
    const fetchData = async () => {
      try {
        setLoading(true);
        let apiUrl = `${BASE_URL}products/filters?`;
        const queryParams = [];
  
        // Add query parameters based on the current filter state
        if (minPrice !== null && minPrice !== undefined) queryParams.push(`minPrice=${minPrice}`);
        if (maxPrice !== null && maxPrice !== undefined) queryParams.push(`maxPrice=${maxPrice}`);
        if (id !== null && id !== "") queryParams.push(`categoryId=${id}`);
        if (Array.isArray(selectedSizes) && selectedSizes.length !== 0) {
          queryParams.push(`sizeIds=${selectedSizes.join(',')}`);
        }
        if (selectedSupplier) {
          queryParams.push(`supplierIds=${selectedSupplier}`);
        }
  
        apiUrl += queryParams.join('&');
        console.log('API URL:', apiUrl);
  
        // Fetch data from API
        const response = await axios.get(apiUrl);
        const { content } = response.data.data;
        setProductsState(content);
      } catch (error) {
        console.log('Error fetching data:', error);
        setProductsState([]);  // Handle error by setting empty array or error state
      } finally {
        setLoading(false);
        setRefreshing(false); // Stop refreshing animation if used
      }
    };
  
    // Call fetchData when dependencies change
    useEffect(() => {
      fetchData();
    }, [minPrice, maxPrice, id, selectedSizes, selectedSupplier]);



  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    fetchData();
  }, []);
  const handleSearch = () => {
    navigation.replace('SearchScreen', { query: searchQuery });
  };
  const filteredSuggestions = productsState.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };
  console.log(selectedSizes);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setMinPrice(filters.priceRange[0]); // Sử dụng trực tiếp giá trị từ filters
    setMaxPrice(filters.priceRange[1]); // Sử dụng trực tiếp giá trị từ filters
    setSelectedSizes(filters.sizes);
    setSelectedSupplier(filters.supplier);

  };


  const handleResetFilters = () => {
    setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
    setMinPrice();
    setMaxPrice();
    setSelectedSizes([]);
    setSelectedSupplier();
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
        id={id}
        onClose={toggleFilterModal}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Danh sách sản phẩm dạng lưới */}
      {productsState.length > 0 ? (
        <ScrollHandler onScroll={onScroll} refreshing={refreshing} onRefresh={onRefresh}>
            <View style={styles.gridContainer}>
              {filteredSuggestions.map((item, index) => (
                <View key={index} style={styles.itemWrapper}>
                  {renderProductItem(item)}
                </View>
              ))}
            </View>
        </ScrollHandler>

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
    marginTop: 10,
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

  // columnWrapper: {
  //   justifyContent: 'space-between',
  // },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '50%',  // 2 columns layout, adjust the width as needed
    marginTop: 10,
  },
});

export default ProductByCateScreen;
