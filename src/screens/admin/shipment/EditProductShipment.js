import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Modal, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

import { BASE_URL } from '../../api/config';
import { ScrollView } from 'react-native-gesture-handler';

const ShipmentForm = ({ route, navigation }) => {
    const { id } = route.params;
    // const [id, setid] = useState(null);
    const [shipmentDate, setShipmentDate] = useState('');
    const [shipmentDiscount, setShipmentDiscount] = useState('');
    const [shipmentShipCost, setShipmentShipCost] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedSize, setSelectedSize] = useState({});
    const [productDetails, setProductDetails] = useState({});

    // Load shipment data when the screen loads, for an existing shipment ID
    useEffect(() => {
        fetchShipmentData();
    }, [id]);

    const fetchShipmentData = async () => {
        try {
            const shipmentDataUrl = `${BASE_URL}shipment/${id}`;
            const { data } = await axios.get(shipmentDataUrl);

            // Populate the form fields with existing shipment data
            setShipmentDate(data.shipmentDate);
            setShipmentDiscount(data.shipmentDiscount.toString());
            setShipmentShipCost(data.shipmentShipCost.toString());
            setSelectedSupplier(data.supplierId);
            setSelectedProducts(data.shipmentProducts.map((p) => p.productId));

            // Set details of each product and size
            const initialProductDetails = {};
            const initialSizes = {};
            data.shipmentProducts.forEach((product) => {
                initialProductDetails[product.productId] = {
                    price: product.productPrice,
                    quantity: product.productQuantity,
                };
                initialSizes[product.productId] = product.sizeProduct;
            });
            setProductDetails(initialProductDetails);
            setSelectedSize(initialSizes);
        } catch (error) {
            console.error('Error fetching shipment data:', error);
        }
    };

    const handleEditProduct = (productId) => {
        setSelectedProductForEdit(productId);
        setModalVisibility({ ...modalVisibility, productEdit: true });
    };

    // Save the updated product details
    const handleSaveProductDetails = () => {
        setProductDetails((prevDetails) => ({
            ...prevDetails,
            [selectedProductForEdit]: {
                price: productPrice,
                quantity: productQuantity,
            },
        }));
        setModalVisibility({ ...modalVisibility, productEdit: false });
    };

    // Submit updated shipment data
    const handleSubmit = async () => {
        // Validation: ensure required fields are filled in
        if (
            !shipmentDate ||
            !shipmentDiscount ||
            !shipmentShipCost ||
            !selectedSupplier ||
            selectedProducts.some(
                (productId) =>
                    !productDetails[productId]?.price ||
                    !productDetails[productId]?.quantity ||
                    !selectedSize[productId]
            )
        ) {
            Alert.alert('Notice', 'Please complete all required fields');
            return;
        }

        // Prepare the data to update the shipment
        const updatedShipmentData = {
            shipmentDate,
            shipmentDiscount: parseFloat(shipmentDiscount),
            shipmentShipCost: parseFloat(shipmentShipCost),
            supplierId: selectedSupplier,
            shipmentProducts: selectedProducts.map((productId) => ({
                productId,
                productPrice: productDetails[productId].price,
                productQuantity: productDetails[productId].quantity,
                sizeProduct: selectedSize[productId],
            })),
        };

        try {
            // Send the update request to the server
            const response = await axios.put(`${BASE_URL}shipment/${id}`, updatedShipmentData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            Alert.alert('Success', 'Shipment updated successfully');
        } catch (error) {
            console.error('Error updating shipment:', error);
            Alert.alert('Error', 'Failed to update shipment');
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
