import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CartItem_v2 = ({
    id,
    name,
    price,
    initialQuantity,
    sizeId,
    size,
    image,
    total,
}) => {
    const [quantity, setQuantity] = useState(initialQuantity); // Quản lý state số lượng

    return (
        <View style={styles.modalContainer}>
            <View style={styles.row}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.productImage} />
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.productRow}>
                        <Text
                            style={styles.productName}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {name}
                        </Text>
                        
                    </View>
                    <Text style={styles.productSize}>Màu: {size}</Text>
                    <View style={styles.infoContainer}>
                        <View>
                            <Text style={styles.productPrice}>{price}</Text>
                            <Text style={styles.productOldPrice}>{price}</Text>
                        </View>
                        <View style={styles.quantitySelector}>
                           <Text>Số Lượng:</Text>
                            <TextInput
                                style={styles.quantityInput}
                                value={String(quantity)}
                                onChangeText={(text) => {
                                    const validText = text.replace(/[^0-9]/g, '');
                                    setQuantity(validText);
                                }}
                                editable={false}
                                keyboardType="numeric"
                            />
                            
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
        alignItems: 'center',
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
        width: 20,
        height: 20,
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



export default CartItem_v2;