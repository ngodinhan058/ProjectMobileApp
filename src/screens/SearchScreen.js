import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import Filter from '../components/Filter';
import axios from 'axios';
import { BASE_URL } from './api/config';


const SearchScreen = ({ navigation, route }) => {
    const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(2000000);

    const { query } = route.params;
    const finalQuery = query || '';

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [searchQuery, setSearchQuery] = useState(finalQuery); // Lưu trữ trạng thái cho thanh tìm kiếm
    const [loading, setLoading] = useState(true); // Thêm biến loading nếu thiếu
    const [categoryId, setCategoryId] = useState([]);


    const handleSearch = () => {
        navigation.replace('SearchScreen', { query: searchQuery });
    };

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
    useEffect(() => {
        let apiUrl = `${BASE_URL}products/filters?`;

        const queryParams = [];
        if (minPrice !== null && minPrice !== undefined) queryParams.push(`minPrice=${minPrice}`);
        if (maxPrice !== null && maxPrice !== undefined) queryParams.push(`maxPrice=${maxPrice}`);
        if (categoryId !== null && categoryId !== "") queryParams.push(`categoryId=${categoryId}`);
        if (searchQuery !== null && searchQuery !== undefined) queryParams.push(`search=${searchQuery}`);

        apiUrl += queryParams.join('&');
        console.log('sanpham', apiUrl)
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
    }, [minPrice, maxPrice, categoryId, searchQuery]);

    const filteredSuggestions = productsState.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <View style={styles.container}>
            {/* Thanh tìm kiếm */}
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

            {/* Filter Modal Component */}
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
                    style={styles.productList}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                />
            ) : (

                <View style={{ justifyContent: 'center' }}>
                    <View style={{ marginBottom: '25%' }} ></View>
                    <Image source={require('../assets/NoProduct.png')} style={{ width: '100%', height: '45%' }} />
                </View>
            )}
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
});

export default SearchScreen;
