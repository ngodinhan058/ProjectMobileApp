import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Modal, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

import { BASE_URL } from '../../api/config';
import { ScrollView } from 'react-native-gesture-handler';

const ShipmentForm = () => {
    const [shipmentDate, setShipmentDate] = useState('2024-11-11');
    const [shipmentDiscount, setShipmentDiscount] = useState('');
    const [shipmentShipCost, setShipmentShipCost] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedSize, setSelectedSize] = useState({});
    const [productDetails, setProductDetails] = useState({});
    const [modalVisibility, setModalVisibility] = useState({
        productSelection: false,
        supplierSelection: false,
        sizeSelection: false,
        productEdit: false,
    });
    const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [products, setProducts] = useState([]);
    const [productsName, setProductsName] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsApiUrl = `${BASE_URL}products`;
            const suppliersApiUrl = `${BASE_URL}product-suppliers/category`;
            const sizesApiUrl = `${BASE_URL}product-sizes/category`;

            const [productsResponse, suppliersResponse, sizesResponse] = await Promise.all([
                axios.get(productsApiUrl),
                axios.get(suppliersApiUrl),
                axios.get(sizesApiUrl),
            ]);

            setProducts(productsResponse.data.data.content);
            setSuppliers(suppliersResponse.data.data);
            setSizes(sizesResponse.data.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prevSelectedProducts) => {
            if (prevSelectedProducts.includes(productId)) {
                return prevSelectedProducts.filter((id) => id !== productId);
            } else {
                return [...prevSelectedProducts, productId];
            }
        });
    };

    const handleSelectSupplier = (supplierId) => {
        setSelectedSupplier(supplierId);
        setModalVisibility({ ...modalVisibility, supplierSelection: false });
    };

    const handleEditProduct = (productId) => {
        setSelectedProductForEdit(productId);
        setModalVisibility({ ...modalVisibility, productEdit: true });
    };

    // Hàm xử lý chọn kích thước cho từng sản phẩm
    const handleSelectSize = (productId, sizeId) => {
        setSelectedSize((prevSelectedSizes) => ({
            ...prevSelectedSizes,
            [productId]: sizeId, // Lưu kích thước của từng sản phẩm theo productId
        }));
    };

    const handleSaveProductDetails = () => {
        setProductDetails({
            ...productDetails,
            [selectedProductForEdit]: {
                price: productPrice,
                quantity: productQuantity,
            },
        });
        setModalVisibility({ ...modalVisibility, productEdit: false });
    };


    const handleSubmit = async () => {
        // Kiểm tra điều kiện hợp lệ cho dữ liệu nhập
        if (
            !shipmentDate ||
            !shipmentDiscount ||
            !shipmentShipCost ||
            !selectedSupplier ||
            selectedProducts.some(
                (productId) =>
                    !productDetails[productId]?.price ||
                    !productDetails[productId]?.quantity ||
                    !selectedSize[productId] // Kiểm tra xem size có được chọn cho mỗi sản phẩm không
            )
        ) {
            Alert.alert('Thông Báo', 'Vui Lòng Kiểm Tra Kĩ');
            return;
        }

        // Tạo dữ liệu form để gửi lên server
        const formData = {
            shipmentDate: shipmentDate, // Định dạng ngày thành "YYYY-MM-DD"
            shipmentDiscount: parseFloat(shipmentDiscount),
            shipmentShipCost: parseFloat(shipmentShipCost),
            supplierId: selectedSupplier,
            shipmentProducts: selectedProducts.map((productId) => ({
                productId,
                productPrice: productDetails[productId]?.price,
                productQuantity: productDetails[productId]?.quantity,
                sizeProduct: selectedSize[productId], // Thêm size cho từng sản phẩm
            })),
        };
        console.log(formData);

        try {
            // Gửi dữ liệu formData đến API
            const response = await axios.post(`${BASE_URL}shipment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Form submitted:', response.data);
            Alert.alert('Success', 'Tạo Lô Hàng Thành Công');
        } catch (error) {
            // Xử lý lỗi nếu có phản hồi từ server hoặc lỗi kết nối
            if (error.response && error.response.data) {
                console.log('Error response:', error.response.data);
                Alert.alert('Lỗi', error.response.data.message || 'Lỗi khi tạo lô hàng');
            } else {
                console.error('Error:', error.message);
                Alert.alert('Lỗi', 'Lỗi mạng hoặc không thể kết nối đến server');
            }
        }
    };


    const getInputStyle = (value) => ({
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
        borderColor: value ? 'black' : 'red',  // Red border if empty or undefined
    });

    return (
        <View style={{ padding: 20 }}>
            <ScrollView>
                <Text>Shipment Date:</Text>
                <TextInput
                    value={shipmentDate}
                    onChangeText={setShipmentDate}
                    placeholder="Enter shipment date"
                    style={getInputStyle(shipmentDate)}
                />

                <Text>Shipment Discount:</Text>
                <TextInput
                    value={shipmentDiscount}
                    onChangeText={setShipmentDiscount}
                    placeholder="Enter shipment discount"
                    style={getInputStyle(shipmentDiscount)}
                    keyboardType="numeric"
                />

                <Text>Shipment Ship Cost:</Text>
                <TextInput
                    value={shipmentShipCost}
                    onChangeText={setShipmentShipCost}
                    placeholder="Enter shipment ship cost"
                    style={getInputStyle(shipmentShipCost)}
                    keyboardType="numeric"
                />
                <Text>Supplier:</Text>
                <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, supplierSelection: true })}>
                    <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                        {selectedSupplier ? `Selected Supplier: ${selectedSupplier}` : 'Choose Supplier'}
                    </Text>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={modalVisibility.supplierSelection}
                    onRequestClose={() => setModalVisibility({ ...modalVisibility, supplierSelection: false })}
                    animationType="slide"
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                            <Text>Select Supplier</Text>
                            <FlatList
                                data={suppliers}
                                keyExtractor={(item) => item.productSupplierSd}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectSupplier(item.productSupplierSd)}>
                                        <Text style={{ padding: 10, borderBottomWidth: 1 }}>
                                            {item.productSupplierName}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, supplierSelection: false })} style={{ marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Text>Select Products:</Text>
                <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, productSelection: true })}>
                    <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                        {selectedProducts.length > 0 ? `Selected Products: ${selectedProducts.join(', ')}` : 'Choose products'}
                    </Text>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={modalVisibility.productSelection}
                    onRequestClose={() => setModalVisibility({ ...modalVisibility, productSelection: false })}
                    animationType="slide"
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                            <Text>Select Products</Text>
                            <FlatList
                                data={products}
                                keyExtractor={(item) => item.productId}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handleSelectProduct(item.productId)}>
                                        <Text style={{ padding: 10, borderBottomWidth: 1 }}>
                                            {item.productName}
                                            {selectedProducts.includes(item.productId) && ' (Selected)' && setProductsName(item.productName).includes(item.productId)}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, productSelection: false })} style={{ marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                {selectedProducts.map((productId) => (
                    <TouchableOpacity key={productId} onPress={() => handleEditProduct(productId)}>
                        <Text>Selected Products: {`${productId}`}</Text>
                        <View style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}>
                            <Text style={getInputStyle(productDetails[productId]?.price, true)}>
                                {`Price: ${productDetails[productId]?.price || 'Not set'}`}
                            </Text>
                            <Text style={getInputStyle(productDetails[productId]?.quantity, true)}>
                                {`Quantity: ${productDetails[productId]?.quantity || 'Not set'}`}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, sizeSelection: productId })}>
                                <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                                    {selectedSize[productId] ? `Đã chọn màu: ${selectedSize[productId]}` : 'Choose Màu'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

                <Modal
                    transparent={true}
                    visible={!!modalVisibility.sizeSelection} // Hiển thị modal nếu có productId được chọn
                    onRequestClose={() => setModalVisibility({ ...modalVisibility, sizeSelection: null })}
                    animationType="slide"
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                            <Text>Select Sizes</Text>
                            <FlatList
                                data={sizes}
                                keyExtractor={(item) => item.productSizeId}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            handleSelectSize(modalVisibility.sizeSelection, item.productSizeId);
                                            setModalVisibility({ ...modalVisibility, sizeSelection: null });
                                        }}
                                    >
                                        <Text style={{ padding: 10, borderBottomWidth: 1 }}>
                                            {item.productSizeName}
                                            {selectedSize[modalVisibility.sizeSelection] === item.productSizeId && ' (Selected)'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                onPress={() => setModalVisibility({ ...modalVisibility, sizeSelection: null })}
                                style={{ marginTop: 10 }}
                            >
                                <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {selectedProductForEdit && (
                    <Modal
                        transparent={true}
                        visible={modalVisibility.productEdit}
                        onRequestClose={() => setModalVisibility({ ...modalVisibility, productEdit: false })}
                        animationType="slide"
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                                <Text>Editing Product: {selectedProductForEdit}</Text>
                                <Text>Product Price:</Text>
                                <TextInput
                                    value={productPrice}
                                    onChangeText={setProductPrice}
                                    placeholder="Enter product price"
                                    keyboardType="numeric"
                                    style={getInputStyle(productPrice, true)}
                                />

                                <Text>Product Quantity:</Text>
                                <TextInput
                                    value={productQuantity}
                                    onChangeText={setProductQuantity}
                                    placeholder="Enter product quantity"
                                    keyboardType="numeric"
                                    style={getInputStyle(productQuantity, true)}
                                />

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={handleSaveProductDetails}>
                                        <Text style={{ textAlign: 'center', color: 'blue' }}>Save</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, productEdit: false })}>
                                        <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
            </ScrollView>
            <View style={{ marginVertical: 10, height: '20%' }}>
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </View>
    );
};

export default ShipmentForm;
