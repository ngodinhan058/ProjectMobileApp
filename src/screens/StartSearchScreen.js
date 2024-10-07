import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';

const SearchScreen = ({ navigation, route }) => {
    // Retrieve query from route params or set to an empty string
    const { query = '' } = route?.params || {};

    // States for search query and recent searches
    const [searchQuery, setSearchQuery] = useState(query);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([
        'Mac', 'Cable', 'Macbook', 'iPhone', 'Headphones'
    ]);
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

    // Filtered products based on search query
    // const filteredProducts = featuredProducts.filter(product =>
    //     product.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

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
        <View style={styles.container}>
            {/* Search Bar */}
            {/* Thanh tìm kiếm */}
          <View style={styles.searchBar}>
            <TextInput style={styles.searchInput} placeholder="Search Product Name" value={searchQuery} onChangeText={setSearchQuery} onSubmitEditing={handleSearch} />
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
                    <Text style={styles.suggestionsTitle}>Gợi ý</Text>
                    <FlatList
                        data={filteredSuggestions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.suggestionItem}>
                                <TouchableOpacity onPress={() => setSearchQuery(item.name)}>
                                    <Text style={styles.suggestionText}>{item.name}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            ) :
                < View style={styles.recentSearchesContainer}>
                    <Text style={styles.recentSearchesTitle}>Đã tìm kiếm</Text>
                    <FlatList
                        data={recentSearches}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.recentSearchItem}>
                                <TouchableOpacity onPress={() => handleRecentSearchClick(item)}>
                                    <Text style={styles.recentSearchText}>{item}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => removeSearchTerm(item)}>
                                    <Image
                                        source={require('../assets/iconClose.png')} // icon for "X"
                                        style={styles.iconClose}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>}


        </View >
    );
};

const styles = {
    container: {
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#fff'
      },
    searchBar: {
        position: 'relative',
        marginTop: 30,
        marginBottom: 30,
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
    recentSearchesContainer: { marginTop: 16 },
    recentSearchesTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    recentSearchItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    recentSearchText: { fontSize: 16 },
    iconClose: { width: 20, height: 20, marginLeft: 8 },

    suggestionsContainer: { marginTop: 16 },
    suggestionsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    suggestionItem: { paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
    suggestionText: { fontSize: 16 },
};

export default SearchScreen;
