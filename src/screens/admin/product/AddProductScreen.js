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
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const AddProductScreen = ({ route, navigation }) => {

    const categories = ['Apple', 'Vivo', 'Samsung', 'Xiaomi'];

    const { postDTO } = route.params || {};
    const { query } = route.params || {};
    const [searchQuery, setSearchQuery] = useState('');
    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearchQuery(value);
    };

    // const [productName, setProductName] = useState('');
    // const [productPrice, setProductPrice] = useState('');
    // const [productQuantity, setProductQuantity] = useState('0');
    // const [productSale, setProductSale] = useState('');
    // const [productImg, setProductImg] = useState([]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Chọn loại sản phẩm');

    const handleSelect = (value) => {
        setSelectedValue(value);
        setModalVisible(false);
    };
    const [productData, setProductData] = useState({
        productName: '',
        productPrice: '',
        productQuantity: '',
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
        categories: ["01233300-0000-0000-0000-000000000000"],
        postDTO: postDTO || {}
    })
    const handleAddProduct = async () => {
        if (!productData.postDTO || Object.keys(productData.postDTO).length === 0) {
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
    useEffect(() => {
        console.log(postDTO);

        if (postDTO) {
            setProductData((prevData) => ({
                ...prevData,
                postDTO: postDTO
            }));
        }
    }, [postDTO]);
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
                    {/* <Text style={styles.label}>Ảnh Sản Phẩm: (Link)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Ảnh Sản Phẩm"
                        value={productImg}
                        onChangeText={setProductImg}
                    /> */}
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Tên Sản Phẩm"
                        value={productData.postName}
                        onChangeText={(text) => setProductData({ ...productData, productName: text })}
                    />
                    <Text style={styles.label}>Giá Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Giá Sản Phẩm"
                        value={productData.productPrice}
                        onChangeText={(text) => setProductData({ ...productData, productPrice: text })}
                        keyboardType="numeric"
                    />
                    <View style={styles.quantityContainer}>
                        <Text style={styles.label}>Số Lượng Sản Phẩm:</Text>
                        <View style={styles.quantityWrapper}>
                            <TouchableOpacity style={styles.quantityPlus} onPress={() => setProductQuantity((prev) => parseInt(prev) + 1)}>
                                <Text style={styles.buttonIcon}>▲</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                placeholder="Thêm Số Lượng Sản Phẩm"
                                value={productData.productQuantity}
                                onChangeText={(text) => setProductData({ ...productData, productQuantity: text })}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity style={styles.quantityMinus} onPress={() => setProductQuantity((prev) => Math.max(0, parseInt(prev) - 1))}>
                                <Text style={styles.buttonIcon}>▼</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.label}>Giảm Giá Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Giảm Giá Sản Phẩm"
                        value={productData.productSale}
                        onChangeText={(text) => setProductData({ ...productData, productSale: text })}
                        keyboardType="numeric"
                    />

                    {/* Danh mục sản phẩm */}
                    <Text style={styles.label}>Danh Mục Sản Phẩm:</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.selectedValue}>{selectedValue}</Text>
                    </TouchableOpacity>

                    {/* Modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}>
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalView}>
                                    <View style={styles.searchBar}>
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Tìm kiếm danh mục"
                                            value={searchQuery}
                                            onChangeText={handleSearch}
                                        />
                                    </View>
                                    <FlatList
                                        data={filteredCategories}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.modalItem}>
                                                <Text style={styles.modalText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

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
