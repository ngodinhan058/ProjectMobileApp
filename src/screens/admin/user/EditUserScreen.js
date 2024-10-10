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
import UploadImage from '../../../components/Up_Image';

const EditUserScreen = ({ route, navigation }) => {

    const categories = ['Admin', 'Inventory', 'Shipper', 'Customer'];

    const { query } = route.params || {}; // Kiểm tra xem `query` có tồn tại hay không
    const [searchQuery, setSearchQuery] = useState(''); // Lưu trữ trạng thái cho thanh tìm kiếm

    // Lọc các danh mục theo thanh tìm kiếm
    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearchQuery(value);
    };

    const [userEmail, setUserEmail] = useState('');
    const [userFront, setUserFront] = useState('');
    const [userBack, setUserBack] = useState('');
    const [userPass, setUserPass] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userPhone, setUserPhone] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Chọn loại Người Dùng');

    const handleSelect = (value) => {
        setSelectedValue(value);
        setModalVisible(false);
    };
    
    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Sửa Thông Tin Sản Phẩm</Text>
                </View>

                {/* Icon Image */}
                <UploadImage />
                <TouchableOpacity style={styles.buttonPost} onPress={() => navigation.navigate('EditIdCardScreen')}>
                    <Text style={styles.buttonText}>Sửa CCCD</Text>
                </TouchableOpacity>
                {/* Product Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Email Người Dùng:</Text>
                     {/* User Email */}
                     <TextInput
                        style={styles.input}
                        placeholder="Sửa Email Người Dùng"
                        value={userEmail}
                        onChangeText={setUserEmail}
                    />
                    <Text style={styles.label}>Tên Đầu Người Dùng:</Text>
                     {/* User First Name  */}
                    <TextInput
                        style={styles.input}
                        placeholder="Tên Đầu Người Dùng"
                        value={userFront}
                        onChangeText={setUserFront}
                    />
                     <Text style={styles.label}>Tên Sau Người Dùng:</Text>
                    {/* User Last Name  */}
                    <TextInput
                        style={styles.input}
                        placeholder="Tên Sau Người Dùng"
                        value={userBack}
                        onChangeText={setUserBack}
                    />
                    <Text style={styles.label}>Mật Khẩu Người Dùng:</Text>
                    {/* User Pass */}
                    <TextInput
                        style={styles.input}
                        placeholder="Sửa Mật Khẩu Người Dùng"
                        value={userPass}
                        onChangeText={setUserPass}
                    />
                    <Text style={styles.label}>Địa Chỉ Người Dùng:</Text>
                    {/* User Sale */}
                    <TextInput
                        style={styles.input}
                        placeholder="Sửa Địa Chỉ Người Dùng"
                        value={userAddress}
                        onChangeText={setUserAddress}
                       
                    />
                    {/* User Sale */}
                    <Text style={styles.label}>Số Điện Thoại Người Dùng:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Sửa Số Điện Thoại Người Dùng"
                        value={userPhone}
                        onChangeText={setUserPhone}
                        keyboardType="numeric"
                    />

                    {/* User Category */}
                    <Text style={styles.label}>Quyền Người Dùng:</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.selectedValue}>{selectedValue}</Text>
                    </TouchableOpacity>

                    {/* Modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}>
                        {/* TouchableWithoutFeedback để đóng modal khi bấm bên ngoài */}
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalView}>
                                    <View style={styles.searchBar}>
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Tìm Kiếm Quền"
                                            value={searchQuery}
                                            onChangeText={handleSearch}
                                        />
                                       
                                    </View>
                                    <FlatList
                                        data={filteredCategories}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.modalItem}>
                                                <Text style={styles.modalText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    {/* Add/Edit Button */}
                    <TouchableOpacity style={styles.button} onPress={() => alert('User Edited')}>
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

export default EditUserScreen;
