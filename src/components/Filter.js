import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const FilterScreen = ({ isVisible, onClose, onApply, onReset }) => {
    const [selectedCategories, setSelectedCategories] = useState({
        Phone: false,
        Headphone: false,
        Computer: false,
        Laptop: false,
        Laptop1: false,
        Laptop2: false,
        Laptop3: false,
    });

    const initialCategories = {
        Phone: false,
        Headphone: false,
        Computer: false,
        Laptop: false,
        Laptop1: false,
        Laptop2: false,
        Laptop3: false,
    };

    const toggleCheckbox = (category) => {
        setSelectedCategories({
            ...selectedCategories,
            [category]: !selectedCategories[category],
        });
    };

    const [priceRange, setPriceRange] = useState([50000, 50000000]);
    const [isExpanded, setIsExpanded] = useState(false); // State kiểm soát hiển thị thêm danh mục

    const handleSliderChange = (values) => {
        setPriceRange(values);
    };

    const handleApply = () => {
        const selectedFilters = {
            categories: selectedCategories,
            priceRange,
        };
        onApply(selectedFilters); // Truyền dữ liệu đã chọn ra ngoài khi bấm Apply
        onClose(); // Đóng modal
    };

    const handleReset = () => {
        setSelectedCategories(initialCategories); // Reset lại categories
        setPriceRange([50000, 50000000]); // Reset lại khoảng giá
        onReset();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded); // Chuyển đổi trạng thái mở rộng
    };

    // Hiển thị 4 mục đầu tiên hoặc tất cả tùy thuộc vào trạng thái
    const categoriesToShow = isExpanded
        ? Object.keys(selectedCategories) // Hiển thị tất cả nếu mở rộng
        : Object.keys(selectedCategories).slice(0, 4); // Chỉ hiển thị 4 mục đầu tiên

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
                <Text style={styles.title}>Bộ lọc Tìm Kiếm</Text>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.titleSmall}>Giá</Text>
                        <MultiSlider
                            values={priceRange}
                            sliderLength={300}
                            onValuesChange={handleSliderChange}
                            min={50000}
                            max={50000000}
                            step={50000}
                            selectedStyle={{ backgroundColor: '#3669c9' }}
                            unselectedStyle={{ backgroundColor: '#d3d3d3' }}
                            markerStyle={{
                                backgroundColor: '#fff',
                                height: 25,
                                width: 25,
                                borderWidth: 6,
                                borderColor: '#3669c9',
                            }}
                        />
                        <View style={styles.priceLabels}>
                            <Text>{priceRange[0].toLocaleString('vi-VN')} đ</Text>
                            <Text>{priceRange[1].toLocaleString('vi-VN')} đ</Text>
                        </View>
                    </View>

                    <View style={styles.line}></View>
                    {/* Cập nhật cách hiển thị danh mục */}
                    <Text style={styles.titleSmall}>Danh Mục</Text>

                    <View style={styles.checkboxContainer}>
                        {categoriesToShow.map((category, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <View key={index} style={styles.checkboxRow}>
                                        {/* Mục checkbox đầu tiên của dòng */}
                                        <View style={styles.checkboxColumn}>


                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => toggleCheckbox(categoriesToShow[index])}
                                            >
                                                <Text style={styles.checkboxText}>
                                                    {categoriesToShow[index].charAt(0).toUpperCase() + categoriesToShow[index].slice(1)}
                                                </Text>
                                                {selectedCategories[categoriesToShow[index]] && <View style={styles.checkedBox}><Text style={styles.tickCheckedBox}>✔</Text></View>}
                                            </TouchableOpacity>
                                        </View>
                                        {/* Mục checkbox thứ hai của dòng */}
                                        {categoriesToShow[index + 1] && (
                                            <View style={styles.checkboxColumn}>
                                                <TouchableOpacity
                                                    style={styles.checkbox}
                                                    onPress={() => toggleCheckbox(categoriesToShow[index + 1])}
                                                >
                                                    <Text style={styles.checkboxText}>
                                                        {categoriesToShow[index + 1].charAt(0).toUpperCase() + categoriesToShow[index + 1].slice(1)}
                                                    </Text>
                                                    {selectedCategories[categoriesToShow[index + 1]] && <View style={styles.checkedBox}><Text style={styles.tickCheckedBox}>✔</Text></View>}
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
                    <View style={styles.line}></View>
                    {/* Kết thúc danh mục */}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        height: '70%',
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
        marginBottom: 5,
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
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    applyButton: {
        padding: 10,
        backgroundColor: '#0066ff',
        borderRadius: 5,
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
    tickCheckedBox:{
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
});

export default FilterScreen;
