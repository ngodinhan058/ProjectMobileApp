import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Pressable, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import ProductItem from '../components/ProductItem';

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
        name: 'TMA-2 HD Wireless',
        price: '1.500.000',
        rating: '4.6',
        review: '86'
    },
    {
        id: '3',
        image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        name: 'TMA-2 HD Wireless',
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

const ProfileScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.iconHeader}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={35} color="#000" />
                </Pressable>
                <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>

            </View>
            <View style={styles.whiteSection}>
                {/* Header thông tin cá nhân */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image
                            style={styles.avatar}
                            source={{ uri: 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doi-mu.jpg?1704788682389' }} // URL hình ảnh đại diện
                        />
                        <View>
                            <Text style={styles.name}>Yourname</Text>
                            <Text style={styles.email}>youremail@gmail.com</Text>
                            <Text style={styles.balance}>0đ</Text>
                        </View>
                        <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('BioDataScreen')}>
                            <Icon name="pencil" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Đơn hàng của tôi */}
                <View style={styles.orderSection}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.sectionTitle}>Đơn Hàng Của Tôi</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('MyOrderScreen')}>
                            <Text style={{ fontSize: 12, marginRight: 10 }}>Xem Tất Cả</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.line} ></View>
                    <View style={styles.orderOptionContainer}>
                        <TouchableOpacity style={styles.orderOption} onPress={() => navigation.navigate('MyOrderConfirmScreen')}>
                            <Image source={require('../assets/pay.png')} style={styles.icon} />
                            <Text style={styles.text}>Pay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.orderOption} onPress={() => navigation.navigate('GettingOrderedScreen')}>
                            <Image source={require('../assets/ship.png')} style={styles.icon} />
                            <Text style={styles.text}>Ship</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.orderOption} onPress={() => navigation.navigate('WatingShipmentScreen')}>
                            <Image source={require('../assets/box_pro.png')} style={styles.icon} />
                            <Text style={styles.text}>Đang giao</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.orderOption} onPress={() => navigation.navigate('')}>
                            <Image source={require('../assets/review.png')} style={styles.icon} />
                            <Text style={styles.text}>Đánh Giá</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.orderOption} onPress={() => navigation.navigate('')}>
                            <Image source={require('../assets/undo.png')} style={styles.icon} />
                            <Text style={styles.text}>Trả Hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </View>

            {/* Sản phẩm bạn có thể thích */}

            <View style={styles.suggestionsSection}>
                <Text style={styles.sectionTitle}>Có thể bạn thích:</Text>

                <View style={styles.productGrid}>
                    {featuredProducts.map((product, index) => (
                        <View key={product.id}>
                            <ProductItem
                                name={product.name}
                                price={product.price}
                                rating={product.rating}
                                review={product.review}
                                image={product.image}
                            />
                        </View>
                    ))}
                </View>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 5,
    },

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10,
    },
    whiteSection: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderTopRightRadius: 10,
    },
    iconHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 50,
        paddingBottom: 20,
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
    header: {
        backgroundColor: '#3669c9',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 20,
        borderWidth: 2,
        borderColor: '#fff'
    },
    name: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#fff',
    },
    balance: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    editIcon: {
        marginLeft: 'auto',
        backgroundColor: '#1565C0',
        padding: 8,
        borderRadius: 20,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        paddingBottom: 5,
        marginHorizontal: 10,

    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#EDEDED',
        marginHorizontal: 10,
    },
    suggestionsSection: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },

    orderOptionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,

    },
    orderOption: {
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        width: 30,
        height: 30,
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
    },


    productList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        color: '#E91E63',
        marginBottom: 5,
    },
    productReviews: {
        fontSize: 12,
        color: '#999',
    },
});

export default ProfileScreen;
