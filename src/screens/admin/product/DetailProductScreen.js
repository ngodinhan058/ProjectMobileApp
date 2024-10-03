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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function DetailScreen({ route, navigation }) {
    const { image, name, price, rating, review, quantity, sale } = route.params;

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

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.productDetailContainer}>
                    <View style={styles.iconHeader}>
                        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="angle-left" size={35} color="#000" />
                        </Pressable>
                        <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
                    </View>

                    {/* Product Image */}
                    <View style={styles.productImgContainer}>
                        <Image source={image} style={styles.productImg} />
                        <Text style={styles.numberOfImage}>1/5 Foto</Text>
                    </View>

                    {/* Product info */}
                    <View style={styles.productInfo}>
                        <View>
                            <Text style={styles.productName}>{name}</Text>
                        </View>

                        <View>
                            <Text style={styles.originalPrice}>{price} &#273;</Text>
                            <Text style={styles.productPrice}>
                                {price} &#273;
                            </Text>
                            <Text style={styles.productSale}>
                                Sale: {sale}%
                            </Text>
                        </View>

                        <View style={styles.SoldProductInfo}>
                            <View style={styles.productStar}>
                                <Image source={require('../../../assets/star.png')} />
                                <Text>{rating}</Text>
                            </View>
                            <View>
                                <Text style={styles.totalSellProduct}>Số lượng còn lại: {quantity}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description Product */}
                    <View>
                        <Text style={styles.descriptionProductTitle}>Description Product</Text>
                        <Text style={styles.descriptionProductText}>
                            The speaker unit contains a diaphragm that is precision-grown from
                            NAC Audio bio-cellulose, making it stiffer, lighter and stronger
                            than regular PET speaker units, and allowing the sound-producing
                            diaphragm to vibrate without the levels of distortion found in other
                            speakers.
                        </Text>
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
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('EditProductScreen')}>
                    <Icon name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.subButton, { bottom: position1 }]}>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="trash" size={20} color="#fff" />
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
        paddingHorizontal: 20,
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
});

export default DetailScreen;
