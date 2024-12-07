import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    TextInput,
    Pressable,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadImage from '../../../components/Up_One_Image';
import SelectorInCategory from '../../../components/SelectorInCategory';
import Supplier from '../../../components/Supplier';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';
import Size from '../../../components/Size';
import DateTimePicker from '@react-native-community/datetimepicker';
import AlertComponent from '../../../components/AlertComponent';
import ContentScreen from '../../../components/Content';

const EditSlideScreen = ({ route, navigation }) => {
    const { id, existingSlide } = route.params; // Dữ liệu truyền từ màn hình trước
    const [isLoading, setIsLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [selectedImages, setSelectedImages] = useState([existingSlide?.imagePath]);

    const [Permission, setPermission] = useState(null);
    const [PermissionName, setPermissionName] = useState(existingSlide?.content);
    const [isPerModal, setIsPerModal] = useState(false);

    const [slideData, setSlideData] = useState({
        imageAlt: existingSlide?.imageAlt || '',
        imageIndex: existingSlide?.imageIndex || 1,
        imageUrl: existingSlide?.imageUrl || '',
        content: existingSlide?.content || '',
    });

    const [error, setError] = useState({
        imageAltError: false,
        imageUrlError: false,
    });

    const handleEditSlide = async () => {
        setIsLoading(true);
        const formData = new FormData();
        const params = {
            imageAlt: slideData.imageAlt,
            imageIndex: slideData.imageIndex,
            imageUrl: slideData.imageUrl,
            content: PermissionName[0],
        };
        console.log(params);
        
        formData.append('paramsJson', JSON.stringify(params));

        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((image, index) => {
                if (image) {
                    const imageUri = image instanceof Object ? image.productImagePath : image;
                    const fileType = imageUri.split('.').pop();
                    const newFile = {
                        uri: imageUri,
                        name: `product-image-${index}.${fileType}`,
                        type: `image/${fileType}`,
                    };
                    formData.append('file', newFile);
                }
            });
        }
        console.log(formData);

        try {
            const response = await fetch(`${BASE_URL}slideshow/${id}`, {
                method: 'PUT', // Chuyển thành PUT để cập nhật
                headers: {
                    'Content-Type': 'multipart/form-data', // Nếu bạn đang gửi FormData
                },
                body: formData,
            });

            if (response.ok) {
                setAlertVisible(true);
                setAlertType('success');
                navigation.replace('SlideList', {
                    alertVisible: true,
                    alertType: 'success',
                    title: 'Cập Nhật Slide Thành Công!',
                });
            } else {
                setAlertType('error');
                setAlertVisible(true);
            }
        } catch (error) {
            console.log('Error editing slide:', error);
            setAlertType('error');
            setAlertVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setError({
            imageAltError: slideData.imageAlt === '',
            imageUrlError: slideData.imageUrl === '',
        });
    }, [slideData]);
    const toggleSizeModal = () => setIsPerModal(!isPerModal);
    const handleResetFilters = () => {
       setPermission(null)
       setPermissionName(null)
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Chỉnh Sửa Slide</Text>
                </LinearGradient>

                <UploadImage
                    onImagesSelected={setSelectedImages}
                    initialImages={[existingSlide?.imagePath]} // Hiển thị ảnh cũ
                />
                <View style={styles.formContainer}>
                    <Text style={styles.label}>ALT Hình Ảnh:</Text>
                    <TextInput
                        style={[styles.input, error.imageAltError && styles.inputError]}
                        placeholder="Chỉnh Sửa ALT Hình Ảnh"
                        value={slideData.imageAlt}
                        onChangeText={(text) => setSlideData({ ...slideData, imageAlt: text })}
                    />
                    <Text style={styles.label}>URL Hình Ảnh:</Text>
                    <TextInput
                        style={[styles.input, error.imageUrlError && styles.inputError]}
                        placeholder="Chỉnh Sửa URL Hình Ảnh"
                        value={slideData.imageUrl}
                        onChangeText={(text) => setSlideData({ ...slideData, imageUrl: text })}
                    /> 
                    <Text style={styles.label}>Nội Dung:</Text>
                    <TouchableOpacity style={[styles.input, !PermissionName && styles.inputError]} onPress={toggleSizeModal}>
                        {PermissionName != null ? (<Text>{PermissionName}</Text>) : (<Text>Chưa Chọn Content</Text>)}
                    </TouchableOpacity>
                    <ContentScreen
                        isVisible={isPerModal}
                        onClose={toggleSizeModal}
                        onReset={handleResetFilters}
                        selectedpermissionName={existingSlide?.content}
                        onApply={(selectedSizeId, selectedSizeName) => {
                            setPermission(selectedSizeId);
                            setPermissionName(selectedSizeName);

                        }}

                    />
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleEditSlide} disabled={isLoading}>
                <Text style={styles.buttonText}>Cập Nhật</Text>
            </TouchableOpacity>

            {isLoading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#3669c9" />
                </View>
            )}
            <AlertComponent
                title={alertType === 'success' ? "Success" : "Error"}
                description={
                    alertType === 'success'
                        ? "Slide updated successfully."
                        : "Cập Nhật Thất Bại! Vui Lòng Thử Lại"
                }
                alertType={alertType}
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
            />
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
        backgroundColor: '#f5f5f5',
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
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    input: {
        position: 'relative',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: 'red',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    radioContainer: {
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    radioText: {
        marginLeft: 5,
        fontSize: 16,
    },
});

export default EditSlideScreen;
