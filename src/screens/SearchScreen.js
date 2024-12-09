import React, { useState, useEffect,useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import Filter from '../components/FilterSearch';
import axios from 'axios';
import { BASE_URL } from './api/config';
import { SEARCH_KEY } from '../constants/SearchKey';
import { loadData, saveData } from '../utils/SearchMemory';

const SearchScreen = ({ navigation, route }) => {
  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  const { query = '' } = route?.params || {};

  const finalQuery = query || '';

  const timeoutRef = React.useRef(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isFilterModalVisibleMemory, setIsFilterModalVisibleMemory] =
    useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [searchQuery, setSearchQuery] = useState(finalQuery); // Lưu trữ trạng thái cho thanh tìm kiếm

  const [sort, setSort] = useState(''); // Kích thước trang (số sản phẩm mỗi trang)
  const [direction, setDirection] = useState(''); // Kích thước trang (số sản phẩm mỗi trang)
  const [loading, setLoading] = useState(true); // Thêm biến loading nếu thiếu
  // const [categoryId, setCategoryId] = useState([]);

  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [toggleItem, setToggleItem] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const savedData = await loadData(SEARCH_KEY); // Tải dữ liệu từ AsyncStorage
        if (savedData) {
          setRecentSearches(JSON.parse(savedData)); // Parse chuỗi JSON để lấy mảng
        } else {
          setRecentSearches([]); // Đặt giá trị mặc định nếu không có dữ liệu
        }
      } catch (error) {
        console.log('Error loading recent searches:', error);
      }
    };
  
    initializeData(); // Gọi hàm khởi tạo
  }, []);

  const handleMemory = async () => {
    if (!searchQuery || searchQuery.length === 0 || recentSearches.includes(searchQuery)) {
      return; // Không làm gì nếu từ khóa đã tồn tại hoặc chuỗi trống
    }
  
    const updatedSearches = [...recentSearches, searchQuery];
    try {
      await saveData(SEARCH_KEY, JSON.stringify(updatedSearches)); // Lưu vào AsyncStorage
      setRecentSearches(updatedSearches); // Cập nhật state
    } catch (error) {
      console.log('Error saving recent searches:', error);
    }
  };

  const handleSearch = () => {
    handleMemory(); // Lưu từ khóa mới vào bộ nhớ
    setToggleItem(true); // Hiển thị giao diện tìm kiếm
  };

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  // const fetchData = async (url) => {
  //   setLoading(true);
  //   try {
  //     const productsResponse = await axios.get(url);

  //     const productsData = productsResponse.data.data.content;

  //     setSuggestion(productsData);
  //   } catch (error) {
  //     console.log('Error fetching data:', error);
  //   } finally {
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 1000);
  //   }

  //   setLoading(false);
  // };
  const fetchData = async (url) => {
    setLoading(true);
    try {
      const productsResponse = await axios.get(url);
      const productsData = productsResponse.data.data.content;
      setSuggestion(productsData); // Cập nhật gợi ý
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false); // Dừng trạng thái loading
    }
  };

  useEffect(() => {
    setLoading(true);
    if (searchQuery && searchQuery.length < 2) {
      setSuggestion([]); // Clear suggestions if the query is less than 2 characters
      setLoading(false);
      return; // Do not proceed if the search query is too short
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear previous timeout
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      if (searchQuery.length >= 2) {
        const productsApiUrl = `${BASE_URL}products/filters?search=${searchQuery}`;
        fetchData(productsApiUrl); // Fetch data based on the query
      } else {
        setSuggestion([]); // Clear suggestions if search query is empty or too short
      }
    }, 0); // Wait for 3 seconds before fetching
    setLoading(false);

    return () => {
      clearTimeout(timeoutRef.current); // Cleanup timeout on unmount
    };
  }, [searchQuery]);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setMinPrice(filters.priceRange[0]); // Sử dụng trực tiếp giá trị từ filters
    setMaxPrice(filters.priceRange[1]); // Sử dụng trực tiếp giá trị từ filters
    if (filters.sort) {
      const [direction, sort] = filters.sort.split('|'); // Tách thành 2 phần: direction và sort
      setDirection(direction); // Cập nhật direction
      setSort(sort); // Cập nhật sort
    } else {
      // Trường hợp không có giá trị sort (hoặc null), có thể đặt giá trị mặc định nếu cần
      setDirection(null);
      setSort(null);
    }
  };

  const handleResetFilters = () => {
    setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
    setMinPrice();
    setMaxPrice();
    setDirection(null);
      setSort(null);
  };

  const recentSearchesShow = isFilterModalVisibleMemory
    ? recentSearches // Hiển thị tất cả nếu mở rộng
    : recentSearches.slice(0, 2); // Chỉ hiển thị 2 mục đầu tiên

  const toggleExpand = () => {
    setIsFilterModalVisibleMemory(!isFilterModalVisibleMemory);
  };

  const handleRecentSearchClick = async (item) => {
    setSearchQuery(item);
    setToggleItem(true);
      if (!recentSearches.includes(item)) {
      const updatedSearches = [...recentSearches, item];
      try {
        await saveData(SEARCH_KEY, JSON.stringify(updatedSearches)); // Lưu vào AsyncStorage
        setRecentSearches(updatedSearches); // Cập nhật state
      } catch (error) {
        console.log('Error saving recent search:', error);
      }
    }
  };
  

  const removeSearchTerm = async (item) => {
    const updatedSearches = recentSearches.filter((term) => term !== item);
    try {
      await saveData(SEARCH_KEY, JSON.stringify(updatedSearches)); // Cập nhật AsyncStorage
      setRecentSearches(updatedSearches); // Cập nhật state
    } catch (error) {
      console.log('Error removing search term:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    let apiUrl = `${BASE_URL}products/filters?`;
    console.log(apiUrl);
    const queryParams = [];
    if (minPrice !== null && minPrice !== undefined)
      queryParams.push(`minPrice=${minPrice}`);
    if (maxPrice !== null && maxPrice !== undefined)
      queryParams.push(`maxPrice=${maxPrice}`);
    if (direction && direction !== '')
      queryParams.push(`direction=${direction}`);
    if (sort && sort != '') queryParams.push(`sort=${sort}`);
    if (searchQuery !== null && searchQuery !== undefined)
      queryParams.push(`search=${searchQuery}`);

    apiUrl += queryParams.join('&');
    axios
      .get(apiUrl)
      .then((response) => {
        const { content } = response.data.data;
        setProductsState(content);
        setLoading(false);
      })
      .catch((error) => {
        setProductsState([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [minPrice, maxPrice, searchQuery, sort, direction]);

  const filteredSuggestions = productsState.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const searchInputRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus(); // Focus vào ô nhập liệu sau khi render
      }
    }, 100);
  }, []);
  
  const handleSearchQuery = (e) => {
    setToggleItem(false);
    setSearchQuery(e);
  };
  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm Kiếm Sản Phẩm..."
          value={searchQuery}
          onChangeText={handleSearchQuery}
          onSubmitEditing={handleSearch}
          ref={searchInputRef}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Image
            source={require('../assets/iconSeach.png')}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Lọc */}
        <TouchableOpacity style={styles.filter} onPress={toggleFilterModal}>
          <Image
            source={require('../assets/filter.png')}
            style={styles.iconCenter}
          />
        </TouchableOpacity>
      </View>
      {/* Filter Modal Component */}
      <Filter
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
      {/* Suggestions Section */}
      {!toggleItem && searchQuery && (
        // Show Suggestions if toggleItem is true
        <View style={styles.suggestionsContainer}>
          {searchQuery.length < 2 ? (
            <Text style={{ marginTop: -24, marginBottom: 10 }}>
              Nhập ít nhất 2 ký tự
            </Text>
          ) : (
            <>
              <Text style={styles.recentSearchesTitle}>Gợi ý</Text>

              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <>
                  {suggestion.length === 0 ? (
                    <Text>Không có giá trị để gợi ý</Text>
                  ) : (
                    <ScrollView
                      contentContainerStyle={styles.suggestionsContainer}
                    >
                      {suggestion.map((item) => (
                        <View key={item.productId}>
                          <View style={styles.suggestionItem}>
                            <TouchableOpacity
                              onPress={() =>
                                handleRecentSearchClick(item.productName)
                              }
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Image
                                source={require('../assets/iconSeach.png')}
                                style={styles.clock}
                              />
                              <Text style={styles.suggestionText}>
                                {item.productName}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.line}></View>
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </>
              )}
            </>
          )}
        </View>
      )}
      {!toggleItem && !searchQuery && (
        // Show Recent Searches if toggleItem is false
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Đã Tìm Kiếm</Text>

          <ScrollView contentContainerStyle={styles.listContent}>
            {recentSearchesShow.map((item, index) => (
              <View key={index.toString()} style={styles.recentSearchItem}>
                <TouchableOpacity
                  onPress={() => handleRecentSearchClick(item)}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Image
                    source={require('../assets/clock.png')}
                    style={styles.clock}
                  />
                  <Text style={styles.recentSearchText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeSearchTerm(item)}>
                  <Image
                    source={require('../assets/iconClose.png')}
                    style={styles.iconSmall}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={toggleExpand}
            style={{
              marginBottom: 10,
              color: '#3669c9',
            }}
          >
            <Text style={{ color: '#C4C5C4', textAlign: 'center' }}>
              {isFilterModalVisibleMemory ? 'Ẩn Bớt' : 'Hiện Thêm'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Display Product List after Search */}
      {!loading && toggleItem && filteredSuggestions.length > 0 && (
        <FlatList
          data={filteredSuggestions}
          renderItem={({ item }) => {
            return (
              <ProductItem
                id={item['productId']}
                name={item['productName']}
                price={item['productPriceSale']}
                oldPrice={item['productPrice']}
                image={item['productImages']?.[0].productImagePath}
                rating={item['productRating']}
                sale={item['productSale']}
                isLoading={false}
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
      )}
      {/* No Products Found */}
      {!loading && toggleItem && filteredSuggestions.length === 0 && (
        <View style={{ position: 'relative' }}>
          <View style={{ marginBottom: '70%' }}></View>
          <Image
            source={require('../assets/NoProduct.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: '75%',
              top: 100,
            }}
          />
        </View>
      )}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
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
    top: -35,
  },
  listContent: {
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  recentSearchesContainer: { marginTop: 0 },
  recentSearchesTitle: { fontSize: 16, fontWeight: 'bold' },
  recentSearchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentSearchText: { fontSize: 16 },
  iconSmall: { width: 15, height: 15, marginLeft: 8 },

  suggestionsContainer: { marginTop: 16 },
  suggestionsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionText: { fontSize: 16 },
  greySection: {
    width: '100%',
    paddingTop: 20,
    borderRadius: 30,
  },
  clock: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default SearchScreen;
