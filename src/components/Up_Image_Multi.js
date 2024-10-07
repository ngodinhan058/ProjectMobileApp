import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Linking, Alert } from 'react-native';

const Up_Image_Multi = ({ navigation }) => {

    const [selectedImages, setSelectedImages] = useState([]); // Trạng thái lưu trữ nhiều hình ảnh
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
            allowsMultipleSelection: true,  // Cho phép chọn nhiều ảnh
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!imageResult.canceled) {
            setSelectedImages([...selectedImages, ...imageResult.assets.map(asset => asset.uri)]); // Thêm ảnh vào danh sách
        }
        setImageModalVisible(false); // Đóng modal sau khi chọn ảnh
    };
    const removeImage = (uri) => {
        setSelectedImages(selectedImages.filter(imageUri => imageUri !== uri)); // Xoá ảnh khỏi danh sách
    }
    const openImageModal = (uri) => {
        setSelectedImageForModal(uri); // Cập nhật ảnh đã chọn
        setImageModalVisible(true); // Mở modal để hiển thị ảnh
    };
    return (
        <View style={styles.container}>
            <ScrollView>
               

                {/* Icon Image */}
                <View style={styles.imageContainer}>
                    <FlatList
                        data={[...selectedImages, '+']} // Thêm dấu "+" vào cuối danh sách ảnh
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true} // Hiển thị ngang
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
                                    {/* Bấm vào hình để mở modal */}
                                    <TouchableOpacity onPress={() => openImageModal(item)}>
                                        <Image source={{ uri: item }} style={styles.imageIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => removeImage(item)}
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
                 {/* Modal Hiển Thị Hình Ảnh */}
                 <Modal
                    visible={imageModalVisible}
                    transparent={true}
                    onRequestClose={() => setImageModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {/* Hiển thị hình ảnh lớn trong modal */}
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
        width: 150,
        height: 150,
        marginLeft: 10,
        borderRadius: 10,
        
    },
    removeButton: {
        position: 'absolute',
        top: 20,
        right: 10,
        backgroundColor: 'red',
        borderRadius: 50,
        width: 18,
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        top: -2,
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
        marginTop: 20,
        padding: 10,
        backgroundColor: '#3669c9',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Up_Image_Multi;
