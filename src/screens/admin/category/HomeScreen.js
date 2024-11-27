import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeAdminScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [categoryAll, setCategoryAll] = useState([]);
    const [refreshing, setRefreshing] = useState(false);


    const fetchCategories = async () => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}categories`;
        axios.get(apiUrl)
            .then(response => {
                const ctgData = response.data.data;
                setCategoryAll(ctgData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    useEffect(() => {
        fetchCategories();
    }, []);
    const handleRefresh = () => {
        fetchCategories();
    };
    const renderCategoryChildren = (children) => {
        if (!children || children.length === 0) return null; // Dừng nếu không có categoryChildren

        return (
            <FlatList
                data={children}
                renderItem={renderProduct}
                keyExtractor={(item) => item.categoryId}
                style={styles.childList}
            />
        );
    };

    const renderProduct = ({ item }) => (
        <View>
            <TouchableOpacity
                style={styles.productItem}
                onPress={() => navigation.navigate('DetailCategoryScreen', {
                    id: item.categoryId,
                    image: item.categoryImgPath,
                    name: item.categoryName,
                    parent: item.categoryParent,
                    categoryAll: categoryAll,
                })}
            >
                <View style={{ marginRight: 20 }}>
                    <Image source={{ uri: item.categoryImgPath }} style={styles.productIcon} />
                </View>
                <View style={styles.productDetails}>
                    <Text style={styles.productCode}>{item.categoryName}</Text>
                </View>
                <Pressable>
                    <Icon name="angle-right" size={25} color="#000" />
                </Pressable>
            </TouchableOpacity>

            {/* Hiển thị categoryChildren nếu có */}
            {renderCategoryChildren(item.categoryChildren)}
        </View>
    );
    const handleLogout = async () => {
        try {
          Alert.alert(
            'Xác nhận đăng xuất',
            'Bạn muốn đăng xuất phải không?',
            [
              {
                text: 'Huỷ',
                style: 'cancel',
              },
              {
                text: 'Đúng',
                onPress: async () => {
                  await AsyncStorage.removeItem('userData');              
                  await AsyncStorage.removeItem('userInfo');
    
                  Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất.');
                  navigation.navigate('Người Dùng');
                },
              },
            ],
            { cancelable: false }
          );
        } catch (error) {
          Alert.alert('Thất bại', error);
        }
      };
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Hi Admin!</Text>
                    <Text style={styles.subtitleText}>Welcome back to your panel.</Text>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                    <Image source={require('../../../assets/right_from_bracket.png')} style={{ width: 30, height: 30, marginLeft: 115 }} />
                </TouchableOpacity>
            </View>
            {/* Product List */}
            <FlatList
                data={categoryAll}
                renderItem={renderProduct}
                keyExtractor={(item) => item.categoryId}
                style={styles.productList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddCategoryScreen')}>
                <Text style={styles.addButtonText}>+</Text>
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
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
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
        borderColor: '#ededed',
        borderWidth: 2,
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
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
    productCode: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    childList: {
        paddingLeft: 20, // Thêm khoảng cách cho danh sách con
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
