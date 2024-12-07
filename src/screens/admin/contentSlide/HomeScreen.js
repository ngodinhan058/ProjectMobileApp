import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const ContentSlideScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [contentSlides, setContentSlides] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(null);

    const fetchContentSlides = async () => {
        setIsLoading(true);
        const apiUrl = `${BASE_URL}contentslides`;
        try {
            const response = await axios.get(apiUrl);
            const slidesData = response.data.data;
            setContentSlides(slidesData);

            // Lọc các phần tử có status === 1 và lưu vào saveContent
            const saveContent = slidesData.find(slide => slide.status === "1");
            setSelectedSlide(saveContent)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchContentSlides();
    }, []);

    const handleRefresh = () => {
        fetchContentSlides();
    };

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
                            navigation.navigate('AdminHomeScreen');
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            Alert.alert('Thất bại', error.message);
        }
    };

    const handleChangeStatus = (item) => {
        Alert.alert(
            'Xác nhận thay đổi mặc định',
            'Bạn có muốn thay đổi mặc định không?',
            [
                {
                    text: 'Huỷ',
                    style: 'cancel',
                },
                {
                    text: 'Đúng',
                    onPress: async () => {
                        try {
                            // Giả sử bạn có API endpoint như sau: `${BASE_URL}contentslides/${item.id}`
                            const response = await axios.put(`${BASE_URL}contentslide/${item.id}`, {
                                status: 1, // Cập nhật status mới cho item
                                content: item.content
                            });

                            if (response.status === 200) {
                                const responseNew = await axios.put(`${BASE_URL}contentslide/${selectedSlide.id}`, {
                                    status: 0, // Cập nhật status mới cho item
                                    content: selectedSlide.content
                                });
                                if (responseNew.status === 200) {
                                    fetchContentSlides();
                                    Alert.alert('Thành công', 'Thay đổi status thành công!');
                                } else {
                                    // Nếu API không thành công, thông báo lỗi
                                    Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật status.');
                                }
                            } else {
                                // Nếu API không thành công, thông báo lỗi
                                Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật status.');
                            }
                        } catch (error) {
                            console.error('Error updating status:', error);
                            Alert.alert('Lỗi', 'Không thể cập nhật status. Vui lòng thử lại.');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };
    const renderContentSlide = ({ item }) => (
        <View>
            <TouchableOpacity
                style={[
                    styles.productItem,
                    selectedSlide?.id == item?.id && { borderColor: '#3669c9', borderWidth: 2 }, // Tô viền màu xanh nếu status = 1
                ]}
                onPress={() => handleChangeStatus(item)} // Gọi hàm xử lý thay đổi status
            >
                <View style={styles.contentSlideDetails}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginLeft: 20,
                        }}
                    >
                        {item.content}
                    </Text>
                </View>
                {selectedSlide?.id == item?.id && <Text style={styles.productText}>Mặc Định</Text>}

            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        source={{
                            uri: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474119Xok/hinh-anh-cho-cute-chibi-dep-nhat_100649530.png',
                        }}
                        style={styles.avatar}
                    />
                    <Text style={styles.welcomeText}>Hi Admin!</Text>
                </View>
                <TouchableOpacity onPress={handleLogout}>
                    <Icon name="log-out-outline" size={30} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
            {/* ContentSlide List */}
            <FlatList
                data={contentSlides}
                renderItem={renderContentSlide}
                keyExtractor={(item) => item.id.toString()}
                style={styles.productList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            />

            {/* Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddContentScreen')}
            >
                <LinearGradient
                    colors={['#4CAF50', '#388E3C']}
                    style={styles.addButtonGradient}
                >
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
    productList: {
        flex: 1,
        padding: 20,

    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    productText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3669c9'
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
        shadowOpacity: 0.3,
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

export default ContentSlideScreen;
