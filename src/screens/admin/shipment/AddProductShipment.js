import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    Modal,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import axios from 'axios';

import { BASE_URL } from '../../api/config';
const App = () => {
    const [shipment, setShipment] = useState({
        shipmentDate: "2024-12-12",
        shipmentDiscount: "12",
        shipmentShipCost: "12",
        supplierId: "",
        shipmentProducts: [
            {
                productPrice: "12",
                sizesProduct: [
                    {
                        productQuantity: "12",
                        productId: "",
                        sizeId: "",
                    },
                ],
            },
        ],
    });

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [modalVisibility, setModalVisibility] = useState({
        productSelection: false,
        supplierSelection: false,
        sizeSelection: false,
        productEdit: false,
    });
    const [products, setProducts] = useState([]);
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
        setSelectedProducts(productId);
        setModalVisibility({ ...modalVisibility, productSelection: false });
    };

    const handleSelectSupplier = (supplierId) => {
        setSelectedSupplier(supplierId);
        setModalVisibility({ ...modalVisibility, supplierSelection: false });
    };

    const handleSelectSize = (sizeId) => {
        setSelectedSize(sizeId);
        setModalVisibility({ ...modalVisibility, sizeSelection: false });
    };

    const addSize = (productIndex) => {
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts[productIndex].sizesProduct.push({
            productQuantity: "",
            productId: "",
            sizeId: "",
        });
        setShipment({ ...shipment, shipmentProducts: updatedProducts });
    };

    const addProduct = () => {
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts.push({
            productPrice: "",
            sizesProduct: [
                {
                    productQuantity: "",
                    productId: "",
                    sizeId: "",
                },
            ],
        });
        setShipment({ ...shipment, shipmentProducts: updatedProducts });
    };

    const handleSubmit = async () => {
        // Validate form data
        const { shipmentDate, shipmentDiscount, shipmentShipCost, shipmentProducts } = shipment;
        if (
            !shipmentDate ||
            !shipmentDiscount ||
            !shipmentShipCost ||
            !selectedSupplier ||
            shipmentProducts.some(
                (product) =>
                    !product.productPrice ||
                    !product.sizesProduct.some(
                        (size) => !size.productQuantity || !size.sizeId
                    )
            )
        ) {
            Alert.alert('Thông Báo', 'Vui Lòng Kiểm Tra Kĩ');
            return;
        }
    
        // Prepare data to send in the required format
        const formData = {
            shipmentDate: shipmentDate, // Format date as "YYYY-MM-DD"
            shipmentDiscount: parseFloat(shipmentDiscount),
            shipmentShipCost: parseFloat(shipmentShipCost),
            supplierId: selectedSupplier, // Use the selected supplier ID
            shipmentProducts: shipmentProducts.map((product) => ({
                productPrice: parseFloat(product.productPrice), // Ensure price is a number
                sizesProduct: product.sizesProduct.map((size) => ({
                    productQuantity: parseInt(size.productQuantity), // Ensure quantity is an integer
                    productId: size.productId || selectedProducts, // Handle productId if not selected
                    sizeId: size.sizeId || selectedSize, // Handle sizeId if not selected
                })), // Here we directly use sizesProduct
            })),
        };
        
        // Log the sizesProduct to inspect it
        console.log('Sizes Product:', formData.shipmentProducts.map(product => product.sizesProduct));
        
        console.log("formData",formData);
        console.log("selectedSize",selectedSize);
        console.log('Sizes Product:', formData.shipmentProducts.map(product => product.sizesProduct));
        
        try {
            // Send data to API
            const response = await axios.post(`${BASE_URL}shipment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            navigation.replace('ShipmentList');
            Alert.alert('Success', 'Tạo Lô Hàng Thành Công');
        } catch (error) {
            if (error.response && error.response.data) {
                Alert.alert('Lỗi', error.response.data.message || 'Lỗi khi tạo lô hàng');
            } else {
                Alert.alert('Lỗi', 'Lỗi mạng hoặc không thể kết nối đến server');
            }
        }
    };
    

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Shipment Form</Text>

                <Text>Shipment Date:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter shipment date"
                    value={shipment.shipmentDate}
                    onChangeText={(text) =>
                        setShipment({ ...shipment, shipmentDate: text })
                    }
                />

                <Text>Shipment Discount:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter shipment discount"
                    value={shipment.shipmentDiscount}
                    onChangeText={(text) =>
                        setShipment({ ...shipment, shipmentDiscount: text })
                    }
                    keyboardType="numeric"
                />

                <Text>Shipment Ship Cost:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter shipment ship cost"
                    value={shipment.shipmentShipCost}
                    onChangeText={(text) =>
                        setShipment({ ...shipment, shipmentShipCost: text })
                    }
                    keyboardType="numeric"
                />

                <Text>Supplier:</Text>
                <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, supplierSelection: true })}>
                    <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                        {selectedSupplier ? `Selected Supplier: ${selectedSupplier}` : 'Choose Supplier'}
                    </Text>
                </TouchableOpacity>

                {shipment.shipmentProducts.map((product, productIndex) => (
                    <View key={productIndex} style={styles.section}>
                        <Text style={styles.subtitle}>Product {productIndex + 1}</Text>
                        <Text>Product Price:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter product price"
                            value={product.productPrice}
                            onChangeText={(text) => {
                                const updatedProducts = [...shipment.shipmentProducts];
                                updatedProducts[productIndex].productPrice = text;
                                setShipment({ ...shipment, shipmentProducts: updatedProducts });
                            }}
                            keyboardType="numeric"
                        />

                        {product.sizesProduct.map((size, sizeIndex) => (
                            <View key={sizeIndex} style={styles.section}>
                                <Text style={styles.subtitle}>Size {sizeIndex + 1}</Text>
                                <Text>Product Quantity:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter product quantity"
                                    value={size.productQuantity}
                                    onChangeText={(text) => {
                                        const updatedProducts = [...shipment.shipmentProducts];
                                        updatedProducts[productIndex].sizesProduct[sizeIndex].productQuantity = text;
                                        setShipment({ ...shipment, shipmentProducts: updatedProducts });
                                    }}
                                    keyboardType="numeric"
                                />

                                <Text>Product ID:</Text>
                                <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, productSelection: true })}>
                                    <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                                        {selectedProducts ? `Selected Product: ${selectedProducts}` : 'Choose Product'}
                                    </Text>
                                </TouchableOpacity>

                                <Text>Size ID:</Text>
                                <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, sizeSelection: true })}>
                                    <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                                        {selectedSize ? `Selected Size: ${selectedSize}` : 'Choose Size'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <Button title="Add Size" onPress={() => addSize(productIndex)} color="#4CAF50" />
                    </View>
                ))}

                <Button title="Add Product" onPress={addProduct} color="#4CAF50" />
                <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
                <View style={{ marginVertical: 20 }}></View>
            </ScrollView>

            {/* Modals */}
            {/* product */}
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
            {/* supplier */}
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
            {/* size */}
            {/* <Modal
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
            </Modal> */}
            <Modal
                transparent={true}
                visible={modalVisibility.sizeSelection}
                onRequestClose={() => setModalVisibility({ ...modalVisibility, sizeSelection: false })}
                animationType="slide"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                        <Text>Select Sizes</Text>
                        <FlatList
                            data={sizes}
                            keyExtractor={(item) => item.productSizeId}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectSize(item.productSizeId)}>
                                    <Text style={{ padding: 10, borderBottomWidth: 1 }}>
                                        {item.productSizeName}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisibility({ ...modalVisibility, sizeSelection: false })} style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
    },
});

export default App;
