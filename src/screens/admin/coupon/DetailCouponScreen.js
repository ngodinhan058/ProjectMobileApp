import React, { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';

function CouponDetailScreen({ route, navigation }) {
    const [coupons, setCoupons] = useState([]);
    const { id } = route.params;
    const [isLoading, setIsLoading] = useState(false);

    // console.log(id);
    useEffect(() => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}coupon/${id}`;
        axios
            .get(apiUrl)
            .then(response => {
                const couponData = response.data.data;
                setCoupons(couponData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);
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
                    <Text style={styles.detailValue}>{coupons.couponName}</Text>

                    <Text style={styles.detailLabel}>Mã Coupon:</Text>
                    <Text style={styles.detailValue}>{coupons.couponCode}</Text>

                    <Text style={styles.detailLabel}>Ngày Phát Hành:</Text>
                    <Text style={styles.detailValue}>{new Date(coupons.couponRelease).toLocaleDateString()}</Text>

                    <Text style={styles.detailLabel}>Ngày Hết Hạn:</Text>
                    <Text style={styles.detailValue}>{new Date(coupons.couponExpire).toLocaleDateString()}</Text>

                    <Text style={styles.detailLabel}>Số Lượng:</Text>
                    <Text style={styles.detailValue}>{coupons.couponQuantity}</Text>





                    <Text style={styles.detailLabel}>
                        {coupons.couponType === 0
                            ? 'Phần Trăm Giảm Giá:'
                            : coupons.couponType === 1
                                ? 'Số Tiền Giảm Giá:'
                                : 'Miễn Phí Vận Chuyển:'}
                    </Text>
                    <Text style={styles.detailValue}>
                        {coupons.couponType === 0
                            ? `${coupons.couponPerHundred || 'Không áp dụng'} %`
                            : coupons.couponType === 1
                                ? `${coupons.couponPrice || 'Không áp dụng'} VNĐ`
                                : coupons.couponPrice ? `${coupons.couponPrice} VNĐ`
                                    : `Miễn phí ${coupons.couponFeeShip || 'Không áp dụng'}`}
                    </Text>
                    <Text style={styles.detailLabel}>Loại Coupon:</Text>
                    <Text style={styles.detailValue}>
                        {coupons.couponType === 0
                            ? 'Phần Trăm'
                            : coupons.couponType === 1
                                ? 'Tiền VNĐ'
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
                        navigation.navigate('EditCouponScreen', {
                            couponId: id,
                            couponName: coupons.couponName,
                            couponCode: coupons.couponCode,
                            couponRelease: coupons.couponRelease,
                            couponExpire: coupons.couponExpire,
                            couponQuantity: coupons.couponQuantity,
                            couponPerHundred: coupons.couponPerHundred,
                            couponPrice: coupons.couponPrice,
                            couponFeeShip: coupons.couponFeeShip,
                            couponType: coupons.couponType,
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
                            { text: "Có", onPress: deleteCoupon }
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
    detailContainer: { padding: 20 },
    detailLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    detailValue: { fontSize: 16, marginBottom: 10 },
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
