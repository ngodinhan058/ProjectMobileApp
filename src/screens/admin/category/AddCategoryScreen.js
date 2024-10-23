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

const AddCategoryScreen = ({ navigation }) => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImg, setCategoryImg] = useState('');
    const [categoryStatusId, setCategoryStatusId] = useState('01000000-0000-0000-0000-000000000000'); // Default Status ID
    const [categoryParent, setCategoryParent] = useState('01000000-0000-0000-0000-000000000000'); // Default Parent ID

    const [categoryRelease, setCategoryRelease] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || categoryRelease;
        setShowDatePicker(false);
        setCategoryRelease(currentDate);
    };

    const handleAddCategory = async () => {
        try {
            // Gửi yêu cầu POST tới API
            const response = await axios.post(`${BASE_URL}category`, {
                categoryName: categoryName,
                categoryRelease: categoryRelease.toISOString().split('T')[0], // Chuyển ngày thành chuỗi định dạng 'YYYY-MM-DD'
                statusId: categoryStatusId,
                categoryParent: categoryParent,
                categoryImgPath: categoryImg,
            });

            // Kiểm tra kết quả trả về từ API
            if (response.status === 201) {
                Alert.alert('Thành công', 'Danh mục đã được thêm.');
                navigation.goBack(); // Quay lại màn hình trước đó
            }
        } catch (error) {
            console.error('Lỗi khi thêm danh mục:', error);
            Alert.alert('Lỗi', 'Không thể thêm danh mục.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Thêm Thông Tin Danh Mục</Text>
                </View>
                <Text style={styles.label}>Ảnh Danh Mục: (Link)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Tên Danh Mục"
                        value={categoryImg}
                        onChangeText={setCategoryImg}
                    />
                {/* Icon Image */}
                 {/* <UploadImage /> */}
                {/* Category Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Danh Mục:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Tên Danh Mục"
                        value={categoryName}
                        onChangeText={setCategoryName}
                    />

                    <Text style={styles.label}>Ngày Tạo Danh Mục:</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text>{categoryRelease ? categoryRelease.toDateString() : 'Thêm Ngày Tạo Danh Mục'}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={categoryRelease}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    {/* Status Danh Mục */}
                    <Text style={styles.label}>Status Danh Mục:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Status Danh Mục"
                        value={categoryStatusId}
                        onChangeText={setCategoryStatusId}
                    />

                    {/* Parent Danh Mục */}
                    <Text style={styles.label}>Parent Danh Mục:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập Parent Danh Mục"
                        value={categoryParent}
                        onChangeText={setCategoryParent}
                    />

                    {/* Add Button */}
                    <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
                        <Text style={styles.buttonText}>Thêm</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};



// const AddCategoryScreen = ({ route, navigation }) => {
//     const [categoryName, setcategoryName] = useState('');
//     const [categorySlug, setcategorySlug] = useState('');

//     const [dateOfBirth, setDateOfBirth] = useState(new Date());
//     const [showDatePicker, setShowDatePicker] = useState(false);
//     const onDateChange = (event, selectedDate) => {
//         const currentDate = selectedDate || dateOfBirth;
//         setShowDatePicker(false);
//         setDateOfBirth(currentDate);
//     };

//     const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

//     const toggleFilterModal = () => {
//         setIsFilterModalVisible(!isFilterModalVisible);
//     };

   
//     const handleResetFilters = () => {
//         setAppliedFilters(null); // Khi reset, đưa appliedFilters về null
//     };
//     return (
//         <View style={styles.container}>
//             <ScrollView>
//                 {/* Header */}
//                 <View style={styles.header}>
//                     <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
//                         <Icon name="angle-left" size={35} color="#000" />
//                     </Pressable>
//                     <Text style={styles.textHeader}>Thêm Thông Tin Danh Mục</Text>
//                 </View>

//                 {/* Icon Image */}
//                 <UploadImage />

//                 {/* Category Form */}
//                 <View style={styles.formContainer}>
//                     <Text style={styles.label}>Tên Danh Mục:</Text>
//                     {/* Category Name */}
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Thêm Tên Danh Mục"
//                         value={categoryName}
//                         onChangeText={setcategoryName}
//                     />
                    
//                     {/* Category Releaase */}
//                     <Text style={styles.label}>Ngày Tạo Danh Mục:</Text>
//                     <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
//                         <Text>{dateOfBirth ? dateOfBirth.toDateString() : 'Thêm Ngày Tạo Danh Mục'}</Text>
//                     </TouchableOpacity>
//                     {showDatePicker && (
//                         <DateTimePicker
//                             value={dateOfBirth}
//                             mode="date"
//                             display="default"
//                             onChange={onDateChange}
//                         />
//                     )}
//                      {/* Category Parent */}
//                      <Text style={styles.label}>Status Danh Mục:</Text>
//                     <TouchableOpacity style={styles.input} onPress={toggleFilterModal}>
//                         <Text>Thêm Status Danh Mục</Text>
//                     </TouchableOpacity>
//                     {/* Filter Modal Component */}
//                     <TextInput value='01000000-0000-0000-0000-000000000000'/>
//                     {/* Category Parent */}
//                     <Text style={styles.label}>Parent Danh Mục:</Text>
//                     <TouchableOpacity style={styles.input} onPress={toggleFilterModal}>
//                         <Text>Thêm Parent Danh Mục</Text>
//                     </TouchableOpacity>
//                     {/* Filter Modal Component */}
//                     <SelectorInCategory
//                         isVisible={isFilterModalVisible}
//                         onClose={toggleFilterModal}
//                         onReset={handleResetFilters}
//                     />
//                     {/* Add/Edit Button */}
//                     <TouchableOpacity style={styles.button} onPress={() => alert('Category Added')}>
//                         <Text style={styles.buttonText}>Thêm</Text>
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };


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

export default AddCategoryScreen;
