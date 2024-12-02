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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../../api/config';
import { LinearGradient } from 'expo-linear-gradient';

const EditProductScreen = ({ route, navigation }) => {
    const { id, name } = route.params; // categoryId truyền từ màn hình trước
    const [PermissionName, setPermissionName] = useState(name);
    const [isLoading, setIsLoading] = useState(false);


    // Hàm để cập nhật danh mục
    const handleEditPermission = async () => {


        try {
            const payload = {
                productPermissionName: PermissionName,
            };

            const apiUrl = `${BASE_URL}auth/permission/${id}`;
            const response = await axios.put(apiUrl, payload);

            Alert.alert('Success', 'Permission updated successfully');
            navigation.replace('PermissionList');
        } catch (error) {
            Alert.alert('Error', 'Failed to update Permission');
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#fff" />
                    </Pressable>
                    <Text style={styles.textHeader}>Sửa Thông Tin Quyền Người Dùng</Text>
                </LinearGradient>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Sửa Thông Tin Quyền Người Dùng: </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Tên Thông Tin Quyền Người Dùng"
                        value={PermissionName}
                        onChangeText={setPermissionName}
                    />


                </View>

            </ScrollView>
            <TouchableOpacity style={{
                width: '100%',
                backgroundColor: '#3669c9',
                paddingVertical: 15,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 10,
            }} onPress={handleEditPermission} disabled={isLoading}>
                <Text style={styles.buttonText}>Sửa</Text>
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
    formContainer: {
        paddingHorizontal: 20,
        flex: 1,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    dropdown: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    selectedValue: {
        fontSize: 16,
    },

    modalView: {
        position: 'absolute',
        width: '90%',
        marginHorizontal: 20,
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 400
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    modalText: {
        fontSize: 16,
    },
    button: {
        width: '100%',
        backgroundColor: '#3669c9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonPost: {
        width: '40%',
        backgroundColor: '#3669c9',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: '60%'
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',

    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm nền modal tối
    },
    searchBar: {
        position: 'relative',
        flexDirection: 'row',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 10,
    },
    iconCenter: {
        width: 20,
        height: 20,
        position: 'absolute',
        alignContent: 'center',
        top: 15,
    },

});
export default EditProductScreen;
