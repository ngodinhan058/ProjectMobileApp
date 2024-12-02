import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import AlertComponent from '../../../components/AlertComponent';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api/config';
import axios from 'axios';


const HomeAdminScreen = ({ navigation }) => {
    const products = [
        {
            id: '1', name: '#HWDSF776567DS', price: '1.500.000', quantity: 500, date: "14-11-2999", image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '2', name: '#HWDSF776567DS', price: '1.500.000', quantity: 500, date: "14-11-2999", image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '3', name: '#HWDSF776567DS', price: '1.500.000', quantity: 500, date: "14-11-2999", image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },

    ];

    const handleLogout = async () => {
        try {
            Alert.alert(
                'Xác nhận đăng xuất',
                'Bạn muốn đăng xuất phải không?',
                [
                    {
                        text: 'Huỷ',
                        style: 'cancel',
                    },
                    {
                        text: 'Đúng',
                        onPress: async () => {
                            await AsyncStorage.removeItem('userData');
                            await AsyncStorage.removeItem('userInfo');

                            Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất.');
                            navigation.navigate('Người Dùng');
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert('Thất bại', error);
        }
    };
    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('DetailInventoryScreen')}
        >
            <View style={{
                marginRight: 20,
            }}>
                <Image source={require('../../../assets/box.png')} style={styles.productIcon} />
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>{item.name}</Text>
                <Text style={styles.productStatus}>Tổng Số Lượng sản phẩm: {item.quantity}</Text>
                <Text style={styles.productStatus}>Ngày: {item.date}</Text>
                <View style={styles.line}></View>
                <Text style={styles.productCode}>Tổng Giá: {item.price} ₫</Text>
            </View>
            <Pressable>
                <Icon name="arrow-forward-circle-outline" size={25} color="#000" />
            </Pressable>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        source={{
                            uri: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474119Xok/hinh-anh-cho-cute-chibi-dep-nhat_100649530.png',
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.welcomeText}>Hi Admin!</Text>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                    <Icon name="log-out-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            {/* Product List */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                style={styles.productList}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    line: {
        width: '95%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 15,
        borderRadius: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    menuButton: {
        marginRight: 10,
    },
    menuIcon: {
        width: 35,
        height: 35,
        borderColor: '#ededed',
        borderRadius: 24,
        borderWidth: 2,
        marginTop: 0,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
    },
    productListTitle: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        left: '23%'

    },
    productList: {
        flex: 1,
        padding: 20,

    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ededed',
        padding: 20,
        margin: 2,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    productIcon: {
        width: 30,
        height: 30,
        marginLeft: 5,
        marginTop: 5,

    },
    productDetails: {
        flex: 1,
    },
    productCode: {
        fontSize: 16,
        fontWeight: 'bold',

    },

    productStatus: {
        fontSize: 14,
        color: '#888',
    },
    arrowIcon: {
        width: 20,
        height: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 40,
        color: '#fff',
    },
});

export default HomeAdminScreen;
