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
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';

function DetailScreen({ route, navigation }) {
    const { id, name, image } = route.params;

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
    const deleteSize = async () => {
        try {
            const apiUrl = `${BASE_URL}product-supplier/${id}`;

            // Using request config to add data in the body
            const response = await axios.delete(apiUrl);

            Alert.alert("Success", "Xoá Thành Công");
            navigation.replace('SupplierList');
        } catch (error) {
            console.error('Error deleting Size:', error.response ? error.response.data : error.message);
            Alert.alert("Error", "Failed to delete Size.");
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={styles.iconHeader}>
                        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="angle-left" size={35} color="#000" />
                        </Pressable>
                        <Text style={styles.textHeader}>Chi Tiết Thương Hiệu</Text>
                    </View>

                    {/* Product Image */}
                    <View style={styles.productImgContainer}>
                        <Image source={{ uri: image }} style={styles.productImg} />
                    </View>
                </View>
                 {/* Product info */}
                 <View style={styles.productInfo}>
                        <Text style={styles.title}>Tên Thương Hiệu: </Text>
                        <Text style={styles.productName}>{name}</Text>
                    </View>
            </ScrollView>

            <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                <Animated.View style={{ transform: [{ rotate: rotateIcon }] }}>
                    <Icon name="cog" size={30} color="#fff" />
                </Animated.View>
            </TouchableOpacity>

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
                            { text: "Có", onPress: deleteProduct }
                        ]
                    );
                }}>
                    <LinearGradient colors={['#FF5252', '#FF1744']} style={styles.iconButtonGradient}>
                        <Icon name="trash" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%',
        backgroundColor: '#fff',
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
    title: {
        textTransform: 'uppercase',
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10
    },
    productName: {
        textTransform: 'uppercase',
        fontSize: 18,
        fontWeight: '500',
        marginHorizontal: 10
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
    productImg: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'contain',
    },
    productImgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 200,
        position: 'relative',
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
});

export default DetailScreen;
