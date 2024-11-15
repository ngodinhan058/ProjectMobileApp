import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CartItem = ({ id, name, price, quantity, sizeId, size, image, total, onDelete, onQuantityChange }) => {
    const truncateName = (text) => {
        return text.length > 10 ? text.substring(0, 10) + '...' : text;
    };

    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Lấy dữ liệu từ AsyncStorage
                const userInfoString = await AsyncStorage.getItem('userInfo');

                // Nếu có dữ liệu thì parse nó thành JSON
                if (userInfoString) {
                    const userInfoData = JSON.parse(userInfoString);
                    setUserInfo(userInfoData); // Lưu vào state
                }
            } catch (error) {
                console.error('Error fetching user info from AsyncStorage:', error);
            }
        };

        fetchUserInfo();
    }, []);
    console.log(userInfo?.userId);

    return (
        <View
            style={{
                width: '100%',
                height: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 20,
                borderRadius: 20,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
            }}
        >
            {/* Left Section with Image */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    style={{ width: 60, height: 60, marginLeft: 5, resizeMode: 'contain' }}
                    source={{ uri: image }}
                />
                <View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{truncateName(name)}</Text>
                    <Text style={{ fontSize: 14, color: 'gray' }}>{price}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View><Text style={{ fontSize: 12, color: 'gray' }}>Màu:</Text></View>
                        <View style={{ width: 12, height: 12, backgroundColor: `${size}`, borderRadius: 12, marginLeft: 5 }} />
                    </View>
                </View>
            </View>
            {userInfo?.userId ? (<View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <Text style={{ fontSize: 18, }}>{quantity}</Text>
                <TouchableOpacity onPress={() => onQuantityChange(id, number = true, sizeId)}>
                    <Image
                        style={{ width: 14, height: 10.5, position: 'absolute', top: 3 }}
                        source={require('../assets/arrowDown.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onQuantityChange(id, number = false, sizeId)}>
                    <Image
                        style={{ width: 14, height: 10.5, position: 'absolute', top: -12 }}
                        source={require('../assets/arrowUp.png')}
                    />
                </TouchableOpacity>
            </View>
            ) : (<View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
                <Text style={{ fontSize: 18, }}>{quantity}</Text>
                <TouchableOpacity onPress={() => onQuantityChange(id, quantity - 1, price)}>
                    <Image
                        style={{ width: 14, height: 10.5, position: 'absolute', top: 3 }}
                        source={require('../assets/arrowDown.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onQuantityChange(id, quantity + 1, price)}>
                    <Image
                        style={{ width: 14, height: 10.5, position: 'absolute', top: -12 }}
                        source={require('../assets/arrowUp.png')}
                    />
                </TouchableOpacity>
            </View>
            )}



            {userInfo?.userId ? (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 15 }}>{total}</Text>
                <TouchableOpacity onPress={() => onDelete(id, quantity, sizeId)}>
                    <Image
                        style={{ width: 20, height: 20, marginRight: 5 }}
                        source={require('../assets/trash.png')}
                    />
                </TouchableOpacity>
            </View>)
                : (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 15 }}>{total}</Text>
                    <TouchableOpacity onPress={() => onDelete(id)}>
                        <Image
                            style={{ width: 20, height: 20, marginRight: 5 }}
                            source={require('../assets/trash.png')}
                        />
                    </TouchableOpacity>
                </View>)}

        </View>


    );
};

const styles = StyleSheet.create({
    // Style khi đang loading (skeleton)
    skeletonImage: {
        width: 150,
        height: 140,
        borderRadius: 10,
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 10,
        resizeMode: 'contain'
    },
    skeletonText: {
        height: 20,
        width: '80%',
        borderRadius: 4,
        marginBottom: 10,
    },
    skeletonTextSmall: {
        height: 15,
        width: '60%',
        borderRadius: 4,
    },

});

export default CartItem;