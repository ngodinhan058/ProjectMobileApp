import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';


const FilterScreen = ({ isVisible, id, onClose, onApply, onReset }) => {
    const [Sizes, setSizes] = useState([]);
    const [supplier, setSupplier] = useState([]);

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState([]);

    const [loading, setLoading] = useState();
    const [priceRange, setPriceRange] = useState([0, 2000000]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpandedSupplier, setIsExpandedSupplier] = useState(false);
    const [sortOption, setSortOption] = useState();

    const fetchData = async () => {
        try {
            let supplierApiUrl = '';
            let SizesApiUrl = '';

            if (id === undefined) {
                supplierApiUrl = `${BASE_URL}product-suppliers/category`;
                SizesApiUrl = `${BASE_URL}product-sizes/category`;
            } else {
                supplierApiUrl = `${BASE_URL}product-suppliers/category/${id}?`;
                SizesApiUrl = `${BASE_URL}product-sizes/category/${id}?`;
            }

            const [supplierResponse, SizesResponse] = await Promise.all([
                axios.get(supplierApiUrl),
                axios.get(SizesApiUrl),
            ]);
            const supplierData = supplierResponse.data.data;

            const SizesData = SizesResponse.data.data;
            setSupplier(supplierData);
            setSizes(SizesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
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
    const toggleRadiobox = (productSupplierSd) => {
        const newSelectedSizes = selectedSizes.includes(productSupplierSd)
            ? selectedSizes.filter((id) => id !== productSupplierSd)
            : [...selectedSizes, productSupplierSd];

        setSelectedSizes(newSelectedSizes); // Toggle the size ID in the array
    };
    const toggleCheckbox = (productSupllierId) => {
        setSelectedSupplier(productSupllierId);
    };
    const handleSortChange = (value) => {
        setSortOption(value); // Cập nhật giá trị sort
    };
    const handleApply = () => {
        const selectedFilters = {
            sizes: selectedSizes,
            priceRange,
            sort: sortOption,
            supplier: selectedSupplier
        };

        // Gọi hàm onApply với dữ liệu lọc và đóng modal
        onApply(selectedFilters);
        onClose();
    };

    const handleReset = () => {
        setSelectedSizes([]);
        setPriceRange([0, 2000000]);
        setSortOption(null);
        onReset();
        onClose();
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    const toggleExpandSupplier = () => {
        setIsExpandedSupplier(!isExpandedSupplier);
    };

    // Hiển thị 4 mục đầu tiên hoặc tất cả tùy thuộc vào trạng thái
    const SizesToShow = isExpanded ? Sizes : Sizes.slice(0, 5);
    const SupplierToShow = isExpandedSupplier ? supplier : supplier.slice(0, 4);


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
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                    <Text style={styles.titleSmall}>Màu:</Text>
                    <View style={styles.radioCheckContainer}>
                        {SizesToShow.map((category, index) => (
                            <View key={index} style={styles.checkboxRow}>
                                <View style={styles.checkboxColumn}>
                                    <TouchableOpacity
                                        style={{
                                            width: 62,
                                            height: 55,
                                            borderWidth: 2,
                                            borderColor: '#000',
                                            borderRadius: 10,
                                            backgroundColor: `${category.productSizeName}`,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: 5,
                                            marginRight: 8,
                                        }}
                                        onPress={() => toggleRadiobox(category.productSizeId)}
                                    >

                                        {selectedSizes.includes(category.productSizeId) && (
                                            <View style={styles.radioCheckedBox}>
                                                <Text style={styles.tickCheckedBox}>✔</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                    {Sizes.length > 5 ? (<TouchableOpacity onPress={toggleExpand}>
                        <Text style={styles.toggleButtonText}>
                            {isExpanded ? 'Thu gọn lại' : 'Hiển thị thêm'}
                        </Text>
                    </TouchableOpacity>) : null}
                    

                    <View style={styles.line}></View>
                    <Text style={styles.titleSmall}>Thương Hiệu:</Text>
                    <View style={styles.checkboxContainer}>
                        {SupplierToShow.map((supplier, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <View key={index} style={styles.checkboxRow}>
                                        {/* First checkbox of the row */}
                                        <View style={styles.checkboxColumn}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => toggleCheckbox(SupplierToShow[index].productSupplierSd)}
                                            >
                                                <Text style={styles.checkboxText}>
                                                    {SupplierToShow[index].productSupplierName.charAt(0).toUpperCase() + SupplierToShow[index].productSupplierName.slice(1)}
                                                </Text>
                                                {selectedSupplier === SupplierToShow[index].productSupplierSd && (
                                                    <View style={styles.checkedBox}>
                                                        <Text style={styles.tickCheckedBox}>✔</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        </View>

                                        {/* Second checkbox of the row */}
                                        {SupplierToShow[index + 1] && (
                                            <View style={styles.checkboxColumn}>
                                                <TouchableOpacity
                                                    style={styles.checkbox}
                                                    onPress={() => toggleCheckbox(SupplierToShow[index + 1].productSupplierSd)}
                                                >
                                                    <Text style={styles.checkboxText}>
                                                        {SupplierToShow[index + 1].productSupplierName.charAt(0).toUpperCase() + SupplierToShow[index + 1].productSupplierName.slice(1)}
                                                    </Text>
                                                    {selectedSupplier === SupplierToShow[index + 1].productSupplierSd && (
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

                    {supplier.length > 4 ? ( <TouchableOpacity onPress={toggleExpandSupplier}>
                        <Text style={styles.toggleButtonText}>
                            {isExpandedSupplier ? 'Thu gọn lại' : 'Hiển thị thêm'}
                        </Text>
                    </TouchableOpacity>) : null}
                   
                    <View style={styles.line}></View>
                    {/* Kết thúc danh mục */}
                    <Text style={styles.titleSmall}>Sắp Xếp:</Text>

                    <CustomRadioButton
                        label="Tăng Dần (Giá)"
                        value="asc|productPriceSale"
                        selected={sortOption === 'asc|productPriceSale'}
                        onSelect={handleSortChange}
                    />

                    <CustomRadioButton
                        label="Giảm Dần (Giá)"
                        value="desc|productPriceSale"
                        selected={sortOption === 'desc|productPriceSale'}
                        onSelect={handleSortChange}
                    />

                    <CustomRadioButton
                        label="Giảm Dần (Sale)"
                        value="desc|productSale"
                        selected={sortOption === 'desc|productSale'}
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
    radioCheckContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
        height: 55,
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
        height: 55,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: '#3669c9'
    },
    radioCheckedBox: {
        width: 62,
        height: 55,
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