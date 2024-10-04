import React, { useState } from 'react';
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
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker'; // Thêm import này

const AddProductScreen = ({ route, navigation }) => {

    const categories = ['Apple', 'Vivo', 'Samsung', 'Xiaomi'];

    const { query } = route.params || {}; // Kiểm tra xem `query` có tồn tại hay không
    const [searchQuery, setSearchQuery] = useState(''); // Lưu trữ trạng thái cho thanh tìm kiếm

    // Lọc các danh mục theo thanh tìm kiếm
    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearchQuery(value);
    };

    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productSale, setProductSale] = useState('');
    const [productDetails, setProductDetails] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Chọn loại sản phẩm');
    const [selectedImage, setSelectedImage] = useState(null); // Trạng thái lưu trữ hình ảnh
    const [imageModalVisible, setImageModalVisible] = useState(false);

    const handleSelect = (value) => {
        setSelectedValue(value);
        setModalVisible(false);
    };

    const openImagePicker = async (option) => {
        if (option === 'library') {
            // Kiểm tra trạng thái quyền truy cập thư viện ảnh
            const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                // Nếu chưa cấp quyền, yêu cầu quyền truy cập
                const notificationResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!notificationResult.granted) {
                    alert('Quyền truy cập thư viện ảnh bị từ chối! Vui lòng kích hoạt quyền trong cài đặt.');
                    return;
                }
            }
    
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri); // Lưu đường dẫn hình ảnh đã chọn
            }
        } else if (option === 'camera') {
            // Kiểm tra trạng thái quyền truy cập máy ảnh
            const { status } = await ImagePicker.getCameraPermissionsAsync();
            if (status !== 'granted') {
                // Nếu chưa cấp quyền, yêu cầu quyền truy cập
                const notificationResult = await ImagePicker.requestCameraPermissionsAsync();
                if (!notificationResult.granted) {
                    alert('Quyền truy cập máy ảnh bị từ chối! Vui lòng kích hoạt quyền trong cài đặt.');
                    return;
                }
            }
    
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
    
            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri); // Lưu đường dẫn hình ảnh chụp được
            }
        }
    
        setImageModalVisible(false); // Đóng modal sau khi chọn ảnh
    };
    


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
                {/* Icon Image */}
                <View style={styles.imageContainer}>


                    <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                        {selectedImage ? (
                            <Image
                                source={{ uri: selectedImage }} // Hiển thị hình ảnh đã chọn
                                style={styles.imageIcon}
                            />
                        ) : (
                            <Image
                                source={require('../../../assets/upload_image_icon.png')} // Thay bằng đường dẫn tới ảnh của bạn
                                style={styles.imageIcon}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {/* Modal chọn thư viện hoặc camera */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={imageModalVisible}
                    onRequestClose={() => setImageModalVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalView}>
                                <TouchableOpacity onPress={() => openImagePicker('camera')} style={styles.modalItem}>
                                    <Text style={styles.modalText}>Chụp ảnh</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => openImagePicker('library')} style={styles.modalItem}>
                                    <Text style={styles.modalText}>Chọn từ thư viện</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.button}>
                                    <Text style={styles.buttonText}>Đóng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <TouchableOpacity style={styles.buttonPost} onPress={() => navigation.navigate('AddPostScreen')}>
                    <Text style={styles.buttonText}>Thêm Post</Text>
                </TouchableOpacity>

                {/* Product Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Tên Sản Phẩm"
                        value={productName}
                        onChangeText={setProductName}
                    />
                    <Text style={styles.label}>Giá Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Giá Sản Phẩm"
                        value={productPrice}
                        onChangeText={setProductPrice}
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Số Lượng Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Số Lượng Sản Phẩm"
                        value={productQuantity}
                        onChangeText={setProductQuantity}
                        keyboardType="numeric"
                    />
                    <Text style={styles.label}>Giảm Giá Sản Phẩm:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Giảm Giá Sản Phẩm"
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
                    <TouchableOpacity style={styles.button} onPress={() => alert('Product Added/Edited')}>
                        <Text style={styles.buttonText}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

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
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageIcon: {
        width: 155,
        height: 140,
        marginVertical: 20,
    },
    imageSelectIcon: {
        width: 200,
        height: 140,

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
});

export default AddProductScreen;
