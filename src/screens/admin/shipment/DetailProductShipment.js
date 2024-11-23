import React, { useState, useEffect, useRef } from 'react';
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
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';

function DetailScreen({ route, navigation }) {
    const { id } = route.params; // Shipment ID
    const [shipmentData, setShipmentData] = useState(null);
    const [shipmentProducts, setShipmentProducts] = useState([]);
    const [productsState, setProductsState] = useState([]); // Product data
    const [isOpen, setIsOpen] = useState(false);
    const animation = useState(new Animated.Value(0))[0];
    const rotation = useState(new Animated.Value(0))[0];
    const [isLoading, setIsLoading] = useState(true);

    // Fetch shipment details
    useEffect(() => {
        const fetchShipmentDetails = async () => {
            setIsLoading(true);
            try {
                const apiUrl = `${BASE_URL}shipment/${id}`;
                const response = await axios.get(apiUrl);
                const data = response.data.data || [];

                setShipmentData(data[0]);
                setShipmentProducts(data[0]?.shipmentProducts || []); // Guard against undefined data
            } catch (error) {
                console.error("Error fetching shipment data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShipmentDetails();
    }, [id]);

    // Fetch product details for the first product in shipmentProducts
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productIds = shipmentProducts.map((product) => product.productId);
                const promises = productIds.map((id) =>
                    axios.get(`${BASE_URL}product/${id}`).then((res) => res.data.data)
                );
    
                const products = await Promise.all(promises); // Kết quả là một mảng
                setProductsState(products); // Gán toàn bộ mảng sản phẩm vào productsState
            } catch (error) {
                console.error("Error fetching product data:", error);
                setProductsState([]); // Đặt mặc định là mảng rỗng nếu xảy ra lỗi
            }
        };
    
        if (shipmentProducts.length > 0) {
            fetchProductDetails();
        }
    }, [shipmentProducts]);
    

    // Handle shipment deletion
    const deleteShipment = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`${BASE_URL}shipment/${id}`);
            navigation.replace('ShipmentList', {
                alertVisible: true,
                alertType: 'success',
                title: 'Xóa Lô Hàng Thành Công,'
            });
        } catch (error) {
            console.error("Error deleting shipment:", error);
            Alert.alert("Error", "Failed to delete shipment.");
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading indicator while fetching data
    if (isLoading) {
        return <ActivityIndicator size="large" color="#3669c9" />;
    }

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



    return (
        <View style={styles.container}>

            <View>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>

                    <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
                </LinearGradient>
                {/* Shipment Information */}
                <View style={{ padding: 20 }}>
                    <Text style={styles.shipmentDate}>Date: {shipmentData.shipmentDate}</Text>
                    <Text style={styles.shipmentDiscount}>Discount: {shipmentData.shipmentDiscount}%</Text>
                    <Text style={styles.shipmentShipCost}>Shipping Cost: {shipmentData.shipmentShipCost} VND</Text>

                    <View style={styles.supplierInfo}>
                        <Text style={styles.supplierTitle}>Supplier:</Text>
                        <Text style={styles.supplierName}>{shipmentData.productSupplier?.productSupplierName}</Text>
                        {/* <Image source={{ uri: firstShipment.productSupplier?.productSupplierLogo }} style={styles.supplierLogo} /> */}
                    </View>
                </View>

                {/* Shipment Products */}
                <View style={styles.productList}>
                    <Text style={styles.sectionTitle}>Products</Text>
                    <FlatList
                        data={shipmentProducts}
                        keyExtractor={(item) => `${item.productId}`}
                        renderItem={({ item }) => {
                            const productDetails = productsState.find((product) => product.productId === item.productId);

                            return (
                                <View style={styles.productItem}>
                                    <Text style={styles.productName}>
                                        Product Name: {productDetails?.productName || "Unknown"}
                                    </Text>
                                    <Text style={styles.productPrice}>
                                        Price: {productDetails.productPrice}
                                    </Text>
                                </View>
                            );
                        }}
                    />
                </View>
            </View>


            {/* Add Button */}

            <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                    <Icon name="cog" size={30} color="#fff" />
                </Animated.View>
            </TouchableOpacity>

            <Animated.View style={[styles.subButtonPen, { bottom: position2 }]}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        navigation.navigate('EditProductShipment', {
                            shipmentData: firstShipment,

                        });
                    }}
                >
                    <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.iconButtonGradient}>
                        <Icon name="pencil" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.subButton, { bottom: position1 }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => {
                    Alert.alert(
                        "Xác Nhận!!!",
                        "Bạn có chắc muốn xoá không??",
                        [
                            {
                                text: "Huỷ",
                                style: "cancel"
                            },
                            { text: "Có", onPress: deleteShipment }
                        ]
                    );
                }}>
                    <LinearGradient colors={['#FF5252', '#FF1744']} style={styles.iconButtonGradient}>
                        <Icon name="trash" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#3669c9" />
                </View>
            )}


        </View>
    );
}

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
        backgroundColor: '#fff'
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
    shipmentDate: { fontSize: 16, marginBottom: 5 },
    shipmentDiscount: { fontSize: 16, marginBottom: 5 },
    shipmentShipCost: { fontSize: 16, marginBottom: 5 },
    supplierInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    supplierTitle: { fontSize: 16, fontWeight: 'bold' },
    supplierName: { fontSize: 16, marginLeft: 5 },
    supplierLogo: { width: 40, height: 40, borderRadius: 20, marginLeft: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    productItem: { padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5, borderRadius: 5 },
    productQuantity: { fontSize: 16 },
    productPrice: { fontSize: 16 },
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeText: {
        color: '#fff',
        fontSize: 24,
    },

});

export default DetailScreen;
