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
import AlertComponent from '../../../components/AlertComponent';

const AddProductScreen = ({ route, navigation }) => {
    const [productSupplier, setProductSupplier] = useState();
    const [productSupplierName, setProductSupplierName] = useState();
    const [parentCategoryId, setParentCategoryId] = useState(null);
    const [parentCategoryName, setParentCategoryName] = useState(null);
    const [productSize, setProductSize] = useState(null);
    const [productSizeName, setProductSizeName] = useState(null);
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
        }
    });
    // console.log(productData);

    const [error, setError] = useState({
        productNameError: false
    });


    const handleAddProduct = async () => {
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
        formData.append('params', JSON.stringify(params));

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
                });
            }
            else{
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
            setProductData((prevData) => ({
                ...prevData,
                categories: parentCategoryId,
                post: postDTO,
                productSupplier: productSupplier,
                sizesProduct: productSize ? productSize.map(id => ({ sizeId: id })) : null,
            }));
        }
    }, [postDTO, productData.productName, productSize, parentCategoryId]);

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
                        : "Failed to add product. Please try again."
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
});

export default AddProductScreen;