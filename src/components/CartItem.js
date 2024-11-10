import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

const CartItem = () => {

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
                style={{ width: 50, height: 50, marginRight: 10 }}
                source={require('../assets/headphone.png')}
            />
            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tai Nghe</Text>
                <Text style={{ fontSize: 14, color: 'gray' }}>10.000.000đ</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>Size: 120Hz</Text>
            </View>
        </View>
    
        {/* Middle Section with Quantity and Arrows */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginRight: 5 }}>1</Text>
            <View>
                <Image
                    style={{ width: 12, height: 8.5 }}
                    source={require('../assets/arrowUp.png')}
                />
                <Image
                    style={{ width: 12, height: 8.5, marginTop: 2 }}
                    source={require('../assets/arrowDown.png')}
                />
            </View>
        </View>
    
        {/* Right Section with Price and Trash Icon */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 15 }}>10.000.000đ</Text>
            <Image
                style={{ width: 20, height: 20, marginRight: 5 }}
                source={require('../assets/trash.png')}
            />
        </View>
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