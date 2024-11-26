import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    TextInput,
    Pressable,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadImage from '../../../components/Up_Image_Multi';
import SelectorInCategory from '../../../components/SelectorInCategory';
import Supplier from '../../../components/Supplier';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';
import Size from '../../../components/Size';
import DateTimePicker from '@react-native-community/datetimepicker';


const EditProductScreen = ({ route, navigation }) => {
    const { product, postDTO } = route.params || {}; // Lấy dữ liệu sản phẩm từ `route.params`
    const NO_COUPON = 0;
    const HAVE_COUPON = 1;
    const COUPON_PER_HUNDRED_TYPE = 0;
    const COUPON_PRICE_TYPE = 1;
    const COUPON_SHIP_TYPE = 2;

    const [productCoupon, setProductCoupon] = useState();
    const [couponId, setCouponId] = useState(product?.coupon?.couponId || '');
    const [couponName, setCouponName] = useState(product?.coupon?.couponName || '');
    const [couponCode, setCouponCode] = useState(product?.coupon?.couponCode || '');
    const [couponRelease, setCouponRelease] = useState(new Date(product?.coupon?.couponRelease));
    const [couponExpire, setCouponExpire] = useState(new Date(product?.coupon?.couponExpire));
    const [couponQuantity, setCouponQuantity] = useState(product?.coupon?.couponQuantity.toString() || '');
    const [couponPerHundred, setCouponPerHundred] = useState(product?.coupon?.couponPerHundred.toString() || '');
    const [couponPrice, setCouponPrice] = useState(product?.coupon?.couponPrice.toString() || '');
    const [couponFeeShip, setCouponFeeShip] = useState(product?.coupon?.couponFeeShip.toString() || '');
    const [couponType, setCouponType] = useState(product?.coupon?.couponType)

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDatePickerExpire, setShowDatePickerExpire] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [productId, setProductId] = useState(product?.productId);
    const [categories, setCategories] = useState(product?.categories);
    const [sizes, setSizes] = useState(product?.productSizes);

    const [selectedImages, setSelectedImages] = useState(product?.productImages || []);

    const [productSupplier, setProductSupplier] = useState(product?.productSupplier?.productSupplierSd);
    const [productSupplierName, setProductSupplierName] = useState(product?.productSupplier?.productSupplierName);

    const [parentCategoryId, setParentCategoryId] = useState(categories.map(category => category.categoryId));
    const [parentCategoryName, setParentCategoryName] = useState((categories.map(category => category.categoryName)).join(', ') || null);

    const [parenSizesId, setProductSizesId] = useState(sizes.map(size => size.productSizeId));
    const [productSizesName, setProductSizesName] = useState((sizes.map(size => size.productSizeName)).join(', ') || null);

    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isSizeModal, setIsSizeModal] = useState(false);
    const [isSupplierModal, setIsSupplierModal] = useState(false);

    const [productData, setProductData] = useState({
        productName: product?.productName || '',
        productYearOfManufacture: product?.productYearOfManufacture || 2024,
        productImages: { productImageAlt: "Image of product" },
        post: { postContent: postDTO?.postContent, postName: postDTO?.postName } || {},
    });
    const [error, setError] = useState({
        productNameError: false,
    });
    // console.log(categories);
    useEffect(() => {
        if (product?.coupon?.couponId != null) {
            setProductCoupon(HAVE_COUPON)
        } else {
            setProductCoupon(NO_COUPON)
            setCouponRelease(new Date())
            setCouponExpire(new Date())
        }


    }, [product?.coupon?.couponId]);
    // console.log("couponRelease", couponRelease);

    const handleUpdateProduct = async () => {
        const couponReleaseDate = couponRelease.toISOString().split('T')[0]; // Định dạng lại ngày
        console.log("couponReleaseDate", couponReleaseDate);

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
            formData.append('paramsJson', JSON.stringify(params));
            console.log("HAVECOUPONadd", params);


        }
        else {
            const apiUrl = `${BASE_URL}coupon/${couponId}`;
            await axios.delete(apiUrl);
            // Alert.alert('Thành công', 'Coupon đã được xoá');
            console.log('Xoá coupon.');
            console.log(couponId);
            const params = {
                productName: productData.productName,
                productYearOfManufacture: productData.productYearOfManufacture,
                sizesProduct: productData.sizesProduct,
                productSupplier: productSupplier,
                categories: parentCategoryId,
                post: postDTO,
                productImage: productData.productImages,
            };
            formData.append('paramsJson', JSON.stringify(params));
            console.log("NOCOUPONadd", params);


        }

        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((image, index) => {
                if (image) {
                    const imageUri = image instanceof Object ? image.productImagePath : image;
                    const fileType = imageUri.split('.').pop();
                    const newFile = {
                        uri: imageUri,
                        name: `product-image-${index}.${fileType}`,
                        type: `image/${fileType}`,
                    };
                    formData.append('file', newFile);
                }
            });
        }
        try {
            const response = await axios.put(`${BASE_URL}product/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            });
            if (response.status === 200) {
                // setAlertVisible(true);
                // setAlertType('success');
                navigation.replace('ProductList', {
                    alertVisible: true,
                    alertType: 'success',
                    title: 'Sửa Sản Phẩm Thành Công,'
                });
            } else {
                Alert.alert('Error', `Failed to update product. Status: ${response.status}`);
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Error response:', error.response);
                Alert.alert('Error', `Failed to update product. Status: ${error.response.status}`);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
                Alert.alert('Error', 'No response from server. Please try again later.');
            } else {
                // Something else happened while setting up the request
                console.error('Error message:', error.message);
                Alert.alert('Error', 'Unable to update product due to a network error.');
            }
        } finally {
            setIsLoading(false);
        }

    };


    useEffect(() => {
        setError({
            productNameError: productData.productName === '',
        });
        setProductData((prevData) => ({
            ...prevData,

            sizesProduct: parenSizesId ? parenSizesId.map(id => ({ sizeId: id })) : null,
        }));

    }, [productData.productName, parenSizesId]);
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
    };
    // console.log(parenSizesId);

    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Chỉnh Sửa Thông Tin Sản Phẩm</Text>
                </LinearGradient>
                <UploadImage onImagesSelected={setSelectedImages} initialImages={selectedImages} />
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    <TextInput
                        style={[styles.input, error.productNameError && styles.inputError]}
                        placeholder="Sửa Tên Sản Phẩm"
                        value={productData.productName}
                        onChangeText={(text) => setProductData({ ...productData, productName: text })}
                    />
                    <Text style={styles.label}>Post Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !postDTO && styles.inputError]} onPress={() => navigation.navigate('EditPostScreen', { savedData: { postName: postDTO?.postName, postContent: postDTO?.postContent } })}>
                        {postDTO ? <Text>Đã Thêm Post Sản Phẩm</Text> : <Text>Chưa Thêm Post Sản Phẩm</Text>}
                    </TouchableOpacity>
                    <Text style={styles.label}>Danh Mục Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !categories && styles.inputError]} onPress={toggleFilterModal}>
                        {categories ? <Text>{parentCategoryName}</Text> : <Text>Chưa Chọn Danh Mục Sản Phẩm</Text>}
                    </TouchableOpacity>
                    <SelectorInCategory
                        isVisible={isFilterModalVisible}
                        categoriesProduct={categories.map(category => category.categoryId)}
                        onClose={toggleFilterModal}
                        onApply={(selectedParent, selectedParentName) => {
                            setParentCategoryId(selectedParent);
                            const selectedCategoryNames = selectedParentName.join(', ');
                            setParentCategoryName(selectedCategoryNames);
                        }}
                    />
                    <Text style={styles.label}>Thương Hiệu Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !productSupplier && styles.inputError]} onPress={toggleSupplierModal}>
                        {productSupplierName != null ? (<Text>{productSupplierName}</Text>) : (<Text>Chưa Chọn Thương Hiệu Sản Phẩm</Text>)}
                    </TouchableOpacity>
                    <Supplier
                        isVisible={isSupplierModal}
                        onClose={toggleSupplierModal}
                        selectedProductSupplierSd={productSupplier}
                        onReset={handleResetFilters}
                        onApply={(selectedFilters) => {
                            setProductSupplier(selectedFilters.suppliers);
                            setProductSupplierName(selectedFilters.suppliersName);
                        }}
                    />
                    <Text style={styles.label}>Màu Sản Phẩm:</Text>
                    <TouchableOpacity style={[styles.input, !sizes && styles.inputError]} onPress={toggleSizeModal}>
                        {parenSizesId != null ? (<Text>{productSizesName}</Text>) : (<Text>Chưa Chọn Màu Sản Phẩm</Text>)}
                    </TouchableOpacity>
                    <Size
                        isVisible={isSizeModal}
                        onClose={toggleSizeModal}
                        onReset={handleResetFilters}
                        selectedproductSizeId={parenSizesId}
                        onApply={(selectedSizeId, selectedSizeName) => {
                            setProductSizesId(selectedSizeId);
                            const selectedSizeNames = selectedSizeName.join(', ');
                            setProductSizesName(selectedSizeNames);

                        }}

                    />
                    <Text style={styles.label}>Coupon: </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15,}}>
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
            <TouchableOpacity style={styles.button} onPress={handleUpdateProduct} disabled={isLoading}>
                <Text style={styles.buttonText}>Cập Nhật</Text>
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

export default EditProductScreen;
