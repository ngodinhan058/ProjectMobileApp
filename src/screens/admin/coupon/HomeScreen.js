import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';


const HomeAdminScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}coupons`;
        axios
            .get(apiUrl)
            .then(response => {
                const couponData = response.data.data.content;
                setCoupons(couponData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    const renderCoupon = ({ item }) => {
        const discountInfo = item.couponPerHundred
            ? `${item.couponPerHundred}%`
            : `${item.couponPrice} đ`;

        return (
            <View style={{ paddingHorizontal: 20 }}>
                <TouchableOpacity
                    style={styles.couponItem}
                    onPress={() =>
                        navigation.navigate('DetailCouponScreen', {
                            id: item.couponId,

                        })
                    }
                >
                    <View style={{
                        width: 80, height: 80, borderWidth: 1, borderColor: '#eee', borderRadius: 70, shadowColor: '#000', backgroundColor: '#fff',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.27,
                        shadowRadius: 4.65,
                        elevation: 6,
                        justifyContent: 'center',
                    }}>
                        <Text style={{ fontSize: 21, color: 'red', textAlign: 'center',  }}>
                            {discountInfo}
                        </Text>
                    </View>
                    <View style={styles.couponDetails}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 20 }}>
                            {item.couponName}
                        </Text>

                    </View>
                    <Pressable style={{ marginLeft: 10 }}>
                        <Icon name="arrow-forward-circle-outline" size={25} color="#000" />
                    </Pressable>
                </TouchableOpacity>
            </View>
        );
    };

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
                <TouchableOpacity>
                    <Icon name="log-out-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            {/* Coupon List */}
            <FlatList
                data={coupons}
                renderItem={renderCoupon}
                keyExtractor={(item) => item.couponId.toString()}
                style={styles.couponList}
            />
            {/* Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCouponScreen')}
            >
                <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.addButtonGradient}>
                    <Icon name="add-circle" size={40} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#3669c9" />
                </View>
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
        padding: 20,
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
    subtitleText: {
        fontSize: 16,
        color: '#666',
    },
    productList: {
        flex: 1,
    },
    couponItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginVertical: 20,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    couponDetails: {
        flex: 1,
        textAlign: 'center',
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
        shadowOpacity: 0.30,
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
