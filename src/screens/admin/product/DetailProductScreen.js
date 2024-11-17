import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Pressable,
    FlatList,
    Alert,
    Modal,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageViewer from 'react-native-image-zoom-viewer';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';

function DetailScreen({ route, navigation }) {
    const { id } = route.params;

    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));
    const [rotation] = useState(new Animated.Value(0));
    const [productsState, setProductsState] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}product/${id}`;
        axios.get(apiUrl)
            .then(response => {
                const productData = response.data.data;
                setProductsState(productData);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
    }, [id]);

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsOpen(!isOpen);

        Animated.timing(rotation, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setIsOpen(!isOpen);
    };

    const position1 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 160],
    });
    const position2 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 100],
    });
    const rotateIcon = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    const deleteProduct = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`${BASE_URL}product/${id}`);
            Alert.alert("Success", "Xoá Thành Công");
            navigation.replace("ProductList");
        } catch (error) {
            console.error('Error deleting category:', error.response ? error.response.data : error.message);
            Alert.alert("Error", "Failed to delete category.");
        } finally {
            setIsLoading(false);
        }
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const openModal = (imagePath) => {
        setSelectedImage([{ url: imagePath }]);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
                </LinearGradient>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <FlatList
                        data={productsState.productImages}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => `${item.productImageIndex}-${index}`}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => openModal(item.productImagePath)}>
                                <View style={{ marginHorizontal: 5 }}>
                                    <Image
                                        source={{ uri: item.productImagePath }}
                                        style={{padding: 190, resizeMode: 'contain', alignItems: 'center' }}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <Modal visible={isModalVisible} transparent={true} onRequestClose={closeModal}>
                        <View style={styles.modalBackground}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Icon name="times" size={30} color="#fff" />
                            </TouchableOpacity>
                            {selectedImage && (
                                <ImageViewer
                                    imageUrls={selectedImage}
                                    enableSwipeDown
                                    onSwipeDown={closeModal}
                                    renderIndicator={() => null}
                                    style={styles.fullScreenImage}
                                />
                            )}
                        </View>
                    </Modal>
                </View>

                <View style={styles.productInfo}>
                    <View>
                        <Text style={styles.productName}>{productsState.productName}</Text>
                    </View>

                    <View>
                        <Text style={styles.originalPrice}>{productsState.productPrice}</Text>
                        <Text style={styles.productPrice}>
                            {productsState.productPriceSale}
                        </Text>
                        <Text style={styles.productSale}>
                            Sale: {productsState.productSale}%
                        </Text>
                    </View>

                    <View style={styles.SoldProductInfo}>
                        <View style={styles.productStar}>
                            <Image source={require('../../../assets/star.png')} />
                            <Text>{productsState.productRating}</Text>
                        </View>
                        <View>
                            <Text style={styles.totalSellProduct}>Số lượng còn lại: {productsState.productQuantity}</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={styles.descriptionProductTitle}>Thông Tin Sản Phẩm</Text>
                    <Text style={styles.descriptionProductText}>
                        {productsState?.post?.postContent}
                    </Text>
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
            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#3669c9" />
                </View>
            )}
        </View>
    );
}

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
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 15,
        borderRadius: 10,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        color: '#fff',
        flex: 1,
    },
    backButton: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 10,
    },
    productInfo: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
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
        paddingHorizontal: 20,
    },
    descriptionProductText: {
        lineHeight: 24,
        paddingBottom: 10,
        paddingHorizontal: 20,
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeText: {
        color: '#fff',
        fontSize: 24,
    },
    fullScreenImage: {
        width: '100%',
        height: '90%',
    },
});

export default DetailScreen;