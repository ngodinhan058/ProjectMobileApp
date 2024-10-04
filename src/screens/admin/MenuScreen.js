import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const MenuScreen = ({ navigation }) => {
    const [selectedItem, setSelectedItem] = useState('Product List');
    const flatListRef = useRef(null);

    const menuItems = [
        'Product List',
        'Category List',
        'Shipper List',
        'User List',
        'Inventory List'
    ];

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        // Tự động điều hướng sau 1 giây nếu mục được chọn
        navigation.navigate(item.replace(' ', ''));
        
    };

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / 60); // 60 là chiều cao mỗi mục (xem StyleSheet bên dưới)
        const selectedItem = menuItems[index];
        if (selectedItem) {
            setSelectedItem(selectedItem);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectItem(item)}>
            <View style={styles.menuItem}>
                {selectedItem === item && <View style={styles.selectedIndicator} />}
                <Text style={[
                    styles.menuText,
                    selectedItem === item && styles.selectedText
                ]}>
                    {item}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Nút đóng */}
            <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Icon name="times" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Danh sách */}
            <View style={styles.listContainer}>
                <FlatList
                    ref={flatListRef}
                    data={menuItems}
                    keyExtractor={(item) => item}
                    renderItem={renderItem}
                    onScroll={handleScroll}
                    snapToInterval={60} // Chiều cao mỗi mục
                    decelerationRate="fast"
                    showsVerticalScrollIndicator={false}
                    style={{ flexGrow: 0 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3669c9',
        paddingHorizontal: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-start',
        marginBottom: 30,
    },
    listContainer: {
        height: 500,
        lineHeight: 500,
        justifyContent: 'center', // Đảm bảo các mục nằm giữa
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60, // Chiều cao mỗi mục
    },
    selectedIndicator: {
        width: 4,
        height: '100%',
        backgroundColor: 'white',
        marginRight: 10,
    },
    menuText: {
        fontSize: 18,
        color: '#ccc',
    },
    selectedText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MenuScreen;
