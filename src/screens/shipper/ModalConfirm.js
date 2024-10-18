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


const ShipperConfirm = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const modalSelect = (value) => {
        setModalVisible(false);
    };



    return (
        <View style={styles.container}>
            {/* Post Category */}
            <Text style={styles.label}>Bấm để Hiện Modal</Text>
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.selectedValue}></Text>
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

                            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 50 }}>
                                <Text style={{ fontSize: 23, color:'#fff', fontWeight: 'bold', textAlign: 'center' }}>Bạn muốn thoát khỏi tài khoản hiện tại?</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }} >
                                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Đồng Ý</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Huỷ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#fff',
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
        backgroundColor: '#3669c9',
        borderRadius: 20,
        
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: 250
        
    },
   

    button: {
        width: '45%',
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 10,
        marginVertical: 10
    },
    buttonText: {
        color: 'red',
        fontSize: 18,
        fontWeight: '300',
    },

});

export default ShipperConfirm;
