import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';


const FilterScreen = ({ isVisible, onClose, onApply, onReset }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(null);


    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [sortOption, setSortOption] = useState();

    useEffect(() => {
        let apiUrl = `${BASE_URL}categories`;

        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                const data = response.data.data;
                setCategories(data);
                // Initialize selectedCategories with false for each category

                setSelectedCategories();
            } catch (error) {
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
            }
        };

        fetchData();
    }, []);


    const handleSliderChange = (values) => {
        setPriceRange(values);
    };
    const CustomRadioButton = ({ label, value, selected, onSelect }) => {
        return (
            <>
                <TouchableOpacity style={styles.radioContainer} onPress={() => onSelect(value)}>
                    <Text style={styles.radioText}>{label}</Text>
                    <View style={styles.outerCircle}>
                        {selected && <View style={styles.innerCircle} />}
                    </View>

                </TouchableOpacity>
                <View style={styles.line}></View>
            </>
        );
    };
    const toggleCheckbox = (categoryId) => {
        setSelectedCategories(categoryId);
    };
    const handleSortChange = (value) => {
        setSortOption(value); // Cập nhật giá trị sort
    };
    const handleApply = () => {

        // Tạo đối tượng filter chỉ chứa các category đã chọn và khoảng giá
        const selectedFilters = {
            categories: selectedCategories, // Chỉ truyền ID các danh mục đã chọn
            priceRange,
            sort: sortOption,
        };

        // Gọi hàm onApply với dữ liệu lọc và đóng modal
        onApply(selectedFilters);
        onClose();
    };

    const handleReset = () => {
        // Reset categories and price range
        const resetSelected = {};
        categories.forEach(category => {
            resetSelected[category.categoryId] = false;
        });
        setSelectedCategories(resetSelected);
        setPriceRange([0, 2000000]);
        setSortOption(null);
        onReset();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Hiển thị 4 mục đầu tiên hoặc tất cả tùy thuộc vào trạng thái
    const categoriesToShow = isExpanded ? categories : categories.slice(0, 4);

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
                <Text style={styles.title}>Bộ lọc và Sắp Xếp</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator= {false}>
                    <View style={styles.sliderContainer}>
                        <Text style={styles.titleSmall}>Giá:</Text>
                        <MultiSlider
                            values={priceRange}
                            sliderLength={300}
                            onValuesChange={handleSliderChange}
                            min={0}
                            max={2000000}
                            step={100000}
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
                    <Text style={styles.titleSmall}>Danh Mục:</Text>

                    <View style={styles.checkboxContainer}>
                        {categoriesToShow.map((category, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <View key={index} style={styles.checkboxRow}>
                                        {/* First checkbox of the row */}
                                        <View style={styles.checkboxColumn}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => toggleCheckbox(categoriesToShow[index].categoryId)}
                                            >
                                                <Text style={styles.checkboxText}>
                                                    {categoriesToShow[index].categoryName.charAt(0).toUpperCase() + categoriesToShow[index].categoryName.slice(1)}
                                                </Text>
                                                {selectedCategories === categoriesToShow[index].categoryId && (
                                                    <View style={styles.checkedBox}>
                                                        <Text style={styles.tickCheckedBox}>✔</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>

                                        {/* Second checkbox of the row */}
                                        {categoriesToShow[index + 1] && (
                                            <View style={styles.checkboxColumn}>
                                                <TouchableOpacity
                                                    style={styles.checkbox}
                                                    onPress={() => toggleCheckbox(categoriesToShow[index + 1].categoryId)}
                                                >
                                                    <Text style={styles.checkboxText}>
                                                        {categoriesToShow[index + 1].categoryName.charAt(0).toUpperCase() + categoriesToShow[index + 1].categoryName.slice(1)}
                                                    </Text>
                                                    {selectedCategories === categoriesToShow[index + 1].categoryId && (
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
                    <View style={styles.line}></View>
                    {/* Kết thúc danh mục */}
                    <Text style={styles.titleSmall}>Sắp Xếp:</Text>

                    <CustomRadioButton
                        label="Tăng Dần (Giá)"
                        value="price|asc"
                        selected={sortOption === 'price|asc'}
                        onSelect={handleSortChange}
                    />

                    <CustomRadioButton
                        label="Giảm Dần (Giá)"
                        value="price|desc"
                        selected={sortOption === 'price|desc'}
                        onSelect={handleSortChange}
                    />

                    <CustomRadioButton
                        label="Giảm Dần (Sale)"
                        value="sale|desc"
                        selected={sortOption === 'sale|desc'}
                        onSelect={handleSortChange}
                    />

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
        height: '80%',
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
        justifyContent:'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
    },
    applyButton: {
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
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

export default FilterScreen;
