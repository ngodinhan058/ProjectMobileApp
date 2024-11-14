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

const EditProductScreen = ({ route, navigation }) => {
    const { product, postDTO } = route.params || {}; // Lấy dữ liệu sản phẩm từ `route.params`

    const [isLoading, setIsLoading] = useState(false);
    const [productId, setProductId] = useState(product?.productId);
    const [categories, setCategories] = useState(product?.categories);
    const [selectedImages, setSelectedImages] = useState(product?.productImages || []);
    const [productSupplier, setProductSupplier] = useState(product?.productSupplier?.productSupplierSd);
    const [productSupplierName, setProductSupplierName] = useState(product?.productSupplier?.productSupplierName);
    const [parentCategoryId, setParentCategoryId] = useState(categories.map(category => category.categoryId));
    const [parentCategoryName, setParentCategoryName] = useState(product?.categories?.categoryName || null);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isSupplierModal, setIsSupplierModal] = useState(false);


    const [productData, setProductData] = useState({
        productName: product?.productName || '',
        productYearOfManufacture: product?.productYearOfManufacture || 2024,
        sizesProduct: product?.sizesProduct || [
            { sizeId: "00000000-0000-0000-0000-000000000000", productQuantity: 10 }
        ],
        productImages: { productImageAlt: "Image of product" },
        post: { postContent: postDTO?.postContent, postName: postDTO?.postName } || {},
    });
    const [error, setError] = useState({
        productNameError: false,
    });
    console.log(categories);
    const handleUpdateProduct = async () => {
        setIsLoading(true);
        const formData = new FormData();
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


        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((imageUri, index) => {
                if (imageUri) {
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
            const response = await fetch(`${BASE_URL}product/${productId}`, {
                method: 'PUT',
                body: formData,
            });
            if (response.status === 200) {
                Alert.alert('Success', 'Product updated successfully.');
                navigation.replace('ProductList');
            } else {
                Alert.alert('Error', `Failed to update product. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            Alert.alert('Error', 'Unable to update product due to a network error.');
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        setError({
            productNameError: productData.productName === '',
        });
    }, [productData.productName]);

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
                    <Text style={styles.textHeader}>Chỉnh Sửa Thông Tin Sản Phẩm</Text>
                </View>

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
                    <TouchableOpacity style={[styles.input, !parentCategoryName && styles.inputError]} onPress={toggleFilterModal}>
                        {categories ? <Text>Đã Chọn Danh Mục Sản Phẩm</Text> : <Text>Chưa Chọn Danh Mục Sản Phẩm</Text>}
                    </TouchableOpacity>

                    <SelectorInCategory
                        isVisible={isFilterModalVisible}
                        categoriesProduct={categories.map(category => category.categoryId)}
                        onClose={toggleFilterModal}
                        onApply={(selectedParent, selectedParentName) => {
                            setParentCategoryId(selectedParent);

                            // Hiển thị danh sách tên đã chọn ngay lập tức
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
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageIcon: {
        width: 155,
        height: 140,
        marginVertical: 20,
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm nền modal tối
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
    icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    iconCenter: {
        width: 20,
        height: 20,
        position: 'absolute',
        alignContent: 'center',
        top: 15,
    },

});

export default EditProductScreen;
