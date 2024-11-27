import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';
import AlertComponent from '../../../components/AlertComponent';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAdminScreen = ({ navigation, route }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
    const [refreshing, setRefreshing] = useState(false);

    const { alertVisible, alertType, title } = route.params || {}; // Nhận params từ navigation
    const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);
    const fetchProducts = async () => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}shipments`;
        axios.get(apiUrl)
            .then(response => {
                const productData = response.data.data;
                setProductsState(productData);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                // console.error('Error fetching data:', error);
            });
    };

    // useEffect(() => {
    //     fetchProducts()
    // }, []);

    useFocusEffect(
        useCallback(() => {
          fetchProducts();
        }, [])
      );
    
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
    const handleRefresh = () => {
        fetchProducts();
    };
    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('DetailProductShipment', {
                id: item.shipmentId
            })}
        >
            <View style={{ marginRight: 20, }}>
                {/* <Image source={{ uri: item.productImages[0].productImagePath  }} style={styles.productIcon} /> */}
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>Ngày {item.shipmentDate}</Text>
                <Text style={styles.productStatus}>Hãng: {item.productSupplier?.productSupplierName}</Text>

                <View style={styles.line}></View>
                <Text style={styles.productDis}>Discount: {item.shipmentDiscount}%</Text>

            </View>
            <Pressable>
                <Icon name="angle-right" size={25} color="#000" />
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
                    <Ionicons name="log-out-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            {/* Product List */}
            {productsState.length > 0 ? (
                <FlatList
                    data={productsState}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.shipmentId}
                    style={styles.productList}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                />) : <Text refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                } style={{ textAlign: 'center', fontSize: 23, fontStyle: 'italic', color: '#aaa' }}>Không có lô hàng</Text>}


            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddProductShipment')}
            >
                <LinearGradient
                    colors={['#4CAF50', '#388E3C']}
                    style={styles.addButtonGradient}
                >
                    <Ionicons name="add-circle" size={40} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
            {isAlertVisible && (
                <AlertComponent
                    title={alertType === 'success' ? 'Success' : 'Error'}
                    description={
                        alertType === 'success' ? title : 'Failed to add product.'
                    }
                    alertType={alertType}
                    visible={isAlertVisible}
                    onClose={() => setIsAlertVisible(false)}
                />
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
        flex: 1,
        backgroundColor: '#fff',
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
    line: {
        width: '95%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 10,
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
        left: '35%'

    },
    productList: {
        flex: 1,
        paddingHorizontal: 20
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ededed',
        margin: 2,
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
    },
    productIcon: {
        width: 55,
        height: 55,
        marginLeft: 5,
        marginTop: 5,

    },
    productDetails: {
        flex: 1,
    },
    productCode: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productDis: {
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
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
 addButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeAdminScreen;
