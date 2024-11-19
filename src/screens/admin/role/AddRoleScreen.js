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
import PermissionScreen from '../../../components/Permission';



const AddRoleScreen = ({ navigation }) => {
    const [RoleName, setRoleName] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const [Permission, setPermission] = useState(null);
    const [PermissionName, setPermissionName] = useState(null);
    const [isPerModal, setIsPerModal] = useState(false);


    const handleAddRole = async () => {
        try {
            setIsLoading(true)
            const payload = {
                roleName: RoleName,
                permissionsId: Permission
            };
            console.log(payload);
            
            const apiUrl = `${BASE_URL}auth/role`;
            const response = await axios.post(apiUrl, payload);

            Alert.alert('Success', 'Role updated successfully');
            navigation.replace('RoleList');
        } catch (error) {
            setIsLoading(false)
            Alert.alert('Error', 'Failed to update Role');
        }
    };
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
                    <Text style={styles.textHeader}>Thêm Thông Tin Quyền Người Dùng</Text>
                </LinearGradient>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Thêm Tên Quyền Người Dùng:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Tên Quyền Người Dùng"
                        value={RoleName}
                        onChangeText={setRoleName}
                    />
                    <Text style={styles.label}>Quyền Người Dùng:</Text>
                    <TouchableOpacity style={[styles.input, !Permission && styles.inputError]} onPress={toggleSizeModal}>
                        {Permission != null ? (<Text>{PermissionName}</Text>) : (<Text>Chưa Chọn Quyền Người Dùng</Text>)}
                    </TouchableOpacity>
                    <PermissionScreen
                        isVisible={isPerModal}
                        onClose={toggleSizeModal}
                        onReset={handleResetFilters}
                        onApply={(selectedSizeId, selectedSizeName) => {
                            setPermission(selectedSizeId);
                            const selectedSizeNames = selectedSizeName.join(', ');
                            setPermissionName(selectedSizeNames);

                        }}

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
            }} onPress={handleAddRole} disabled={isLoading}>
                <Text style={styles.buttonText}>Thêm</Text>
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
        flex: 1,
        paddingHorizontal: 20,
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

export default AddRoleScreen;
