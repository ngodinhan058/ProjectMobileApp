import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Linking } from 'react-native';

const Up_Image_Multi = ({ onImagesSelected, initialImages = [] }) => {
    const [selectedImages, setSelectedImages] = useState(
        initialImages || []);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageForModal, setSelectedImageForModal] = useState(null);

    const openImagePicker = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert(
                'Quyền bị từ chối',
                'Bạn đã từ chối quyền truy cập. Hãy vào cài đặt để cấp quyền.',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Mở cài đặt', onPress: () => Linking.openSettings() },
                ]
            );
            return;
        }

        let imageResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!imageResult.canceled) {
            const selectedImage = imageResult.assets[0].uri;
            setSelectedImages([selectedImage]); // Chỉ giữ 1 hình
            onImagesSelected([selectedImage]);
        }
    };

    const removeImage = () => {
        setSelectedImages([]); // Xóa hình đã chọn
        onImagesSelected([]); // Thông báo không còn hình
    };

    const openImageModal = (uri) => {
        setSelectedImageForModal(uri);
        setImageModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <FlatList
                        data={selectedImages.length > 0 ? selectedImages : ['+']} // Hiển thị "+" nếu chưa có ảnh
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                        renderItem={({ item }) => {
                            if (item === '+') {
                                return (
                                    <TouchableOpacity style={styles.addImageWrapper} onPress={openImagePicker}>
                                        <Text style={styles.plusText}>+</Text>
                                    </TouchableOpacity>
                                );
                            }
                            return (
                                <View style={styles.imageWrapper}>
                                    <TouchableOpacity onPress={() => openImageModal(item)}>
                                        <Image source={{ uri: item }} style={styles.imageIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={removeImage}
                                    >
                                        <Text style={styles.removeButtonText}>x</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                        contentContainerStyle={styles.selectedImagesContainer}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                <Modal
                    visible={imageModalVisible}
                    transparent={true}
                    onRequestClose={() => setImageModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Image source={{ uri: selectedImageForModal }} style={styles.fullImage} />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setImageModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    selectedImagesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageWrapper: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageIcon: {
        width: 300,
        height: 150,
        marginLeft: 10,
        borderRadius: 10,
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        borderRadius: 50,
        width: 20,
        height: 20,
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    addImageWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 50,
        marginHorizontal: 10,
    },
    plusText: {
        fontSize: 40,
        color: '#999',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContainer: {
        width: '90%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
    closeButton: {
        backgroundColor: '#3669c9',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Up_Image_Multi;
