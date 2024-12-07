import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TextInput, TouchableOpacity,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CartItem = ({
    id,
    name,
    price,
    oldPrice,
    initialQuantity,
    sizeId,
    size,
    image,
    total,
    productSizeQuantity, // Thêm số lượng kho
    onDelete,
    onQuantityChange,
    onInput,
    setAlertType, setAlertVisible, setTitleAlert
}) => {
    const [quantity, setQuantity] = useState(initialQuantity);

    const truncateName = (text) => {
        return text.length > 17 ? text.substring(0, 17) + '...' : text;
    };

    const handleBlur = () => {
        if (quantity < 1) {
            setQuantity(1); // Đảm bảo số lượng không dưới 1
            onInput(id, sizeId, initialQuantity, 1); // Reset số lượng về 1
        } else if (quantity !== initialQuantity) {
            onInput(id, sizeId, initialQuantity, quantity); // Cập nhật nếu thay đổi
        }
    };

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.productImage} />
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.productRow}>
                        <View>
                            <Text style={styles.productName} numberOfLines={1}>
                                {truncateName(name)}
                            </Text>
                        </View>
                       
                    </View>
                    <Text style={styles.productSize}>Màu: {size}</Text>
                    <View style={styles.infoContainer}>
                        <View>
                            <Text style={styles.productPrice}>{price}</Text>
                            <Text style={styles.productOldPrice}>{oldPrice}</Text>
                        </View>
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (quantity > 1) {
                                        const newQuantity = quantity - 1;
                                        setQuantity(newQuantity);
                                        onQuantityChange(id, true, sizeId);
                                    }
                                }}
                                style={styles.quantityButtonLeft}
                            >
                                <Text style={styles.quantityText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.quantityInput}
                                value={String(quantity)}
                                onChangeText={(text) => {
                                    const validText = text.replace(/[^0-9]/g, '');
                                    const newQuantity = validText ? parseInt(validText, 10) : 1;
                                    setQuantity(newQuantity);
                                }}
                                onBlur={handleBlur}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (quantity + 1 > productSizeQuantity) {
                                        setAlertType('error')
                                        setAlertVisible(true)
                                        setTitleAlert(`Số lượng tối đa là ${productSizeQuantity}`)
                                        return;
                                    }
                                    const newQuantity = quantity + 1;
                                    setQuantity(newQuantity);
                                    onQuantityChange(id, false, sizeId);
                                }}
                                style={styles.quantityButtonRight}
                            >
                                <Text style={styles.quantityText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        borderRadius: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginVertical: 10,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    productName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 10, // Khoảng cách với nút xóa
    },
    trashIcon: {
        width: 30,
        height: 35,
        tintColor: '#FE3A30',
    },
    productSize: {
        marginVertical: 5,
        fontSize: 14,
        color: '#555',
    },
    productPrice: {
        color: '#3669c9',
        fontWeight: '500',
        fontSize: 16,
        marginVertical: 2,
    },
    productOldPrice: {
        color: '#ccc',
        fontWeight: '500',
        fontSize: 13,
        textDecorationLine: 'line-through',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButtonLeft: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: '#f2f2f2',
    },
    quantityButtonRight: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor: '#f2f2f2',
    },
    quantityInput: {
        width: 50,
        height: 30,
        borderColor: '#ccc',
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3669c9',
        backgroundColor: '#fff',
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
});


export default CartItem;