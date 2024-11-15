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

function DetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [shipmentData, setShipmentData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const [rotation] = useState(new Animated.Value(0));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const apiUrl = `${BASE_URL}shipment/${id}`;
        axios.get(apiUrl)
            .then(response => {
                setShipmentData(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.log('Error fetching shipment data:', error);
            });
    }, [id]);

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
    const deleteShipment = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`${BASE_URL}shipment/${id}`);
            Alert.alert("Success", "Shipment deleted successfully");
            navigation.replace("ShipmentList");
        } catch (error) {
            console.log('Error deleting shipment:', error);
            Alert.alert("Error", "Failed to delete shipment.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#3669c9" />;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <View style={styles.iconHeader}>
                        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="angle-left" size={35} color="#000" />
                        </Pressable>
                        <Text style={styles.textHeader}>Chi Tiết Lô Hàng</Text>
                    </View>

                    {/* Shipment Information */}
                    <View style={styles.shipmentInfo}>
                        <Text style={styles.shipmentDate}>Date: {shipmentData.shipmentDate}</Text>
                        <Text style={styles.shipmentDiscount}>Discount: {shipmentData.shipmentDiscount}%</Text>
                        <Text style={styles.shipmentShipCost}>Shipping Cost: {shipmentData.shipmentShipCost} VND</Text>

                        <View style={styles.supplierInfo}>
                            <Text style={styles.supplierTitle}>Supplier:</Text>
                            <Text style={styles.supplierName}>{shipmentData.productSupplier?.productSupplierName}</Text>
                            <Image source={{ uri: shipmentData.productSupplier?.productSupplierLogo }} style={styles.supplierLogo} />
                        </View>
                    </View>

                    {/* Shipment Products */}
                    <View style={styles.productList}>
                        <Text style={styles.sectionTitle}>Products</Text>
                        {/* <FlatList
                            data={shipmentData.shipmentProducts}
                            keyExtractor={(item, index) => `${item.shipmentProductQuantity}-${index}`}
                            renderItem={({ item }) => (
                                <View style={styles.productItem}>
                                    <Text style={styles.productQuantity}>Quantity: {item.shipmentProductQuantity}</Text>
                                    <Text style={styles.productPrice}>Price: {item.shipmentProductPrice} VND</Text>
                                </View>
                            )}
                        /> */}
                    </View>
                </View>
            </ScrollView>

            {/* Add Button */}
            <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                <Animated.Text style={[styles.editButtonText, { transform: [{ rotate: rotateIcon }] }]}>
                    ▶
                </Animated.Text>
            </TouchableOpacity>

            {/* Các nút con */}
            <Animated.View style={[styles.subButtonPen, { bottom: position2 }]}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                        const { postName, postContent, postImagePath, postType, postStatus } = productsState.post || {};
                        navigation.navigate('EditProductScreen', {
                            product: productsState,
                            postDTO: {
                                postName,
                                postContent,
                                postImagePath,
                                postType,
                                postStatusId: postStatus?.postStatusId
                            }
                        });
                    }}
                >
                    <Icon name="pencil" size={20} color="#fff" />
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
                            { text: "Có", onPress: deleteProduct }
                        ]
                    );
                }}>
                    <Icon name="trash" size={20} color="#fff" />
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
    container: {
        flex: 1, backgroundColor: '#fff', padding: 20,
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
        backgroundColor: '#ff5757',
        justifyContent: 'center',
        alignItems: 'center',
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
    iconButton: {
        width: 50,
        height: 50,
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
