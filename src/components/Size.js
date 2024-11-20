import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView, Alert } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';

const SizeScreen = ({ isVisible, onClose, onApply, onReset, selectedproductSizeId }) => {
    const [sizes, setsizes] = useState([]);    
    const [selectedsizes, setSelectedsizes] = useState(selectedproductSizeId || []); // Initialize as an array
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        let apiUrl = `${BASE_URL}product-sizes/category`;

        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.data;
                setsizes(data);
                
            } catch (error) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
            }
        };

        fetchData();
    }, []);

    const toggleCheckbox = (productSizeId) => {
        setSelectedsizes((prevSelected) =>
            prevSelected.includes(productSizeId)
                ? prevSelected.filter((id) => id !== productSizeId) // Remove if already selected
                : [...prevSelected, productSizeId] // Add if not selected
        );
    };

    const handleApply = () => {
        if (selectedsizes.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một kích thước trước khi áp dụng.");
            return;
        }

        const findSizeName = (productSizeId, sizes) => {
            for (const size of sizes) {
                if (size.productSizeId === productSizeId) {
                    return size.productSizeName;
                }
            }
            return null;
        };

        const selectedSizeNames = selectedsizes.map((SizeId) => {
            return findSizeName(SizeId, sizes) || "Unknown Category";
        });

        onApply(selectedsizes, selectedSizeNames);
        onClose();
    };

    const handleReset = () => {
        setSelectedsizes([]); // Reset size selection
        onReset();
        onClose();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded); // Toggle expand/collapse
    };

    const sizesToShow = isExpanded ? sizes : sizes.slice(0, 4);

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
                        {sizesToShow.map((category, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <View key={index} style={styles.checkboxRow}>
                                        <View style={styles.checkboxColumn}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => toggleCheckbox(sizesToShow[index].productSizeId)}
                                            >
                                                <Text style={styles.checkboxText}>
                                                    {sizesToShow[index].productSizeName.charAt(0).toUpperCase() + sizesToShow[index].productSizeName.slice(1)}
                                                </Text>
                                                {selectedsizes.includes(sizesToShow[index].productSizeId) && (
                                                    <View style={styles.checkedBox}>
                                                        <Text style={styles.tickCheckedBox}>✔</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>

                                        {sizesToShow[index + 1] && (
                                            <View style={styles.checkboxColumn}>
                                                <TouchableOpacity
                                                    style={styles.checkbox}
                                                    onPress={() => toggleCheckbox(sizesToShow[index + 1].productSizeId)}
                                                >
                                                    <Text style={styles.checkboxText}>
                                                        {sizesToShow[index + 1].productSizeName.charAt(0).toUpperCase() + sizesToShow[index + 1].productSizeName.slice(1)}
                                                    </Text>
                                                    {selectedsizes.includes(sizesToShow[index + 1].productSizeId) && (
                                                        <View style={styles.checkedBox}>
                                                            <Text style={styles.tickCheckedBox}>✔</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                );
                            }
                        })}
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
        height: '50%',
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
        width: 150,
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
        width: 150,
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

export default SizeScreen;