import { Alert } from 'react-native';
import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Pressable,
    FlatList,
    Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function DetailScreen({ navigation }) {
    // Modal Hiển Thị
    const ConfirmDialog = ({ isVisible, onClose, onConfirm }) => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Xác Nhận Đóng Gói và Chuyển Sang Shipper Phải Không</Text>
                        <View style={styles.buttonContainer}>
                            {/* Nút NO */}
                            <TouchableOpacity style={styles.noButton} onPress={onClose}>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}>NO</Text>
                            </TouchableOpacity>
                            {/* Nút YES */}
                            <TouchableOpacity style={styles.yesButton} onPress={onConfirm}>
                                <Text style={styles.buttonText}>YES</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
    // Sản Phẩm
    const products = [
        {
            id: '1', name: '#HWDSF776567DS', price: '1.500.000', quantity: 500, rating: '4.0',
            review: '860', sale: 80, category: 1, image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '2', name: '#Ha5s1d56sa7DS', price: '1.000.000', quantity: 500, rating: '3.0',
            review: '860', sale: 0, category: 2, image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '3', name: '#HADSAF776567DS', price: '500.000', quantity: 500, rating: '3.0',
            review: '860', sale: 50, category: 3, image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '4', name: '#HWDSF776567DS', price: '1.500.000', quantity: 500, rating: '4.0',
            review: '860', sale: 80, category: 1, image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '5', name: '#Ha5s1d56sa7DS', price: '1.000.000', quantity: 500, rating: '3.0',
            review: '860', sale: 0, category: 2, image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },
        {
            id: '6', name: '#HADSAF776567DS', price: '500.000', quantity: 500, rating: '3.0',
            review: '860', sale: 50, category: 3, image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
        },

    ];
    // checked Sản Phẩm
    const [selectedProducts, setSelectedProducts] = useState({});
    const toggleCheckbox = (productId) => {
        setSelectedProducts(prevState => ({
            ...prevState,
            [productId]: !prevState[productId] // nếu sản phẩm đã được chọn thì bỏ chọn, ngược lại thì chọn
        }));
    };
    // Kiểm tra tất cả sản phẩm có được chọn hay không
    const allProductsChecked = products.length > 0 && products.every(product => selectedProducts[product.id]);
    // Xuất ra ListSản Phẩm
    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => toggleCheckbox(item.id)}
        >

            <View style={{

                marginRight: 20,
            }}>
                <Image source={item.image} style={styles.productIcon} />
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>{item.name}</Text>
                <Text style={styles.productStatus}>Số Lượng: {item.quantity} cái</Text>
                <View style={styles.line}></View>
                <Text style={styles.productCode}>Giá: {item.price} ₫</Text>
            </View>
            {/* Custom checkbox */}
            <TouchableOpacity onPress={() => toggleCheckbox(item.id)} style={styles.checkboxContainer}>
                {/* Hiển thị checkbox dựa trên trạng thái đã chọn */}
                {selectedProducts[item.id] ? (
                    <View style={styles.checkedCheckbox} />
                ) : (
                    <View style={styles.uncheckedCheckbox} />
                )}
            </TouchableOpacity>

        </TouchableOpacity>



    );
    // State quản lý việc nút mở rộng được mở hay không
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0)); // giá trị hoạt ảnh
    const [rotation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        // Thực hiện animation
        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsOpen(!isOpen);

        // Thực hiện animation xoay icon
        Animated.timing(rotation, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true, // Để hiệu ứng xoay mượt hơn
        }).start();

        setIsOpen(!isOpen);
    };

    // Tạo hiệu ứng mở các nút theo chiều dọc
    const position1 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 160], // Chuyển từ vị trí của editButton lên trên
    });
    const position2 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 100], // Chuyển từ vị trí của editButton lên trên
    });
    // Tạo hiệu ứng xoay dựa trên giá trị của rotation
    const rotateIcon = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'], // Xoay 90 độ khi bấm
    });

    // Thao Tác Modal Hiển Thị
    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = () => {
        setModalVisible(false);
        navigation.navigate('SuccessScreen'); // Điều hướng sau khi xác nhận
    };



    return (
        <View style={styles.container}>


            {/* Product List Title */}
            <View style={{ position: 'relative', marginBottom: 30 }}>
                <Pressable style={styles.menuIcon} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={35} color="#000" />
                </Pressable>

                <Text style={styles.productListTitle}>Chi Tiết Trong Đơn</Text>

                {/* Checkbox chọn tất cả */}
                <Pressable
                    style={{
                        position: 'absolute', right: 0, top: 5, width: 25,
                        height: 25,
                        borderWidth: 2,
                        borderColor: '#000', justifyContent: 'center',
                        alignItems: 'center',

                        borderRadius: 5,
                    }}  // Căn phải ở trên cùng
                    onPress={() => {
                        // Toggle giữa trạng thái chọn tất cả hoặc bỏ chọn tất cả
                        const isAllChecked = products.every(product => selectedProducts[product.id]);
                        setSelectedProducts(products.reduce((acc, product) => {
                            acc[product.id] = !isAllChecked; // Nếu đã chọn hết, bỏ chọn, ngược lại thì chọn tất cả
                            return acc;
                        }, {}));
                    }}
                >
                    {
                        products.every(product => selectedProducts[product.id]) ? (
                            <View style={styles.checkedCheckbox} />  // Hiển thị khi tất cả được chọn
                        ) : (
                            <View style={styles.uncheckedCheckbox} />  // Hiển thị khi chưa chọn tất cả
                        )
                    }
                </Pressable>
            </View>



            {/* Product List */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                style={styles.productList}
            />



            {/* Add Button */}
            <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                <Animated.Text style={[styles.editButtonText, { transform: [{ rotate: rotateIcon }] }]}>
                    ▶
                </Animated.Text>
            </TouchableOpacity>

            {/* Các nút con */}
            <Animated.View style={[styles.subButtonPen, { bottom: position2 }]}>
                <TouchableOpacity
                    style={[
                        styles.iconButton,
                        { backgroundColor: allProductsChecked ? '#3669c9' : '#ccc' }  // Đổi màu nếu đã chọn hết sản phẩm
                    ]}
                    onPress={() => {
                        if (allProductsChecked) {
                            setModalVisible(true);  // Chỉ mở modal khi tất cả sản phẩm đã được chọn
                        }
                    }}
                    disabled={!allProductsChecked}  // Chỉ cho phép bấm khi tất cả sản phẩm đã được chọn
                >
                    <Icon name="check" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.subButton, { bottom: position1 }]}>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="trash" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
            {/* Modal confirm */}
            <ConfirmDialog
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleConfirm}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 20,

    },
    checkboxContainer: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5,
    },
    uncheckedCheckbox: {
        width: 14,
        height: 14,
        backgroundColor: 'transparent',
        borderRadius: 14,
    },
    checkedCheckbox: {
        width: 12,
        height: 12,
        backgroundColor: '#3669c9',
        borderRadius: 3,
    },
    line: {
        width: '95%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 10,
    },
    iconHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 10,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: 10,
    },
    productImgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 200,
        position: 'relative',
    },
    productImg: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    numberOfImage: {
        position: 'absolute',
        left: '10%',
        bottom: '10%',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    productInfo: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },
    productName: {
        textTransform: 'uppercase',
        fontSize: 20,
        fontWeight: '700',
    },
    productPrice: {
        color: '#FE3A30',
        fontWeight: '500',
        fontSize: 18,
    },
    productSale: {
        fontSize: 15,
    },
    originalPrice: {
        fontSize: 14,
        color: '#888',
        textDecorationLine: 'line-through',
        marginTop: 10,
    },
    SoldProductInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productStar: {
        flexDirection: 'row',
        gap: 5,
    },
    totalSellProduct: {
        color: '#3A9B7A',
    },
    descriptionProductTitle: {
        fontWeight: '800',
        fontSize: 16,
        paddingTop: 10,
    },
    descriptionProductText: {
        lineHeight: 24,
        paddingBottom: 10,
    },
    editButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    },
    editButtonText: {
        fontSize: 40,
        color: '#fff',
        marginLeft: 10,
        marginBottom: 10,

    },

    subButtonPen: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subButton: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ff5757',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productListTitle: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        left: '23%'

    },
    productList: {
        flex: 1,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ededed',
        borderWidth: 2,
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    productIcon: {
        width: 40,
        height: 40,
        marginLeft: 5,
        marginTop: 5,

    },
    productDetails: {
        flex: 1,
    },
    productCode: {
        fontSize: 16,
        fontWeight: 'bold',

    },

    productStatus: {
        fontSize: 14,
        color: '#888',
    },
    arrowIcon: {
        width: 20,
        height: 20,
    },


    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    noButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    yesButton: {
        backgroundColor: '#3669c9',
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default DetailScreen;
