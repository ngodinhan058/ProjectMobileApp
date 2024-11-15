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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import SelectorInCategory from '../../../components/SelectorInCategory';
import Supplier from '../../../components/Supplier';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

import UploadImage from '../../../components/Up_Image_Multi';
const AddProductScreen = ({ route, navigation }) => {
    const [productSupplier, setProductSupplier] = useState();
    const [productSupplierName, setProductSupplierName] = useState();
    const [parentCategoryId, setParentCategoryId] = useState(null);
    const [parentCategoryName, setParentCategoryName] = useState(null);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isSupplierModal, setIsSupplierModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const { postDTO } = route.params || {};

    const [productData, setProductData] = useState({
        productName: '',
        productYearOfManufacture: 2024,
        sizesProduct: [
            {
                sizeId: "00000000-0000-0000-0000-000000000000"
            }
        ],
        productSupplier: productSupplier,
        categories: parentCategoryId,
        post: postDTO || {},
        productImages: {
            productImageAlt: "Image of product",
        }
    });

    const [error, setError] = useState({
        productNameError: false
    });

    const handleAddProduct = async () => {
        setIsLoading(true);  // Set loading to true when starting the request
        const formData = new FormData();
        const params = {
            productName: productData.productName,
            productYearOfManufacture: productData.productYearOfManufacture,
            sizesProduct: productData.sizesProduct,
            productSupplier: productSupplier,
            categories: parentCategoryId,
            post: postDTO,
            productImage: productData.productImages,
        }
        // Thêm thông tin sản phẩm vào FormData
        formData.append('params', JSON.stringify(params));

        // Thêm từng file ảnh vào FormData
        selectedImages.forEach((imageUri, index) => {
            const fileType = imageUri.split('.').pop();
            const newFile = {
                uri: imageUri,
                name: `product-image-${index}.${fileType}`,
                type: `image/${fileType}`,
            };
            console.log('formData:', imageUri);
            formData.append('file', newFile);
        });
        console.log('formData:', formData);
        try {
            const response = await fetch(`${BASE_URL}product`, {
                method: 'POST',
                body: formData,

            });
            console.log('response:', response.status);
            if (response.status === 201) {
                Alert.alert('Success', 'Product added successfully.');
                navigation.replace('ProductList');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            Alert.alert('Error', 'Unable to add product due to a network error.');
        } finally {
            setIsLoading(false);  // Set loading to false when request completes
        }
    };



    useEffect(() => {
        setError({
            productNameError: productData.productName === ''
        });
        if (postDTO) {
            setProductData((prevData) => ({
                ...prevData,
                categories: parentCategoryId,
                post: postDTO,
                productSupplier: productSupplier,
            }));
        }
    }, [postDTO, productData.productName]);

    const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);
    const toggleSupplierModal = () => setIsSupplierModal(!isSupplierModal);

    const handleResetFilters = () => {
        setParentCategoryId(null);
        setParentCategoryName(null);
    };
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Thêm Thông Tin Sản Phẩm</Text>
                </View>

                <UploadImage onImagesSelected={setSelectedImages} />
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    <TextInput
                        style={[styles.input, error.productNameError && styles.inputError]}
                        placeholder="Thêm Tên Sản Phẩm"
                        value={productData.postName}
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
                            // Hiển thị danh sách tên đã chọn ngay lập tức
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
        </View>
    );
};


const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền mờ
        justifyContent: 'center', // Căn giữa theo chiều dọc
        alignItems: 'center',    // Căn giữa theo chiều ngang
        zIndex: 1,               // Đưa overlay lên trên
    },
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
