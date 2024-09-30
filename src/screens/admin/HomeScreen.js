import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const HomeAdminScreen = ({ navigation }) => {
    const products = [
        { id: '1', code: '#HWDSF776567DS', status: 'On the way - 00/00/0000' },
        { id: '2', code: '#HWDSF776567DS', status: 'On the way - 00/00/0000' },
        { id: '3', code: '#HWDSF776567DS', status: 'On the way - 00/00/0000' },
        { id: '4', code: '#HWDSF776567DS', status: 'On the way - 00/00/0000' },
        { id: '5', code: '#HWDSF776567DS', status: 'On the way - 00/00/0000' },

    ];

    const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.productItem}>
            <View style={{ borderWidth: 2, borderColor: '#ededed', borderRadius: 40,
                width: 40, height: 40, marginRight: 10,
             }}>
                <Image source={require('../../assets/box.png')} style={styles.productIcon} />
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>{item.code}</Text>
                <Text style={styles.productStatus}>{item.status}</Text>
            </View>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon name="angle-right" size={25} color="#000" />
            </Pressable>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Hi Admin!</Text>
                    <Text style={styles.subtitleText}>Welcome back to your panel.</Text>
                </View>
            </View>

            {/* Product List Title */}
            <View style={{ position: 'relative', marginBottom: 30 }}>
                <Pressable style={styles.menuIcon} onPress={() => navigation.navigate('ProfileScreen')}>
                    <Icon name="bars" size={15} color="#000" style={{ marginLeft: 9, marginTop: 6, }} />
                </Pressable>
                <Text style={styles.productListTitle}>Product List</Text>

            </View>

            {/* Product List */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                style={styles.productList}
            />

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,

    },
    menuButton: {
        marginRight: 10,
    },
    menuIcon: {
        width: 35,
        height: 35,
        borderColor: '#ededed',
        borderRadius: 24,
        borderWidth: 2,
        marginTop: 0,
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
    },
    productListTitle: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        left: '35%'

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
        width: 25,
        height: 25,
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
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 40,
        color: '#fff',
    },
});

export default HomeAdminScreen;
