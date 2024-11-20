import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';

function CouponDetailScreen({ route, navigation }) {
    const { id, couponName, couponCode, couponRelease, couponExpire, couponQuantity, couponPerHundred, couponPrice, couponType } = route.params;

    // State cho nút mở rộng
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0)); // Hoạt ảnh chính
    const [rotation] = useState(new Animated.Value(0)); // Hoạt ảnh xoay

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        // Animation mở rộng
        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        // Animation xoay
        Animated.timing(rotation, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setIsOpen(!isOpen);
    };

    const position1 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 160],
    });
    const position2 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 100],
    });
    const rotateIcon = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });
    const deleteCoupon = async () => {
        try {
            const apiUrl = `${BASE_URL}coupon/${id}`;
            await axios.delete(apiUrl);
            Alert.alert('Thành công', 'Coupon đã được xoá');
            navigation.replace('CouponList');
        } catch (error) {
            console.error('Error deleting coupon:', error.response ? error.response.data : error.message);
            Alert.alert('Lỗi', 'Xoá coupon thất bại.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Chi Tiết Coupon</Text>
                </LinearGradient>

                {/* Thông tin chi tiết Coupon */}
                <View style={styles.detailContainer}>
                    <Text style={styles.detailLabel}>Tên Coupon:</Text>
                    <Text style={styles.detailValue}>{couponName}</Text>

                    <Text style={styles.detailLabel}>Mã Coupon:</Text>
                    <Text style={styles.detailValue}>{couponCode}</Text>

                    <Text style={styles.detailLabel}>Ngày Phát Hành:</Text>
                    <Text style={styles.detailValue}>{couponRelease}</Text>

                    <Text style={styles.detailLabel}>Ngày Hết Hạn:</Text>
                    <Text style={styles.detailValue}>{couponExpire || 'Không xác định'}</Text>

                    <Text style={styles.detailLabel}>Số Lượng:</Text>
                    <Text style={styles.detailValue}>{couponQuantity}</Text>

                    <Text style={styles.detailLabel}>Phần Trăm Giảm Giá:</Text>
                    <Text style={styles.detailValue}>{couponPerHundred || 'Không áp dụng'}%</Text>

                    <Text style={styles.detailLabel}>Số Tiền Giảm Giá:</Text>
                    <Text style={styles.detailValue}>{couponPrice || 'Không áp dụng'} VNĐ</Text>

                    <Text style={styles.detailLabel}>Loại Coupon:</Text>
                    <Text style={styles.detailValue}>
                        {couponType === 0
                            ? 'Phần Trăm'
                            : couponType === 1
                                ? 'Số Tiền'
                                : 'Giảm Phí Ship'}
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                    <Icon name="cog" size={30} color="#fff" />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[styles.subButtonPen, { bottom: position2 }]}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        const { postName, postContent, postImagePath, postType, postStatus } = productsState.post || {};
                        navigation.navigate('EditProductScreen', {
                            product: productsState,
                            postDTO: {
                                postName,
                                postContent,
                                postImagePath,
                                postType,
                                postStatusId: postStatus?.postStatusId
                            }
                        });
                    }}
                >
                    <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.iconButtonGradient}>
                        <Icon name="pencil" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.subButton, { bottom: position1 }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => {
                    Alert.alert(
                        "Xác Nhận!!!",
                        "Bạn có chắc muốn xoá không??",
                        [
                            {
                                text: "Huỷ",
                                style: "cancel"
                            },
                            { text: "Có", onPress: deleteProduct }
                        ]
                    );
                }}>
                    <LinearGradient colors={['#FF5252', '#FF1744']} style={styles.iconButtonGradient}>
                        <Icon name="trash" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        height: '100%',
        backgroundColor: '#eee',
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
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        flex: 1,
    },
    backButton: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 10,
    },

    numberOfImage: {
        position: 'absolute',
        left: '10%',
        bottom: '10%',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    productInfo: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    title: {
        textTransform: 'uppercase',
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10
    },
    productName: {
        textTransform: 'uppercase',
        fontSize: 18,
        fontWeight: '500',
        marginHorizontal: 10
    },
    productPrice: {
        color: '#FE3A30',
        fontWeight: '500',
        fontSize: 18,
    },
    productSale: {
        fontSize: 15,
    },
    originalPrice: {
        fontSize: 14,
        color: '#888',
        textDecorationLine: 'line-through',
        marginTop: 10,
    },
    SoldProductInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productStar: {
        flexDirection: 'row',
        gap: 5,
    },
    totalSellProduct: {
        color: '#3A9B7A',
    },
    descriptionProductTitle: {
        fontWeight: '800',
        fontSize: 16,
        paddingTop: 10,
    },
    descriptionProductText: {
        lineHeight: 24,
        paddingBottom: 10,
    },
    editButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    },
    editButtonText: {
        fontSize: 40,
        color: '#fff',
        marginLeft: 10,
        marginBottom: 10,
    },
    subButton: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subButtonPen: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CouponDetailScreen;
