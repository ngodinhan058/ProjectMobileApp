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
import DateTimePicker from '@react-native-community/datetimepicker';
import UploadImage from '../../../../components/Up_Image';


const AddIdCardScreen = ({ route, navigation }) => {
    const [CCCDNumber, setCCCDNumber] = useState('');

    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Text style={styles.textHeader}>Thêm Thông Tin CCCD</Text>
                </View>



                {/* CCCD Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Số CCCD:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Thêm Số CCCD"
                        value={CCCDNumber}
                        onChangeText={setCCCDNumber}
                    />

                    <Text style={styles.label}>Ngày Cấp CCCD:</Text>
                    {/* Date of Birth */}
                    <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                        <Text style={{ lineHeight: 45 }}>{dateOfBirth ? dateOfBirth.toDateString() : 'Thêm Ngày Cấp'}</Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dateOfBirth}
                            mode="date"
                            display="default"
                            onChange={onDateChange}

                        />
                    )}
                    <Text style={styles.label}>Hình Mặt Trước CCCD:</Text>
                    {/* Icon Image */}
                    <UploadImage />
                    <Text style={styles.label}>Hình Mặt Sau CCCD:</Text>
                    {/* Icon Image */}
                    <UploadImage />



                    <TouchableOpacity style={styles.button} onPress={() => alert('CCCD Added/Edited')}>
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

export default AddIdCardScreen;
