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
import { BASE_URL } from '../../api/config';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

function DetailScreen({ navigation, route }) {
    const { id, items } = route?.params
    // Modal Hiển Thị
    const handleCancelOrder = async () => {
        try {
            const requestBody = {
                status: 6,
                orderId: id,
            };
            const response = await axios.put(`${BASE_URL}order/change`, requestBody);
            if (response.status === 200) {
                Alert.alert('Order Cancelled', 'Your order has been cancelled successfully');
            } else {
                Alert.alert('Error', 'Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            Alert.alert('Error', 'Failed to cancel order');
        }
    };

    const handleConfirmOrder = async () => {
        try {
            const requestBody = {
                status: 2,
                orderId: id,
            };
            const response = await axios.put(`${BASE_URL}order/change`, requestBody);
            if (response.status === 200) {
                navigation.replace('InventoryList', {
                    alertVisible: true,
                    alertType: 'success',
                    title: 'Đóng Gói Thành Công'
                });
            } else {
                Alert.alert('Error', 'Failed to confirm order');
            }
        } catch (error) {
            console.error('Error confirming order:', error);
            Alert.alert('Error', 'Failed to confirm order');
        }
    };
    const ConfirmDialog = ({ isVisible, onClose, onConfirm }) => {
        return (
            <Modal
                animationType="fade"
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
    // console.log(items);

    // checked Sản Phẩm
    const [selectedProducts, setSelectedProducts] = useState({});
    const uniqueCartItems = items
        .flatMap((item) => item.cartItem)
        .filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.productId === item.productId)
        );

    // Kiểm tra tất cả sản phẩm đã được chọn chưa
    const allProductsChecked = uniqueCartItems.every(
        (product) => selectedProducts[product.productId]
    );

    // Toggle trạng thái checkbox của sản phẩm
    const toggleCheckbox = (productId) => {
        setSelectedProducts((prevState) => ({
            ...prevState,
            [productId]: !prevState[productId],
        }));
    };

    // Toggle trạng thái chọn tất cả
    const toggleSelectAll = () => {
        const isAllChecked = uniqueCartItems.every(
            (product) => selectedProducts[product.productId]
        );
        setSelectedProducts(
            uniqueCartItems.reduce((acc, product) => {
                acc[product.productId] = !isAllChecked;
                return acc;
            }, {})
        );
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => toggleCheckbox(item.productId)}
            key={item.productId}
        >
            <View style={{ marginRight: 20 }}>
                <Image source={{ uri: item.productImage }} style={styles.productIcon} />
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>{item.productName}</Text>
                <Text style={styles.productStatus}>Số Lượng: {item.productQuantity} cái</Text>
                <Text style={styles.productCode}>Màu: {item.productSize}</Text>
                <View style={styles.line}></View>
                <Text style={styles.productCode}>Giá: {item.productPrice}</Text>
            </View>
            {/* Custom checkbox */}
            <TouchableOpacity
                onPress={() => toggleCheckbox(item.productId)}
                style={styles.checkboxContainer}
            >
                {selectedProducts[item.productId] ? (
                    <Icon name="check" size={15} color="#3669c9" />
                ) : (
                    <View style={styles.uncheckedCheckbox} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));
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

    const position1 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 160], // Chuyển từ vị trí của editButton lên trên
    });
    const position2 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 100], // Chuyển từ vị trí của editButton lên trên
    });
    const rotateIcon = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'], // Xoay 90 độ khi bấm
    });

    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = () => {
        setModalVisible(false);
        navigation.navigate('SuccessScreen');
    };


    return (
        <>
            <View style={styles.container}>
                <View style={{ position: 'relative', marginBottom: 30 }}>
                    <Pressable style={{ width: 50 }} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.productListTitle}>Chi Tiết Trong Đơn</Text>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 5,
                            width: 25,
                            height: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            backgroundColor: '#eee',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5,
                            shadowRadius: 4,
                            elevation: 4,
                        }}
                        onPress={toggleSelectAll}
                    >
                        {allProductsChecked ? (
                            <Icon name="check" size={20} color="#3669c9" />
                        ) : (
                            <View style={styles.uncheckedCheckbox} />
                        )}
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={uniqueCartItems}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.productId}
                    style={styles.productList}
                />

                {/* Add Button */}
                <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                    <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                        <Icon name="cog" size={30} color="#fff" />
                    </Animated.View>
                </TouchableOpacity>

                <Animated.View style={[styles.subButtonPen, { bottom: position2 }]}>
                    <TouchableOpacity
                        style={[
                            styles.iconButton,
                            { backgroundColor: allProductsChecked ? '#3669c9' : '#ccc' }
                        ]}
                        onPress={() => {
                            if (allProductsChecked) {
                                setModalVisible(true);
                            }
                        }}
                        disabled={!allProductsChecked}
                    >
                        <LinearGradient colors={allProductsChecked ? ['#4CAF50', '#388E3C'] : ['#ccc', '#ccc']} style={styles.iconButtonGradient}>
                            <Icon name="check" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* <Animated.View style={[styles.subButton, { bottom: position1 }]}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => {
                        Alert.alert(
                            "Xác Nhận!!!",
                            "Bạn có chắc muốn xoá không??",
                            [
                                {
                                    text: "Huỷ",
                                    style: "cancel"
                                },
                                { text: "Có", onPress: handleCancelOrder }
                            ]
                        );
                    }}>
                        <LinearGradient colors={['#FF5252', '#FF1744']} style={styles.iconButtonGradient}>
                            <Icon name="trash" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View> */}



                {/* Modal confirm */}
                <ConfirmDialog
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleConfirmOrder}
                />
            </View>

        </>

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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
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
    subButton: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subButtonPen: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
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
    iconButtonGradient: {
        width: '100%',
        height: '100%',
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
        padding: 20,
        margin: 2,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
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
