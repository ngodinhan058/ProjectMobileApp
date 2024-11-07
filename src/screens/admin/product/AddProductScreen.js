import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadImage from '../../../components/Up_Image_Multi';
import SelectorInCategory from '../../../components/SelectorInCategory';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const AddProductScreen = ({ route, navigation }) => {
    const [productSupplier, setProductSupplier] = useState([]); // Dữ liệu sản phẩm
    const [parentCategoryId, setParentCategoryId] = useState([]);
    const [parentCategoryName, setParentCategoryName] = useState();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const fetchData = async () => {
        try {
            const supplierApiUrl = `${BASE_URL}product-suppliers/category`;
            const categoriesApiUrl = `${BASE_URL}categories`;

            const [supplierResponse, categoriesResponse] = await Promise.all([
                axios.get(supplierApiUrl),
                axios.get(categoriesApiUrl),
            ]);

            const supplierData = supplierResponse.data.data;
            const categoriesData = categoriesResponse.data.data;
            setProductSupplier(supplierData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const { postDTO } = route.params || {};

    const [productData, setProductData] = useState({
        productName: '',
        productPrice: '',
        productQuantity: 0,
        productSale: '',
        productImages: [
            {
                productImagePath: "img/20210410_zOS3hu3lOAH3RLHxZKRgrGz9.jpg",
                productImageAlt: "Image of product",
                productImageIndex: 1
            }
        ],
        productYearOfManufacture: 2024,
        productSizes: ["003c6e39-fdd2-345c-8d87-6e6543f34567", "002b5d28-fdd1-234b-7c98-7d5432f23456"],
        supplierId: "06000000-0000-0000-0000-000000000000",
        categories: parentCategoryId,
        post: postDTO || {},
        coupon: {
            couponName: "Discount Sale",
            couponCode: "DISCOUNT2024",
            couponRelease: "2024-01-01",
            couponExpire: "2024-12-31",
            couponQuantity: 100,
            couponPerHundred: 10.0,
            couponType: 1
        }
    })
    const [error, setError] = useState({
        productPriceError: false,
        productQuantityError: false,
        productSaleError: false,
        productNameError: false
    });
    const handleAddProduct = async () => {
        let hasError = false;
        if (productData.productPrice <= 0 || isNaN(productData.productPrice)) {
            setError((prev) => ({ ...prev, productPriceError: true }));
            hasError = true;
        } else {
            setError((prev) => ({ ...prev, productPriceError: false }));
        }

        if (productData.productQuantity <= 0 || isNaN(productData.productQuantity)) {
            setError((prev) => ({ ...prev, productQuantityError: true }));
            hasError = true;
        } else {
            setError((prev) => ({ ...prev, productQuantityError: false }));
        }

        if (productData.productSale < 0 || productData.productSale > 100 || isNaN(productData.productSale)) {
            setError((prev) => ({ ...prev, productSaleError: true }));
            hasError = true;
        } else {
            setError((prev) => ({ ...prev, productSaleError: false }));
        }

        if (productData.productName === '') {
            setError((prev) => ({ ...prev, productNameError: true }));
            hasError = true;
        } else {
            setError((prev) => ({ ...prev, productNameError: false }));
        }

        if (hasError) {
            return; // Dừng lại nếu có lỗi
        }



        if (!productData.post || Object.keys(productData.post).length === 0) {
            Alert.alert("Thông báo", "Chưa thêm thông tin bài đăng (post)");
            return;
        }
        try {
            console.log("12321321", productData);

            // Gửi yêu cầu POST tới API
            const response = await axios.post(`${BASE_URL}product`, productData);

            // Kiểm tra kết quả trả về từ API
            if (response.status === 201) {
                Alert.alert('Thành công', 'sản phẩm đã được thêm.');
                navigation.replace("ProductList")
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể thêm sản phẩm.');
        }
    };
    const handleQuantityChange = (operation) => {
        let newQuantity = parseInt(productData.productQuantity);
        if (operation === "increase") {
            newQuantity += 1;
        } else if (operation === "decrease") {
            newQuantity = Math.max(0, newQuantity - 1); // Đảm bảo không giảm dưới 0
        }

        // Cập nhật lại state cho số lượng sản phẩm
        setProductData({ ...productData, productQuantity: newQuantity.toString() });
    };

    useEffect(() => {

        if (postDTO) {
            setProductData((prevData) => ({
                ...prevData,
                categories: parentCategoryId,
                post: postDTO
            }));
        }
    }, [postDTO]);
    const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);

    const handleResetFilters = () => { setParentCategoryId(null), setParentCategoryName(null) };
    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Thêm Thông Tin Sản Phẩm</Text>
                </View>
                <TouchableOpacity style={styles.buttonPost} onPress={() => navigation.navigate('AddPostScreen', { savedData: postDTO })}>
                    <Text style={styles.buttonText}>Thêm Post</Text>
                </TouchableOpacity>

                {/* Form sản phẩm */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    <TextInput
                        style={[styles.input, error.productNameError && styles.inputError]}
                        placeholder="Thêm Tên Sản Phẩm"
                        value={productData.postName}
                        onChangeText={(text) => setProductData({ ...productData, productName: text })}
                    />
                    <Text style={styles.label}>Giá Sản Phẩm:</Text>
                    <TextInput
                        style={[styles.input, error.productNameError && styles.inputError]}
                        placeholder="Thêm Giá Sản Phẩm"
                        value={productData.productPrice}
                        onChangeText={(text) => setProductData({ ...productData, productPrice: text })}
                        keyboardType="numeric"
                    />
                    <View style={styles.quantityContainer}>
                        <Text style={styles.label}>Số Lượng Sản Phẩm:</Text>
                        <View style={styles.quantityWrapper}>
                            <TouchableOpacity
                                style={styles.quantityPlus}
                                onPress={() => handleQuantityChange("increase")}
                            >
                                <Text style={styles.buttonIcon}>▲</Text>
                            </TouchableOpacity>

                            <TextInput
                                style={[styles.input, error.productQuantityError && styles.inputError]}
                                placeholder="Thêm Số Lượng Sản Phẩm"
                                value={productData.productQuantity}
                                onChangeText={(text) => setProductData({ ...productData, productQuantity: text })}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                style={styles.quantityMinus}
                                onPress={() => handleQuantityChange("decrease")}
                            >
                                <Text style={styles.buttonIcon}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.label}>Giảm Giá Sản Phẩm:</Text>
                    <TextInput
                        style={[styles.input, error.productNameError && styles.inputError]}
                        placeholder="Thêm Giảm Giá Sản Phẩm"
                        value={productData.productSale}
                        onChangeText={(text) => setProductData({ ...productData, productSale: text })}
                        keyboardType="numeric"
                    />

                    {/* Danh mục sản phẩm */}
                    <Text style={styles.label}>Danh Mục Sản Phẩm:</Text>
                    {/* Chọn danh mục cha */}
                    <TouchableOpacity style={styles.input} onPress={toggleFilterModal}>
                        {parentCategoryName ? (<Text>{parentCategoryName}</Text>) : (<Text>Chưa Chọn Danh Mục Sản Phẩm</Text>)}
                    </TouchableOpacity>
 
                    {/* Modal để chọn danh mục cha */}
                    <SelectorInCategory
                        isVisible={isFilterModalVisible}
                        onClose={toggleFilterModal}
                        onReset={handleResetFilters}
                        onApply={(selectedParent, selectedParentName) => {
                            setParentCategoryId(selectedParent);
                            setParentCategoryName(selectedParentName);
                        }}
                    />


                    {/* Add/Edit Button */}
                    <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
                        <Text style={styles.buttonText}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};
// <UploadImage />

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 20,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
    },
    backButton: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 10,
    },
    imageContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    selectedImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    formContainer: {
        flex: 1,
    },
    quantityContainer: {
        marginBottom: 20,
    },

    quantityPlus: {
        position: 'absolute',
        right: 10,
        top: 0,
        zIndex: 99,
    },
    quantityMinus: {
        position: 'absolute',
        right: 10,
        bottom: 15,
        zIndex: 99,
    },
    input: {
        position: 'relative',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
    },
    buttonIcon: {
        color: '#3669c9',
        fontSize: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    dropdown: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    selectedValue: {
        fontSize: 16,
    },
    modalView: {
        position: 'absolute',
        width: '90%',
        marginHorizontal: 20,
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 400
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    modalText: {
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#3669c9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        width: '100%',
        backgroundColor: '#cccccc',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonPost: {
        width: '40%',
        backgroundColor: '#3669c9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: '60%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    searchBar: {
        position: 'relative',
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 10,
    },
});

export default AddProductScreen;
