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
import * as ImagePicker from 'expo-image-picker'; // Thêm import này
import { Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';



const Up_Image = () => {

    const [selectedImage, setSelectedImage] = useState(null); // Trạng thái lưu trữ hình ảnh
    const [imageModalVisible, setImageModalVisible] = useState(false);



    const openImagePicker = async (option) => {
        let permissionResult;

        if (option === 'library') {
            // Yêu cầu quyền truy cập thư viện ảnh
            permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        } else if (option === 'camera') {
            // Yêu cầu quyền truy cập camera
            permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        }

        if (!permissionResult.granted) {
            if (permissionResult.canAskAgain) {
                // Người dùng có thể được hỏi lại quyền truy cập
                Alert.alert('Quyền bị từ chối', 'Quyền bị từ chối, bạn có thể thử lại.');
            } else {
                Alert.alert(
                    'Quyền bị từ chối',
                    'Bạn đã từ chối quyền truy cập. Hãy vào cài đặt để cấp quyền.',
                    [
                        { text: 'Hủy', style: 'cancel' },
                        { text: 'Mở cài đặt', onPress: () => Linking.openSettings() },
                    ]
                );
            }
            return;
        }

        // Xử lý chọn ảnh hoặc chụp ảnh
        let imageResult;
        if (option === 'library') {
            imageResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else if (option === 'camera') {
            imageResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }
        if (!imageResult.canceled) {
            setSelectedImage(imageResult.assets[0].uri); // Lưu hình ảnh đã chọn/chụp
        }
        setImageModalVisible(false); // Đóng modal sau khi chọn ảnh
    };

    return (
        <View style={styles.container}>


            {/* Icon Image */}
            <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage }} // Hiển thị hình ảnh đã chọn
                            style={styles.imageIcon}
                        />
                    ) : (
                        <Image
                            source={require('../assets/upload_image_icon.png')} // Thay bằng đường dẫn tới ảnh của bạn
                            style={styles.imageIcon}
                        />
                    )}
                </TouchableOpacity>
            </View>
            {/* Modal chọn thư viện hoặc camera */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={imageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <View style={styles.insideModal}>
                                <TouchableOpacity onPress={() => openImagePicker('camera')} style={styles.modalItem}>
                                    <Icon name="camera" size={30} style={styles.icon} />
                                    <Text style={styles.modalText}>Chọn Chụp ảnh</Text>
                                </TouchableOpacity>
                               
                                <TouchableOpacity onPress={() => openImagePicker('library')} style={styles.modalItem}>
                                <Icon name="image" size={30} style={styles.icon} />
                                    <Text style={styles.modalText}>Chọn Thư Viện</Text>
                                </TouchableOpacity>
                            </View>
                        <TouchableOpacity onPress={() => setImageModalVisible(false)} style={styles.buttonClose}>
                            <Text style={styles.buttonText}>Đóng</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    imageIcon: {
        width: 155,
        height: 140,
        marginVertical: 20,
    },
    imageSelectIcon: {
        width: 200,
        height: 140,

    },
    modalView: {
        position: 'absolute',
        width: '100%',
        padding: 30,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 250,
        bottom: 0,
    },
    icon: {
        marginBottom: 10,
        textAlign: 'center',
        alignItems: 'center'
    },
    insideModal: {
        flexDirection: 'row',
    },
    modalItem: {
        padding: 30,
    },
    modalText: {
        fontSize: 16,
    },
    buttonClose: {
        width: '100%',
        backgroundColor: '#3669c9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm nền modal tối
    },

});
export default Up_Image;