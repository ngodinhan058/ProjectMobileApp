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
    Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import UploadImage from '../../../components/Up_Image';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectorInCategory from '../../../components/SelectorInCategory';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const EditProductScreen = ({ route, navigation }) => {
    const { id, name, code } = route.params; // categoryId truyền từ màn hình trước
    const [SizeCode, setSizeCode] = useState(code);
    const [SizeName, setSizeName] = useState(name);

    
    // Hàm để cập nhật danh mục
    const handleEditSize = async () => {
       // Validate SizeName format (e.g., #FFFFFF)
       const colorCodePattern = /^#[0-9A-Fa-f]{6}$/;
       if (!colorCodePattern.test(SizeCode)) {
           Alert.alert('Thông Báo', 'Sai định dạng mã màu # + từ 0-9, a-f, (7 kí tự)');
           return;
       }

       try {
           const payload = {
               productSizeCode: SizeCode,
               productSizeName: SizeName,
           };

           const apiUrl = `${BASE_URL}product-sizes/${id}`;
           const response = await axios.put(apiUrl, payload);

           Alert.alert('Success', 'Size updated successfully');
           navigation.replace('SizeList');
       } catch (error) {
           Alert.alert('Error', 'Failed to update Size');
       }
    };
    

    return (
        <View style={styles.container}>
        <ScrollView>
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={35} color="#000" />
                </Pressable>
                <Text style={styles.textHeader}>Sửa Thông Tin Màu</Text>
            </View>
            <View style={styles.formContainer}>
                    <Text style={styles.label}>Thêm Mã Màu: (ví dụ màu đen: #000000)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Mã Màu"
                        value={SizeCode}
                        onChangeText={setSizeCode}
                        maxLength={7} // Limit input length
                    />
                    <Text style={styles.label}>Thêm Tên Màu:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Tên Màu"
                        value={SizeName}
                        onChangeText={setSizeName}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleEditSize}>
                        <Text style={styles.buttonText}>Sửa</Text>
                    </TouchableOpacity>
                </View>
        </ScrollView>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 20,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
    },
    backButton: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
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
