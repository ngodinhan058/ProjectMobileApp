import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { Card, Divider } from 'react-native-elements';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from 'react-native-reanimated';


const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const HomeAdminScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [productsState, setProductsState] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}products`);
            setProductsState(response.data.data.content);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const ProductItem = ({ item, onPress }) => {
        const scale = useSharedValue(1);

        const animatedStyles = useAnimatedStyle(() => {
            return {
                transform: [{ scale: scale.value }],
            };
        });

        const handlePress
            = () => {
                scale.value = withTiming(0.95, { duration: 100 });
                setTimeout(() => {
                    scale.value = withTiming(1, { duration: 100 });
                    onPress();
                }, 100);
            };

        return (
            <AnimatedTouchableOpacity
                style={[styles.productItem, animatedStyles]}
                onPress={handlePress}
            >
                <Card>
                    <Card.Image source={{ uri: item.productImages[0].productImagePath }} style={{resizeMode: 'contain'}}/>
                    <Card.Title>{item.productName}</Card.Title>
                    <Divider />
                    <View style={styles.productDetails}>
                        <Text style={styles.productPrice}>Giá: {item.productPrice}</Text>
                        <Text style={styles.productQuantity}>
                            Số lượng: {item.productQuantity}
                        </Text>
                    </View>
                </Card>
            </AnimatedTouchableOpacity>
        );
    };

    const renderProduct = ({ item }) => {
        const onPress = () => {
            navigation.navigate('DetailScreen', { id: item.productId });
        };

        return <ProductItem item={item} onPress={onPress} />;
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            Alert.alert('Thành công', 'Đăng xuất thành công!');
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Thất bại', 'Đăng xuất thất bại.');
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Hi Admin!</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Icon name="log-out-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={productsState}
                renderItem={renderProduct}
                keyExtractor={(item) => item.productId.toString()}
                style={styles.productList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                ListEmptyComponent={
                    !isLoading && <Text style={styles.emptyText}>Không có sản phẩm nào.</Text>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddProductScreen')}
            >
                <Icon name="add-circle" size={40} color="#fff" />
            </TouchableOpacity>

            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#2196F3" />
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
        justifyContent: 'space-between', // Canh đều 2 bên
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // Màu sắc chủ đạo
    },
    productItem: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
    },
    productDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    productQuantity: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#2196F3',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },

});
export default HomeAdminScreen;
