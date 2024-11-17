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


const EditPostScreen = ({ route, navigation }) => {
    const { savedData } = route.params || {};

    const [postData, setPostData] = useState({
        postName: savedData?.postName || '',
        postContent: savedData?.postContent || '',
        postImagePath: 'img/product01.png',
        postType: 1,
        userId: '4e98028c-2157-4568-a9bc-c21033bad79a',
        postStatusId: '03000000-0000-0000-0000-000000000000'
    });
    const handleNavigateToProduct = () => {
        // Truyền postData sang ProductScreen
        navigation.navigate('EditProductScreen', { postDTO: postData });
    };
    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Sửa Thông Tin Post</Text>
                </View>

                {/* Icon Image */}
                {/* <UploadImage /> */}

                {/* Post Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Tên Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Tên Post"
                        value={postData.postName}
                        onChangeText={(text) => setPostData({ ...postData, postName: text })}
                    />
                    {/* <Text style={styles.label}>Loại Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={postData.postRelease}
                        onChangeText={(text) => setPostData({ ...postData, postRelease: text })}
                    /> */}

                    <Text style={styles.label}>Content Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Content Post"
                        value={postData.postContent}
                        onChangeText={(text) => setPostData({ ...postData, postContent: text })}
                    />


                    <TouchableOpacity style={styles.button} onPress={handleNavigateToProduct}>
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
        marginTop: '30%',
    },
});

export default EditPostScreen;