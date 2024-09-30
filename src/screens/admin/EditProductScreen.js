import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    Pressable,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';


const EditProductScreen = ({ navigation }) => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productSale, setProductSale] = useState('');
    const [productDetails, setProductDetails] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Chọn loại sản phẩm');

    const categories = ['Apple', 'Vivo', 'Samsung', 'Xiaomi'];

    const handleSelect = (value) => {
        setSelectedValue(value);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Sửa Thông Tin Sản Phẩm</Text>
                   
                </View>

                {/* Icon Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/upload_image_icon.png')} // Thay bằng đường dẫn tới ảnh của bạn
                        style={styles.imageIcon}
                    />
                </View>

                {/* Product Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    {/* Product Name */}
                    <TextInput
                        style={styles.input}
                        placeholder="Add Product name"
                        value={productName}
                        onChangeText={setProductName}
                    />
                    <Text style={styles.label}>Giá Sản Phẩm:</Text>
                    {/* Product Price */}
                    <TextInput
                        style={styles.input}
                        placeholder="Add Product price"
                        value={productPrice}
                        onChangeText={setProductPrice}
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Số Lượng Sản Phẩm:</Text>
                    {/* Product Quantity */}
                    <TextInput
                        style={styles.input}
                        placeholder="Add Product quantity"
                        value={productQuantity}
                        onChangeText={setProductQuantity}
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Giảm Giá Sản Phẩm:</Text>
                    {/* Product Sale */}
                    <TextInput
                        style={styles.input}
                        placeholder="Add Product sale"
                        value={productSale}
                        onChangeText={setProductSale}
                        keyboardType="numeric"
                    />


                    {/* Product Category */}
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
                        <View style={styles.modalView}>
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelect(item)} style={styles.modalItem}>
                                        <Text style={styles.modalText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}><Text style={styles.buttonText}>Đóng</Text></TouchableOpacity>
                        </View>
                    </Modal>

                    {/* Add/Edit Button */}
                    <TouchableOpacity style={styles.button} onPress={() => alert('Product Added/Edited')}>
                        <Text style={styles.buttonText}>Sửa</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
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
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        justifyContent: 'center',
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
        top: '40%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 300
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',

    },
});

export default EditProductScreen;
