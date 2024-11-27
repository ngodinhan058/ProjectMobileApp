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
import DateTimePicker from '@react-native-community/datetimepicker';
import SelecteOneParent from '../../../components/SelecteOneParent';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const EditProductScreen = ({ route, navigation }) => {
    const { id, image, name, parent } = route.params; // categoryId truyền từ màn hình trước
    const [categoryName, setcategoryName] = useState(name);
    const [categoryImg, setCategoryImg] = useState(image);
    const [categoryStatusId, setCategoryStatusId] = useState('02000000-0000-0000-0000-000000000000');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [parentCategoryId, setParentCategoryId] = useState(parent || null); // ID của danh mục cha
    const [parentCategoryName, setParentCategoryName] = useState();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

    // console.log(parent);

    // Hàm để cập nhật danh mục
    const updateCategory = async () => {
        try {
            const formattedDate = dateOfBirth.toISOString().split('T')[0]; // Định dạng lại ngày

            // Xác định giá trị cho parentCategoryId
            const parentId = Array.isArray(parentCategoryId) ? parentCategoryId[0] : parentCategoryId;

            const payload = {
                categoryName,
                statusId: categoryStatusId,
                categoryRelease: formattedDate,
                categoryParent: parentId,
                categoryImgPath: categoryImg,
            };

            console.log("Payload:", payload);
            const apiUrl = `${BASE_URL}category/${id}`;
            console.log("API URL:", apiUrl);

            // Thực hiện yêu cầu cập nhật
            const response = await axios.put(apiUrl, payload);

            alert('Category Updated Successfully');
            navigation.replace('CategoryList');
        } catch (error) {
            // Log lỗi chi tiết
            console.error('Error updating category:', error);
            alert('Failed to update category');
        }
    };



    const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);

    const handleResetFilters = () => setParentCategoryId(null);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Sửa Thông Tin Danh Mục</Text>
                </View>
                <Text style={styles.label}>Ảnh Danh Mục: (Link)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Thêm Tên Danh Mục"
                    value={categoryImg}
                    onChangeText={setCategoryImg}
                />
                {/* Tên danh mục */}
                <Text style={styles.label}>Tên Danh Mục:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Sửa Tên Danh Mục"
                    value={categoryName}
                    onChangeText={setcategoryName}
                />

                {/* Ngày tạo danh mục */}
                <Text style={styles.label}>Ngày tạo danh mục: </Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                    <Text>{dateOfBirth ? dateOfBirth.toDateString() : 'Sửa Ngày Tạo Danh Mục'}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dateOfBirth}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}

                {/* Chọn danh mục cha */}
                <Text style={styles.label}>Thêm Danh Mục Cha:</Text>
                <TouchableOpacity style={styles.input} onPress={toggleFilterModal}>
                    {parentCategoryId ? (<Text>Đã Chọn Danh Mục Cha</Text>) : (<Text>Chưa Chọn Danh Mục Cha</Text>)}
                </TouchableOpacity>

                {/* Modal để chọn danh mục cha */}
                <SelecteOneParent
                    isVisible={isFilterModalVisible}
                    onClose={toggleFilterModal}
                    selectedcategoryId={parent}
                    onReset={handleResetFilters}
                    onApply={(selectedFilters) => {
                        setParentCategoryId(selectedFilters.category);
                        setParentCategoryName(selectedFilters.categoryName);
                    }}
                />

                {/* Nút Sửa */}
                <TouchableOpacity style={styles.button} onPress={updateCategory}>
                    <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
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
