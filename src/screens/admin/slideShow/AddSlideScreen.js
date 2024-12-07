import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import UploadImage from '../../../components/Up_One_Image';
import { LinearGradient } from 'expo-linear-gradient';
import AlertComponent from '../../../components/AlertComponent';
import ContentScreen from '../../../components/Content';


const AddSlideScreen = ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [selectedImages, setSelectedImages] = useState([]);

    const [Permission, setPermission] = useState(null);
    const [PermissionName, setPermissionName] = useState(null);
    const [isPerModal, setIsPerModal] = useState(false);

    const [slideData, setSlideData] = useState({
        imageAlt: '',
        imageIndex: 1,
        imageUrl: '',
        content: '',
    });

    const [error, setError] = useState({
        imageAltError: false,
        imageUrlError: false,
        imageContentError: false,
    });

    const handleAddSlide = async () => {
        setIsLoading(true);
        const formData = new FormData();
        const params = {
            imageAlt: slideData.imageAlt,
            imageIndex: slideData.imageIndex,
            imageUrl: slideData.imageUrl,
            content: PermissionName[0],
        };
        formData.append('paramsJson', JSON.stringify(params));
        console.log(params);
        
        selectedImages.forEach((imageUri, index) => {
            const fileType = imageUri.split('.').pop();
            const newFile = {
                uri: imageUri,
                name: `slide-image-${index}.${fileType}`,
                type: `image/${fileType}`,
            };
            formData.append('file', newFile);
        });

        try {
            const response = await fetch(`${BASE_URL}slideshow`, {
                method: 'POST',
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
                    title: 'Thêm Slide Thành Công!',
                });
            } else {
                setAlertType('error');
                setAlertVisible(true);
            }
        } catch (error) {
            console.log('Error adding slide:', error);
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
            imageContentError: slideData.content === '',
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
                    <Text style={styles.textHeader}>Thêm Slide</Text>
                </LinearGradient>

                <UploadImage onImagesSelected={setSelectedImages} />
                <View style={styles.formContainer}>
                    <Text style={styles.label}>ALT Hình Ảnh:</Text>
                    <TextInput
                        style={[styles.input, error.imageAltError && styles.inputError]}
                        placeholder="Thêm ALT Hình Ảnh"
                        value={slideData.imageAlt}
                        onChangeText={(text) => setSlideData({ ...slideData, imageAlt: text })}
                    />
                    <Text style={styles.label}>URL Hình Ảnh:</Text>
                    <TextInput
                        style={[styles.input, error.imageUrlError && styles.inputError]}
                        placeholder="Thêm URL Hình Ảnh"
                        value={slideData.imageUrl}
                        onChangeText={(text) => setSlideData({ ...slideData, imageUrl: text })}
                    />
                    <Text style={styles.label}>Nội Dung:</Text>
                    <TouchableOpacity style={[styles.input, !Permission && styles.inputError]} onPress={toggleSizeModal}>
                        {Permission != null ? (<Text>{PermissionName}</Text>) : (<Text>Chưa Chọn Content</Text>)}
                    </TouchableOpacity>
                    <ContentScreen
                        isVisible={isPerModal}
                        onClose={toggleSizeModal}
                        onReset={handleResetFilters}
                        onApply={(selectedSizeId, selectedSizeName) => {
                            setPermission(selectedSizeId);
                            setPermissionName(selectedSizeName);

                        }}

                    />
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleAddSlide} disabled={isLoading}>
                <Text style={styles.buttonText}>Thêm</Text>
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
                        ? "Slide added successfully."
                        : "Thêm Thất Bại! Vui Lòng Thử Lại"
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

export default AddSlideScreen;