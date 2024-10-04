import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const SuccessScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Biểu tượng thành công */}
            <View style={styles.iconContainer}>
                <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}><Icon name="check" size={100} color="#fff" /></Text>
                </View>
            </View>

            {/* Thông báo thành công */}
            <Text style={styles.successText}>Xác nhận thành công</Text>

            {/* Nút quay lại */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    iconContainer: {
        marginBottom: 30,
    },
    checkCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#3669c9', // Màu của biểu tượng
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkMark: {
        color: '#fff',
        fontSize: 50,
        fontWeight: 'bold',
    },
    successText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#3669c9', // Màu chữ thành công
        marginBottom: 40,
    },
    backButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#3669c9', // Màu của nút back
        borderRadius: 8,
        marginTop: 200,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 60,
    },
});

export default SuccessScreen;
