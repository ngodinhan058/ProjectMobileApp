import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Modal, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

const ShipmentForm = () => {
    const [shipmentDate, setShipmentDate] = useState('');
    const [shipmentDiscount, setShipmentDiscount] = useState('');
    const [shipmentShipCost, setShipmentShipCost] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');

    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');

    // New state to hold price and quantity for each selected product
    const [productDetails, setProductDetails] = useState({});

    const [modalVisibility, setModalVisibility] = useState({
        productSelection: false,
        supplierSelection: false,
        productEdit: false,
    });

    const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsApiUrl = `${BASE_URL}products`;
            const suppliersApiUrl = `${BASE_URL}product-sizes/category`;

            const [productsResponse, suppliersResponse] = await Promise.all([
                axios.get(productsApiUrl),
                axios.get(suppliersApiUrl),
            ]);

            setProducts(productsResponse.data.data.content);
            setSuppliers(suppliersResponse.data.data);
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

    const handleSubmit = () => {
        const formData = {
            shipmentDate,
            shipmentDiscount,
            shipmentShipCost,
            supplierId: selectedSupplier,
            shipmentProducts: selectedProducts.map((productId) => ({
                productId,
                productPrice: productDetails[productId]?.price,
                productQuantity: productDetails[productId]?.quantity,
            })),
        };
        console.log('Form submitted:', formData);
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

    return (
        <View style={{ padding: 20 }}>
            <Text>Shipment Date:</Text>
            <TextInput
                value={shipmentDate}
                onChangeText={setShipmentDate}
                placeholder="Enter shipment date"
                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
            />

            <Text>Shipment Discount:</Text>
            <TextInput
                value={shipmentDiscount}
                onChangeText={setShipmentDiscount}
                placeholder="Enter shipment discount"
                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                keyboardType='numeric'
            />

            <Text>Shipment Ship Cost:</Text>
            <TextInput
                value={shipmentShipCost}
                onChangeText={setShipmentShipCost}
                placeholder="Enter shipment ship cost"
                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                keyboardType='numeric'
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
                            keyExtractor={(item) => item.productSizeId}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectSupplier(item.productSizeId)}>
                                    <Text style={{ padding: 10, borderBottomWidth: 1 }}>
                                        {item.productSizeName}
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
                                        {selectedProducts.includes(item.productId) && ' (Selected)'}
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

            <Text>Selected Products:</Text>
            {selectedProducts.map((productId) => (
                <TouchableOpacity key={productId} onPress={() => handleEditProduct(productId)}>
                    <Text style={{ padding: 10, borderWidth: 1, marginBottom: 10 }}>
                        {`Product ID: ${productId} - Price: ${productDetails[productId]?.price || 'Not set'} - Quantity: ${productDetails[productId]?.quantity || 'Not set'}`}
                    </Text>
                </TouchableOpacity>
            ))}

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
                                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                            />

                            <Text>Product Quantity:</Text>
                            <TextInput
                                value={productQuantity}
                                onChangeText={setProductQuantity}
                                placeholder="Enter product quantity"
                                keyboardType="numeric"
                                style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
                            />

                            <TouchableOpacity onPress={handleSaveProductDetails}>
                                <Text style={{ textAlign: 'center', color: 'blue' }}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, productEdit: false })}>
                                <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default ShipmentForm;
