import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';


const PermissionScreen = ({ isVisible, onClose, onApply, onReset, selectedpermissionName }) => {
    const [permissions, setPermissions] = useState([]);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState([]); // Initialize as an empty array
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const apiUrl = `${BASE_URL}contentslides`;

        const fetchPermissions = async () => {
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.data;
                setPermissions(data);

                // Find and set the ID based on selectedpermissionName
                const matchingPermission = data.find(
                    (permission) => permission.content === selectedpermissionName
                );
                if (matchingPermission) {
                    setSelectedPermissionIds([matchingPermission.id]);
                }
            } catch (error) {
                console.error('Error fetching permissions:', error.response ? error.response.data : error.message);
            }
        };

        fetchPermissions();
    }, [selectedpermissionName]); // Re-run if selectedpermissionName changes

    const handleCheckboxToggle = (permissionId) => {
        setSelectedPermissionIds((prev) =>
            prev.includes(permissionId) ? [] : [permissionId]
        );
    };

    const handleApply = () => {
        if (selectedPermissionIds.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một quyền trước khi áp dụng.");
            return;
        }

        const getPermissionName = (permissionId, permissions) => {
            for (const permission of permissions) {
                if (permission.id === permissionId) {
                    return permission.content;
                }
            }
            return null;
        };

        const selectedPermissionNames = selectedPermissionIds.map((permissionId) => {
            return getPermissionName(permissionId, permissions) || "Unknown";
        });

        onApply(selectedPermissionIds, selectedPermissionNames);
        onClose();
    };

    const handleReset = () => {
        setSelectedPermissionIds([]); // Reset permission selection
        onReset();
        onClose();
    };

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev); // Toggle expand/collapse
    };

    const displayedPermissions = isExpanded ? permissions : permissions.slice(0, 3);

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <Text style={styles.title}>Kích Thước</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.checkboxContainer}>
                        {displayedPermissions.map((permission, index) => (
                            <View key={index} style={styles.checkboxRow}>
                                <View style={styles.checkboxColumn}>
                                    <TouchableOpacity
                                        style={styles.checkbox}
                                        onPress={() => handleCheckboxToggle(permission.id)}
                                    >
                                        <Text style={styles.checkboxText}>
                                            {permission.content}
                                        </Text>
                                        {selectedPermissionIds.includes(permission.id) && (
                                            <View style={styles.checkedBox}>
                                                <Text style={styles.tickCheckedBox}>✔</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity onPress={toggleExpand}>
                        <Text style={styles.toggleButtonText}>
                            {isExpanded ? 'Thu gọn lại' : 'Hiển thị thêm'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'relative',
    },
    container: {
        position: 'absolute',
        width: '100%',
        padding: 20,
        backgroundColor: '#FFF',
        height: '60%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        bottom: 0,
    },
    scrollView: {
        height: '20%',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    titleSmall: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    sliderContainer: {
        marginHorizontal: 15,

    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    resetButton: {
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
    },
    applyButton: {
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3669c9',
        borderRadius: 10,
    },
    applyText: {
        color: 'white',
    },
    checkboxContainer: {
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    checkboxColumn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: "98%",
        height: 50,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxText: {
        position: 'absolute',
        fontSize: 16,
    },
    checkedBox: {
        width: "101%",
        height: 50,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: '#3669c9'
    },
    tickCheckedBox: {
        position: 'absolute',
        width: 15,
        height: 15,
        backgroundColor: '#3669c9',
        borderRadius: 15,
        textAlign: 'center',
        color: '#fff',
        right: 5,
        top: 5,
        fontSize: 10,
    },
    toggleButtonText: {
        color: '#0066ff',
        textAlign: 'center',
        marginTop: 10,
    },

    radioContainer: {
        width: '100%',
        height: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3669c9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#3669c9',
    },
    radioText: {
        fontSize: 16,
    },
});

export default PermissionScreen;