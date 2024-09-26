import React from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Image, } from 'react-native';
import ProductItem from '../components/ProductItem';


const featuredProducts = [
    { id: '1', name: 'TMA-2 HD Wireless', price: '1.500.000' },
    { id: '1', name: 'TMA-2 HD Wireless', price: '1.500.000' },
    { id: '2', name: 'MacBook Pro 2021', price: '35.000.000' },
    { id: '3', name: 'iPhone 13', price: '20.000.000' },
];

const SearchScreen = ({ route }) => {
    const { query } = route.params;
    const filteredProducts = featuredProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.resultText}>{query}</Text>
            <View>
                {/* Thanh tìm kiếm */}
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput} placeholder="Search Product Name" />
                    <Image source={require('../assets/iconSeach.png')} style={styles.icon} />
                </View>
                {/* Lọc */}
                <View style={styles.filter}>
                    <Image source={require('../assets/filter.png')} style={styles.iconCenter} />
                </View>
            </View>

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
        backgroundColor: '#fafafa',
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
        borderColor: '#fff'
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
    },
    filter: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: '#fafafa',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        right: 0,
        borderWidth: 5,
        borderColor: '#fff'
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
        top: 15,
    },
    listContent: {
        paddingVertical: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },

});

export default SearchScreen;
