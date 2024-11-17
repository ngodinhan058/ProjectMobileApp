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
            selectedImages.forEach((image, index) => {
                if (image) {
                    const imageUri = image instanceof Object ? image.uri : image;
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
                    <TouchableOpacity style={[styles.input, !parentCategoryName && styles.inputError]} onPress={toggleFilterModal}>
                        {categories ? <Text>Đã Chọn Danh Mục Sản Phẩm</Text> : <Text>Chưa Chọn Danh Mục Sản Phẩm</Text>}
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
        paddingTop: 40,
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
});

export default EditProductScreen;
