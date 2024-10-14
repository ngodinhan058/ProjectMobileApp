import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ProductItem from '../components/ProductItem';

const SearchScreen = ({ navigation, route }) => {
    // Retrieve query from route params or set to an empty string
    const { query = '' } = route?.params || {};

    // States for search query and recent searches
    const [searchQuery, setSearchQuery] = useState(query);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    const [recentSearches, setRecentSearches] = useState([
        'Mac', 'Macbook', 'iPhone', 'Headphones'
    ]);



    const recentSearchesShow = isFilterModalVisible
        ? recentSearches // Hiển thị tất cả nếu mở rộng
        : recentSearches.slice(0, 2); // Chỉ hiển thị 2 mục đầu tiên

    const toggleExpand = () => {
        setIsFilterModalVisible(!isFilterModalVisible); // Chuyển đổi trạng thái mở rộng
    };

    // Fake product data
    const featuredProducts = [
        {
            id: '1',
            image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
            name: 'TMA-2 HD Wireless0',
            price: '1.500.000',
            rating: '4.0',
            review: '860',
            like: true,
        },
        {
            id: '2',
            image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' },
            name: 'TMA-2 HD Wireless2',
            price: '1.500.000',
            rating: '2.6',
            review: '6',
            like: false,
        },
        {
            id: '3',
            image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
            name: 'TMA-2 HD Wireless',
            price: '1.500.000',
            rating: '0.6',
            review: '106',
            like: true,
        },
    ];
    // Filter featured products based on the search query
    const filteredSuggestions = featuredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const handleSearch = () => {
        // Save the current search query to recent searches
        if (searchQuery && !recentSearches.includes(searchQuery)) {
            setRecentSearches([searchQuery, ...recentSearches]);
        }
        // Navigate to the search screen with the current query
        navigation.replace('SearchScreen', { query: searchQuery });
    };
    const searchInputRef = useRef(null);
    useEffect(() => {
        // Delay to ensure the screen is fully rendered before focusing
        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 100); // Delay of 100ms
    }, []);

    // Remove a search term from the recent searches list
    const removeSearchTerm = (term) => {
        setRecentSearches(recentSearches.filter(item => item !== term));
    };

    // Handle clicking on a recent search term
    const handleRecentSearchClick = (term) => {
        setSearchQuery(term);
        navigation.replace('SearchScreen', { query: term });
    };

    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={styles.container}>
                {/* Search Bar */}
                {/* Thanh tìm kiếm */}
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput} placeholder="Search Product Name" value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearch} ref={searchInputRef} />
                    <TouchableOpacity onPress={handleSearch}>
                        <Image
                            source={require('../assets/iconSeach.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Suggestions Section */}
                {searchQuery ? (
                    <View style={styles.suggestionsContainer}>
                        <Text style={styles.recentSearchesTitle}>Gợi ý</Text>
                        <ScrollView contentContainerStyle={styles.suggestionsContainer}>
                            {filteredSuggestions.map((item) => (
                                <View>
                                    <View key={item.id} style={styles.suggestionItem}>
                                        <TouchableOpacity onPress={() => setSearchQuery(item.name)} style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <Image
                                                source={require('../assets/iconSeach.png')}
                                                style={styles.clock}
                                            />
                                            <Text style={styles.suggestionText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.line}></View>
                                </View>
                            ))}

                        </ScrollView>

                    </View>
                ) : (
                    < View style={styles.recentSearchesContainer}>
                        <Text style={styles.recentSearchesTitle}>Đã tìm kiếm</Text>
                        <ScrollView contentContainerStyle={styles.listContent}>
                            {recentSearchesShow.map((item, index) => (
                                <View key={index.toString()} style={styles.recentSearchItem}>
                                    <TouchableOpacity onPress={() => handleRecentSearchClick(item)} style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
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
                        <TouchableOpacity onPress={() => toggleExpand()} style={{
                            marginBottom: 10, color: '#3669c9'
                        }}>
                            {isFilterModalVisible ? (<Text style={{ color: '#C4C5C4', textAlign: 'center' }}>Thu Gọn</Text>) : (<Text style={{ color: '#C4C5C4', textAlign: 'center' }}>Hiển Thị Tiếp</Text>)}
                        </TouchableOpacity>

                    </View>)}

            </View >
            <View style={styles.greySection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.textBold}>Sản Phẩm Đề Xuất</Text>
                </View>
                <ScrollView contentContainerStyle={styles.listContent}>
                    <View style={styles.columnWrapper}>
                        {featuredProducts.map((item) => (
                            <ProductItem key={item.id} {...item} />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </ScrollView>
    );
};

const styles = {
    container: {
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 15,
    },
    searchBar: {
        position: 'relative',
        marginTop: 30,
        marginBottom: 20,
        background: '#fff',
    },
    searchInput: {
        width: '100%',
        height: 50,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 10,
    },
    icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: '90%',
        top: -35,
    },
    clock: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    recentSearchesContainer: { marginTop: 16 },
    recentSearchesTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    recentSearchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    recentSearchText: { fontSize: 16 },
    iconSmall: { width: 15, height: 15, marginLeft: 8 },

    suggestionsContainer: { marginTop: 16 },
    suggestionsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    suggestionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
    suggestionText: { fontSize: 16 },
    greySection: {
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#fafafa',
        paddingTop: 20,
        borderRadius: 30,
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
    listContent: {
        paddingVertical: 10,
    },
    columnWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
};

export default SearchScreen;