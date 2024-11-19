import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';


const HomeAdminScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [PermissionAll, setPermissionAll] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}auth/permission`;
        axios.get(apiUrl)
            .then(response => {
                const PermissionData = response.data.result;
                setPermissionAll(PermissionData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const renderProduct = ({ item }) => (
        <View style={{ paddingHorizontal: 20,}}>
            <TouchableOpacity
                style={styles.productItem}
                onPress={() => navigation.navigate('DetailPermissionScreen', {
                    id: item.permissionId,
                    name: item.permissionName,
                })}
            >
                {/* <View style={{ width: 50, height: 50, backgroundColor: `${item.permissionName}`, borderRadius: 50 }} ></View> */}
                <View style={styles.productDetails}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginLeft: 20
                        
                    }}>{item.permissionName}</Text>
                </View>
                <Pressable>
                    <Icon name="arrow-forward-circle-outline" size={25} color="#000" />
                </Pressable>
            </TouchableOpacity>

            
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        source={{ uri: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474119Xok/hinh-anh-cho-cute-chibi-dep-nhat_100649530.png' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.welcomeText}>Hi Admin!</Text>
                </View>
                <TouchableOpacity>
                    <Icon name="log-out-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            {/* Product List */}
            <FlatList
                data={PermissionAll}
                renderItem={renderProduct}
                keyExtractor={(item) => item.permissionId}
                style={styles.productList}
            />

            {/* Add Button */}
           
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddPermissionScreen')}
            >
                <LinearGradient colors={['#4CAF50', '#388E3C']} style={styles.addButtonGradient}>
                    <Icon name="add-circle" size={40} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#3669c9" />
                </View>
            )}
        </View>
    );
};

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
        padding: 20,
        backgroundColor: '#fff',
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
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#fff',
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
    },
    productList: {
        flex: 1,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginVertical: 20,
        marginHorizontal: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    productIcon: {
        width: 55,
        height: 55,
        marginLeft: 5,
        marginTop: 5,
    },
    productDetails: {
        flex: 1,
    },

    childList: {
        paddingLeft: 20, // Thêm khoảng cách cho danh sách con
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 65,
        height: 65,
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
    },
    addButtonGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeAdminScreen;
