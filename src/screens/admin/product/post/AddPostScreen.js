import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
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
import UploadImage from '../../../../components/Up_Image_Multi';

const AddPostScreen = ({ route, navigation }) => {
    const [postName, setPostName] = useState('');
    const [postPrice, setPostPrice] = useState('');
    const [postQuantity, setPostQuantity] = useState('');
    const [postSale, setPostSale] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Chọn loại sản phẩm');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryType, setNewCategoryType] = useState('');

    const [categories, setCategories] = useState(['Apple', 'Vivo', 'Samsung', 'Xiaomi']);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = (value) => {
        setSearchQuery(value);
    };

    const handleSelect = (value) => {
        setSelectedValue(value);
        setModalVisible(false);
    };

    const handleAddCategory = () => {
        if (newCategoryName && newCategoryType) {
            setCategories([...categories, `${newCategoryName} (${newCategoryType})`]);
            setAddModalVisible(false);
            setNewCategoryName('');
            setNewCategoryType('');
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
                    <Text style={styles.textHeader}>Thêm Thông Tin Post</Text>
                </View>

                {/* Icon Image */}
                <UploadImage />

                {/* Post Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Tên Post"
                        value={postName}
                        onChangeText={setPostName}
                    />

                    <Text style={styles.label}>Slug Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Slug Post"
                        value={postPrice}
                        onChangeText={setPostPrice}
                    />

                    <Text style={styles.label}>Loại Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Loại Post"
                        value={postQuantity}
                        onChangeText={setPostQuantity}
                    />

                    <Text style={styles.label}>Chi Tiết Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Chi Tiết Post"
                        value={postSale}
                        onChangeText={setPostSale}
                    />

                    {/* Post Category */}
                    <Text style={styles.label}>Post Status</Text>
                    <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.selectedValue}>{selectedValue}</Text>
                    </TouchableOpacity>

                    {/* Modal chọn category */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}>
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalView}>
                                    <View style={styles.searchBar}>
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Tìm kiếm/ Thêm Status"
                                            value={searchQuery}
                                            onChangeText={handleSearch}
                                        />
                                        <TouchableOpacity
                                            style={styles.filter}
                                            onPress={() => setAddModalVisible(true)}>
                                            <Text style={styles.iconCenter}>+</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={filteredCategories}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(item)}
                                                style={styles.modalItem}>
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

                    {/* Modal thêm category mới */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={addModalVisible}
                        onRequestClose={() => setAddModalVisible(false)}>
                        <TouchableWithoutFeedback onPress={() => setAddModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.addModalView}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Tên Category"
                                        value={newCategoryName}
                                        onChangeText={setNewCategoryName}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Loại Category"
                                        value={newCategoryType}
                                        onChangeText={setNewCategoryType}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={handleAddCategory}>
                                        <Text style={styles.buttonText}>Thêm</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.button} onPress={() => setAddModalVisible(false)}>
                                        <Text style={styles.buttonText}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <TouchableOpacity style={styles.button} onPress={() => alert('Post Added/Edited')}>
                        <Text style={styles.buttonText}>Thêm</Text>
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
    addModalView: {
        position: 'absolute',
        width: '90%',
        marginHorizontal: 20,
        padding: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 300,
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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
    filter: {
        position: 'absolute',
        width: 50,
        height: 50,
        backgroundColor: '#fafafa',
        borderRadius: 10,
        alignItems: 'center',
        right: 0,
    },
    iconCenter: {
        fontSize: 35,
        color: '#3669c9',
    },
});

export default AddPostScreen;
