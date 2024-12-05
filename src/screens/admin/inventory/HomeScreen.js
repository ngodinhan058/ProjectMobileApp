import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import AlertComponent from '../../../components/AlertComponent';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../api/config';
import { WS_URL } from '../../api/configWS';
import useWebSocket from '../../api/useWebSocket';
import axios from 'axios';


const HomeAdminScreen = ({ navigation, route }) => {
    const [order, setOrder] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { alertVisible, alertType, title } = route.params || {}; // Nhận params từ navigation
    const [isAlertVisible, setIsAlertVisible] = useState(alertVisible || false);

    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}orders/status?status=1`);
            setOrder(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrder();
        }, [])
    );
    const wsUrl = `${WS_URL}/ws`;

    const handleOrderUpdate = (updatedOrder) => {
        setOrder((prevOrders) => {
            if (updatedOrder.orderId) {
                // Check if the order already exists
                const orderIndex = prevOrders.findIndex(order => order.orderId === updatedOrder.orderId);
                if (updatedOrder.orderStatus == 2) {
                    return prevOrders.filter(order => order.orderId !== updatedOrder.orderId);
                } else {
                    if (orderIndex !== -1) {
                        // Update the existing order
                        const newOrders = [...prevOrders];
                        newOrders[orderIndex] = updatedOrder;
                        return newOrders;
                    } else {
                        return [...prevOrders, updatedOrder]
                    }
                }
            } else {
                // Handle order deletion by `orderId`
                return prevOrders.filter(order => order.orderId !== updatedOrder.orderId);
            }
        });

    };
    const { client } = useWebSocket(wsUrl, handleOrderUpdate);


    const handleRefresh = () => {
        fetchOrder();
    };
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
            onPress={() => navigation.navigate('DetailInventoryScreen', { id: item.orderId, items: item.items })}
        >
            <View style={{
                marginRight: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image source={require('../../../assets/box.png')} style={styles.productIcon} />
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>Khách Hàng: {item.userName}</Text>
                <Text style={styles.productStatus}>{item.orderAddress}</Text>
                <Text style={styles.productStatus}>Ngày: {new Date(item.orderDate).toISOString().split('T')[0]}</Text>
                <View style={styles.line}></View>
                <Text style={styles.productCode}>Tổng Giá: {Number(item.orderTotal).toLocaleString('vi-VN')} ₫</Text>
            </View>
            <Pressable>
                <Icon name="arrow-forward-circle-outline" size={25} color="#000" />
            </Pressable>
        </TouchableOpacity>
    );

    return (
        <>
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
                    data={order}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.orderId.toString()}
                    style={styles.productList}
                    extraData={order}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
                    ListEmptyComponent={
                        !isLoading && (
                            <Text style={styles.emptyText}>Không Còn Đơn Hàng Nào.</Text>
                        )
                    }
                />

            </View>
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
        </>
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
        paddingHorizontal: 20,
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
    emptyText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#666',
        marginTop: 30,
        fontStyle: 'italic',
    },
    productStatus: {
        fontSize: 14,
        color: '#999',
        marginVertical: 5
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
