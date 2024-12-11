import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SelectorInCategory from '../../../components/SelectorInCategory';
import Supplier from '../../../components/Supplier';
import Size from '../../../components/Size';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import UploadImage from '../../../components/Up_Image_Multi';
import { LinearGradient } from 'expo-linear-gradient';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import DateTimePicker from '@react-native-community/datetimepicker';
import AlertComponent from '../../../components/AlertComponent';

const AddProductScreen = ({ route, navigation }) => {
    const NO_COUPON = 0;
    const HAVE_COUPON = 1;
    const COUPON_PER_HUNDRED_TYPE = 0;
    const COUPON_PRICE_TYPE = 1;
    const COUPON_SHIP_TYPE = 2;

    const [productSupplier, setProductSupplier] = useState();
    const [productSupplierName, setProductSupplierName] = useState();
    const [parentCategoryId, setParentCategoryId] = useState(null);
    const [parentCategoryName, setParentCategoryName] = useState(null);
    const [productSize, setProductSize] = useState(null);
    const [productSizeName, setProductSizeName] = useState(null);

    const [productCoupon, setProductCoupon] = useState(NO_COUPON);
    const [couponName, setCouponName] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [couponRelease, setCouponRelease] = useState(new Date());
    const [couponExpire, setCouponExpire] = useState(new Date());
    const [couponQuantity, setCouponQuantity] = useState('');
    const [couponPerHundred, setCouponPerHundred] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDatePickerExpire, setShowDatePickerExpire] = useState(false);
    const [couponPrice, setCouponPrice] = useState('');
    const [couponFeeShip, setCouponFeeShip] = useState('');
    const [couponType, setCouponType] = useState(COUPON_PER_HUNDRED_TYPE)

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isSupplierModal, setIsSupplierModal] = useState(false);
    const [isSizeModal, setIsSizeModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');

    const [selectedImages, setSelectedImages] = useState([]);
    const { postDTO } = route.params || {};

    const [productData, setProductData] = useState({
        productName: '',
        productYearOfManufacture: 2024,
        sizesProduct: [
            {
                sizeId: productSize
            }
        ],
        productSupplier: productSupplier,
        categories: parentCategoryId,
        post: postDTO || {},
        productImages: {
            productImageAlt: "Image of product",
        },
    });

    const [error, setError] = useState({
        productNameError: false
    });


    const handleAddProduct = async () => {
        const couponReleaseDate = couponRelease.toISOString().split('T')[0]; // Định dạng lại ngày
        const couponExpireDate = couponExpire.toISOString().split('T')[0]; // Định dạng lại ngày
        setIsLoading(true);
        const formData = new FormData();
        if (productCoupon == HAVE_COUPON) {
            const params = {
                productName: productData.productName,
                productYearOfManufacture: productData.productYearOfManufacture,
                sizesProduct: productData.sizesProduct,
                productSupplier: productSupplier,
                categories: parentCategoryId,
                post: postDTO,
                productImage: productData.productImages,
                coupon: {
                    couponName: couponName,
                    couponCode: couponCode,
                    couponRelease: couponReleaseDate,
                    couponExpire: couponExpireDate,
                    couponQuantity: parseInt(couponQuantity),
                    couponPerHundred: couponType === COUPON_PER_HUNDRED_TYPE ? parseFloat(couponPerHundred) : null,
                    couponPrice: couponType === COUPON_PRICE_TYPE ? parseFloat(couponPrice) : null,
                    couponFeeShip: couponType === COUPON_SHIP_TYPE ? parseFloat(couponFeeShip) : null,
                    couponType: couponType,
                }
            };
            formData.append('params', JSON.stringify(params));
            console.log("HAVECOUPONadd", params);


        }
        else {
            const params = {
                productName: productData.productName,
                productYearOfManufacture: productData.productYearOfManufacture,
                sizesProduct: productData.sizesProduct,
                productSupplier: productSupplier,
                categories: parentCategoryId,
                post: postDTO,
                productImage: productData.productImages,
            };
            formData.append('params', JSON.stringify(params));
            console.log("NOCOUPONadd", params);

        }




        selectedImages.forEach((imageUri, index) => {
            const fileType = imageUri.split('.').pop();
            const newFile = {
                uri: imageUri,
                name: `product-image-${index}.${fileType}`,
                type: `image/${fileType}`,
            };
            formData.append('file', newFile);
        });

        try {
            const response = await fetch(`${BASE_URL}product`, {
                method: 'POST',
                body: formData,
            });
            if (response.status === 201) {
                setAlertVisible(true);
                setAlertType('success');
                navigation.replace('ProductList', {
                    alertVisible: true,
                    alertType: 'success',
                    title: 'Thêm Sản Phẩm Thành Công,'
                });
            }
            else {
                setAlertType('error');
                setAlertVisible(true);
            }
        } catch (error) {
            console.log('Error adding product:', error);
            setAlertType('error');
            setAlertVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setError({
            productNameError: productData.productName === ''
        });
        if (postDTO) {
            if (productCoupon == HAVE_COUPON) {
                setProductData((prevData) => ({
                    ...prevData,
                    categories: parentCategoryId,
                    post: postDTO,
                    productSupplier: productSupplier,
                    sizesProduct: productSize ? productSize.map(id => ({ sizeId: id })) : null,
                    coupon: {
                        couponName: "Giảm giá khai trương",
                        couponCode: "WELCOME2024",
                        couponRelease: "2024-01-01",
                        couponFeeShip: 5000,
                        couponExpire: "2024-01-31",
                        couponQuantity: 100,
                        couponPrice: 15000,
                        couponType: 1
                    }
                }));
            }
            else {
                setProductData((prevData) => ({
                    ...prevData,
                    categories: parentCategoryId,
                    post: postDTO,
                    productSupplier: productSupplier,
                    sizesProduct: productSize ? productSize.map(id => ({ sizeId: id })) : null,
                }));
            }

        }
    }, [postDTO, productData.productName, productSize, parentCategoryId, productCoupon]);

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

    const renderInputForCoupon = () => {
        switch (productCoupon) {
            case NO_COUPON:
                return null;
            case HAVE_COUPON:
                return (
                    <>
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
                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                            <Text>{couponRelease ? couponRelease.toDateString() : 'Thêm Ngày Phát Hành'}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={couponRelease}
                                mode="date"
                                display="default"
                                onChange={onDateChangeCouponRelease}
                            />
                        )}

                        <Text style={styles.label}>Ngày Hết Hạn:</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePickerExpire(true)}>
                            <Text>{couponExpire ? couponExpire.toDateString() : 'Thêm Ngày Hết Hạn'}</Text>
                        </TouchableOpacity>
                        {showDatePickerExpire && (
                            <DateTimePicker
                                value={couponExpire}
                                mode="date"
                                display="default"
                                onChange={onDateChangeCouponExpire}
                            />
                        )}

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
                                    color="#3669c9"
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
                                    color="#3669c9"
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
                                    color="#3669c9"
                                />
                                <Text style={styles.radioText}>Giảm Giá Vận Chuyển</Text>
                            </TouchableOpacity>
                        </View>
                        {renderInputForCouponType()}
                    </>
                );
            default:
                return null;
        }
    };


    const onDateChangeCouponRelease = (event, selectedDate) => {
        const currentDate = selectedDate || couponRelease;
        setShowDatePicker(false);
        setCouponRelease(currentDate);
    };

    const onDateChangeCouponExpire = (event, selectedDate) => {
        const currentDate = selectedDate || couponExpire;
        setShowDatePickerExpire(false);
        setCouponExpire(currentDate);
    };

    const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);
    const toggleSupplierModal = () => setIsSupplierModal(!isSupplierModal);
    const toggleSizeModal = () => setIsSizeModal(!isSizeModal);

    const handleResetFilters = () => {
        setParentCategoryId(null);
        setParentCategoryName(null);
        setProductSize(null);
        setProductSizeName(null);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Thêm Thông Tin Sản Phẩm</Text>
                </LinearGradient>

                <UploadImage onImagesSelected={setSelectedImages} />
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    <TextInput
                        style={[styles.input, error.productNameError && styles.inputError]}
                        placeholder="Thêm Tên Sản Phẩm"
                        value={productData.productName}
                        onChangeText={(text) => setProductData({ ...productData, productName: text })}
                    />
                    <Text style={styles.label}>Post Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !postDTO && styles.inputError]} onPress={() => navigation.navigate('AddPostScreen', { savedData: postDTO })}>
                        {postDTO ? (<Text>Đã Thêm Post Sản Phẩm</Text>) : (<Text>Chưa Thêm Post Sản Phẩm</Text>)}
                    </TouchableOpacity>

                    <Text style={styles.label}>Danh Mục Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !parentCategoryName && styles.inputError]} onPress={toggleFilterModal}>
                        {parentCategoryName != null && parentCategoryName !== "" ? (
                            <Text>{parentCategoryName}</Text>
                        ) : (
                            <Text>Chưa Chọn Danh Mục Sản Phẩm</Text>
                        )}
                    </TouchableOpacity>

                    <SelectorInCategory
                        isVisible={isFilterModalVisible}
                        onClose={toggleFilterModal}
                        onReset={handleResetFilters}
                        onApply={(selectedParent, selectedParentName) => {
                            setParentCategoryId(selectedParent);
                            const selectedCategoryNames = selectedParentName.join(', ');
                            setParentCategoryName(selectedCategoryNames);
                        }}
                    />

                    <Text style={styles.label}>Thương Hiệu Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !productSupplier && styles.inputError]} onPress={toggleSupplierModal}>
                        {productSupplier != null ? (<Text>{productSupplierName}</Text>) : (<Text>Chưa Chọn Thương Hiệu Sản Phẩm</Text>)}
                    </TouchableOpacity>

                    <Supplier
                        isVisible={isSupplierModal}
                        onClose={toggleSupplierModal}
                        onReset={handleResetFilters}
                        onApply={(selectedFilters) => {
                            setProductSupplier(selectedFilters.suppliers);
                            setProductSupplierName(selectedFilters.suppliersName);
                        }}
                    />
                    <Text style={styles.label}>Màu Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !productSize && styles.inputError]} onPress={toggleSizeModal}>
                        {productSize != null ? (<Text>{productSizeName}</Text>) : (<Text>Chưa Chọn Màu Sản Phẩm</Text>)}
                    </TouchableOpacity>
                    <Size
                        isVisible={isSizeModal}
                        onClose={toggleSizeModal}
                        onReset={handleResetFilters}
                        onApply={(selectedSizeId, selectedSizeName) => {
                            setProductSize(selectedSizeId);
                            const selectedSizeNames = selectedSizeName.join(', ');
                            setProductSizeName(selectedSizeNames);

                        }}
                    />
                    <Text style={styles.label}>Coupon: </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15, }}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setProductCoupon(NO_COUPON)}
                        >
                            <Icon
                                name={productCoupon === NO_COUPON ? 'dot-circle-o' : 'circle-o'}
                                size={25}
                                color="#3669c9"
                            />
                            <Text style={styles.radioText}>Không Coupon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setProductCoupon(HAVE_COUPON)}
                        >
                            <Icon
                                name={productCoupon === HAVE_COUPON ? 'dot-circle-o' : 'circle-o'}
                                size={25}
                                color="#3669c9"
                            />
                            <Text style={styles.radioText}>Có Coupon</Text>
                        </TouchableOpacity>
                    </View>
                    {renderInputForCoupon()}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleAddProduct} disabled={isLoading}>
                <Text style={styles.buttonText}>Thêm</Text>
            </TouchableOpacity>

            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#3669c9" />
                </View>
            )}
            <AlertComponent
                title={alertType === 'success' ? "Success" : "Error"}
                description={
                    alertType === 'success'
                        ? "Product added successfully."
                        : "Thêm Thất Bại!! Vui Lòng Thử Lại"
                }
                alertType={alertType}
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
            />
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
        backgroundColor: '#f5f5f5',
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
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    input: {
        position: 'relative',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: 'red',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
});

export default AddProductScreen;