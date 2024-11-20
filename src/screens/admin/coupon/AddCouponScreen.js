import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const AddCouponScreen = ({ navigation }) => {
    const COUPON_PER_HUNDRED_TYPE = 0;
    const COUPON_PRICE_TYPE = 1;
    const COUPON_SHIP_TYPE = 2;

    const [couponName, setCouponName] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponRelease, setCouponRelease] = useState('');
    const [couponExpire, setCouponExpire] = useState('');
    const [couponQuantity, setCouponQuantity] = useState('');
    const [couponPerHundred, setCouponPerHundred] = useState('');
    const [couponPrice, setCouponPrice] = useState('');
    const [couponFeeShip, setCouponFeeShip] = useState('');
    const [couponType, setCouponType] = useState(COUPON_PER_HUNDRED_TYPE); // Default to percentage
    const [isLoading, setIsLoading] = useState(false);

    const handleAddCoupon = async () => {
        if (!couponName || !couponCode || !couponRelease || !couponQuantity) {
            Alert.alert('Error', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setIsLoading(true);
            const payload = {
                couponName,
                couponCode,
                couponRelease,
                couponExpire,
                couponQuantity: parseInt(couponQuantity),
                couponPerHundred: couponType === COUPON_PER_HUNDRED_TYPE ? parseFloat(couponPerHundred) : null,
                couponPrice: couponType === COUPON_PRICE_TYPE ? parseFloat(couponPrice) : null,
                couponType,
            };
            console.log("payload", payload);

            const apiUrl = `${BASE_URL}coupon`;
            await axios.post(apiUrl, payload);

            Alert.alert('Success', 'Thêm mã giảm giá thành công');
            navigation.replace('CouponList'); // Chuyển hướng sau khi thêm thành công
        } catch (error) {
            Alert.alert('Error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderInputForCouponType = () => {
        switch (couponType) {
            case COUPON_PER_HUNDRED_TYPE:
                return (
                    <>
                        <Text style={styles.label}>Giảm Giá (%):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập phần trăm giảm giá"
                            keyboardType="numeric"
                            value={couponPerHundred}
                            onChangeText={setCouponPerHundred}
                        />
                    </>
                );
            case COUPON_PRICE_TYPE:
                return (
                    <>
                        <Text style={styles.label}>Giảm Giá (VNĐ):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số tiền giảm giá"
                            keyboardType="numeric"
                            value={couponPrice}
                            onChangeText={setCouponPrice}
                        />
                    </>
                );
            case COUPON_SHIP_TYPE:
                 return (
                    <>
                        <Text style={styles.label}>Giảm Phí Vận Chuyển (VNĐ):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số tiền giảm giá"
                            keyboardType="numeric"
                            value={couponFeeShip}
                            onChangeText={setCouponFeeShip}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Thêm Mã Giảm Giá</Text>
                </LinearGradient>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Mã Giảm Giá:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tên mã giảm giá"
                        value={couponName}
                        onChangeText={setCouponName}
                    />

                    <Text style={styles.label}>Mã Giảm Giá:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChangeText={setCouponCode}
                    />

                    <Text style={styles.label}>Ngày Phát Hành:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={couponRelease}
                        onChangeText={setCouponRelease}
                    />

                    <Text style={styles.label}>Ngày Hết Hạn:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={couponExpire}
                        onChangeText={setCouponExpire}
                    />

                    <Text style={styles.label}>Số Lượng:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập số lượng"
                        keyboardType="numeric"
                        value={couponQuantity}
                        onChangeText={setCouponQuantity}
                    />

                    <Text style={styles.label}>Loại Coupon:</Text>
                    <View style={styles.radioContainer}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setCouponType(COUPON_PER_HUNDRED_TYPE)}
                        >
                            <Icon
                                name={couponType === COUPON_PER_HUNDRED_TYPE ? 'dot-circle-o' : 'circle-o'}
                                size={25}
                                color="#000"
                            />
                            <Text style={styles.radioText}>Giảm Giá (%)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setCouponType(COUPON_PRICE_TYPE)}
                        >
                            <Icon
                                name={couponType === COUPON_PRICE_TYPE ? 'dot-circle-o' : 'circle-o'}
                                size={25}
                                color="#000"
                            />
                            <Text style={styles.radioText}>Giảm Giá (VNĐ)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setCouponType(COUPON_SHIP_TYPE)}
                        >
                            <Icon
                                name={couponType === COUPON_SHIP_TYPE ? 'dot-circle-o' : 'circle-o'}
                                size={25}
                                color="#000"
                            />
                            <Text style={styles.radioText}>Giảm Giá Vận Chuyển</Text>
                        </TouchableOpacity>
                    </View>

                    {renderInputForCouponType()}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCoupon}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>Thêm</Text>
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#2196F3',
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    radioContainer: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    radioText: {
        marginLeft: 5,
        fontSize: 16,
    },
    infoText: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: '#3669c9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AddCouponScreen;
