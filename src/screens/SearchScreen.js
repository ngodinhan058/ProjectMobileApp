import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProductItem from '../components/ProductItem';
import Filter from '../components/Filter';

const featuredProducts = [
    { id: '1', name: 'TMA-2 HD Wireless', price: '1.500.000' },
    { id: '2', name: 'MacBook Pro 2021', price: '35.000.000' },
    { id: '3', name: 'iPhone 13', price: '20.000.000' },
    { id: '4', name: 'iPhone 13', price: '20.000.000' },
    { id: '5', name: 'iPhone 13', price: '20.000.000' },

];

const SearchScreen = ({ navigation, route }) => {
    const { query } = route.params;
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [searchQuery, setSearchQuery] = useState(query); // Lưu trữ trạng thái cho thanh tìm kiếm

    const filteredProducts = featuredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleSearch = () => {
        navigation.replace('SearchScreen', { query: searchQuery });
    };

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


            {/* Hiển thị dữ liệu đã chọn */}
            {appliedFilters && (
                <View style={styles.appliedFilters}>
                    <Text style={styles.appliedText}>Khoảng giá: {appliedFilters.priceRange[0].toLocaleString('vi-VN')} đ - {appliedFilters.priceRange[1].toLocaleString('vi-VN')} đ</Text>
                    <Text style={styles.appliedText}>Sản phẩm đã chọn:</Text>
                    {Object.keys(appliedFilters.categories).map((category) => (
                        appliedFilters.categories[category] && (
                            <Text key={category} style={styles.appliedText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                        )
                    ))}
                </View>
            )}

            {/* Thanh tìm kiếm */}
            <View style={styles.searchBar}>

                <TextInput
                    style={styles.searchInput}
                    placeholder={query}
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
            <FlatList
                data={filteredProducts}
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
