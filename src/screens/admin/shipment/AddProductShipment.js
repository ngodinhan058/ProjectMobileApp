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
import Icon from 'react-native-vector-icons/Ionicons';
import AlertComponent from '../../../components/AlertComponent';

import { BASE_URL } from '../../api/config';
const AddProductShipment = ({ navigation }) => {
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [shipment, setShipment] = useState({
        shipmentDate: "2024-11-21",
        shipmentDiscount: 10.5,
        shipmentShipCost: 500001,
        supplierId: "",
        shipmentProducts: [
            {
                productId: "",
                productPrice: "",
                sizesProduct: [
                    {
                        productQuantity: "",
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
        productIndex: null, // Thêm thông tin này
        sizeIndex: null,    // Thêm thông tin này
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

    const handleSelectSupplier = (supplierId) => {
        setSelectedSupplier(supplierId);
        setModalVisibility({ ...modalVisibility, supplierSelection: false });
    };
    const handleSelectProduct = (productIndex, productId) => {
        // Kiểm tra nếu productId đã được chọn ở các sản phẩm khác
        const isAlreadySelected = shipment.shipmentProducts.some(
            (product, index) => index !== productIndex && product.productId === productId
        );

        if (isAlreadySelected) {
            Alert.alert('Error', 'This product has already been selected in another product.');
            return;
        }

        // Cập nhật productId tại productIndex
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts[productIndex].productId = productId;
        setShipment({ ...shipment, shipmentProducts: updatedProducts });

        // Đóng modal
        setModalVisibility({ ...modalVisibility, productSelection: false });
    };





    const handleSelectSize = (productIndex, sizeIndex, sizeId) => {
        const updatedProducts = [...shipment.shipmentProducts];
        const selectedProductId = updatedProducts[productIndex].sizesProduct[sizeIndex].productId;

        // Kiểm tra trùng lặp sizeId trong cùng Product
        const isDuplicateSize = updatedProducts[productIndex].sizesProduct.some(
            (size, index) => index !== sizeIndex && size.sizeId === sizeId
        );

        if (isDuplicateSize) {
            Alert.alert('Error', 'This size has already been selected for this product.');
            return;
        }

        updatedProducts[productIndex].sizesProduct[sizeIndex].sizeId = sizeId;
        setShipment({ ...shipment, shipmentProducts: updatedProducts });

        // Đóng modal
        setModalVisibility({ ...modalVisibility, sizeSelection: false });
    };


    const addSize = (productIndex) => {
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts[productIndex].sizesProduct.push({
            productQuantity: "",
            sizeId: "",
        });
        setShipment({ ...shipment, shipmentProducts: updatedProducts });
    };

    const addProduct = () => {
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts.push({
            productId: "",
            productPrice: "",
            sizesProduct: [
                {
                    productQuantity: "",
                    sizeId: "",
                },
            ],
        });
        setShipment({ ...shipment, shipmentProducts: updatedProducts });
    };

    // Hàm xóa sản phẩm
    const removeProduct = (productIndex) => {
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts.splice(productIndex, 1); // Xóa sản phẩm ở index
        setShipment({ ...shipment, shipmentProducts: updatedProducts });
    };

    // Hàm xóa size
    const removeSize = (productIndex, sizeIndex) => {
        const updatedProducts = [...shipment.shipmentProducts];
        updatedProducts[productIndex].sizesProduct.splice(sizeIndex, 1); // Xóa size ở index
        setShipment({ ...shipment, shipmentProducts: updatedProducts });
    };
    const getProductName = (productId) => {
        const product = products.find(item => item.productId === productId);
        return product ? product.productName : 'No Product Selected';
    };
    const getSupplierName = (supplierId) => {
        const supplier = suppliers.find(item => item.productSupplierSd === supplierId);
        return supplier ? supplier.productSupplierName : 'No Supplier Selected';
    };
    const getSizeName = (sizeId) => {
        const size = sizes.find(item => item.productSizeId === sizeId);
        return size ? size.productSizeName : 'No Size Selected';
    };



    const handleSubmit = async () => {
        // Validate form data
        const { shipmentDate, shipmentDiscount, shipmentShipCost, shipmentProducts } = shipment;

        // Prepare data to send in the required format
        const formData = {
            shipmentDate, // Format date as "YYYY-MM-DD"
            shipmentDiscount: parseFloat(shipmentDiscount),
            shipmentShipCost: parseFloat(shipmentShipCost),
            supplierId: selectedSupplier, // Use the selected supplier ID
            shipmentProducts: shipmentProducts.map((product) => ({
                productId: product.productId || selectedProducts, // Place productId outside sizesProduct
                productPrice: parseFloat(product.productPrice), // Ensure price is a number
                sizesProduct: product.sizesProduct.map((size) => ({
                    productQuantity: parseInt(size.productQuantity), // Ensure quantity is an integer
                    sizeId: size.sizeId || selectedSize, // Handle sizeId if not selected
                })),
            })),
        };

        try {
            // Send data to API
            const response = await axios.post(`${BASE_URL}shipment`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle successful response
            if (response.status === 200 || response.status === 201) {
                setAlertType('success');
                navigation.replace('ShipmentList', {
                    alertVisible: true,
                    alertType: 'success',
                    title: 'Thêm Sản Phẩm Thành Công,'
                });
            } else {
                setAlertType('error');
                setAlertVisible(true);
            }
        } catch (error) {
            console.log('Error creating shipment:', error);
            // Alert.alert('Lỗi', error.response?.data?.message || 'Lỗi khi tạo lô hàng');
            setAlertType('error');
            setAlertVisible(true);
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
                        {selectedSupplier ? `${getSupplierName(selectedSupplier)}` : 'Choose Supplier'}
                    </Text>
                </TouchableOpacity>
                {shipment.shipmentProducts.map((product, productIndex) => (
                    <View key={productIndex} style={styles.section}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            <Text style={styles.subtitle}>Product {productIndex + 1}</Text>
                            <TouchableOpacity onPress={() => removeProduct(productIndex)}>
                                <Icon name='trash' size={20} color={'#bbb'} />
                            </TouchableOpacity>
                        </View>
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

                        {/* Product Selection */}
                        <TouchableOpacity
                            onPress={() =>
                                setModalVisibility({
                                    ...modalVisibility,
                                    productSelection: true,
                                    productIndex,
                                })
                            }
                        >
                            <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                                {product.productId ? `${getProductName(product.productId)}` : 'Choose Product'}
                            </Text>
                        </TouchableOpacity>

                        {/* Sizes */}
                        {product.sizesProduct.map((size, sizeIndex) => (
                            <View key={sizeIndex} style={styles.section}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                                    <Text style={styles.subtitle}>Size {sizeIndex + 1}</Text>
                                    <TouchableOpacity onPress={() => removeSize(productIndex, sizeIndex)}>
                                        <Icon name='trash' size={20} color={'#bbb'} />

                                    </TouchableOpacity>
                                </View>
                                <Text>Product Quantity:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter product quantity"
                                    value={size.productQuantity.toString()}
                                    onChangeText={(text) => {
                                        const updatedProducts = [...shipment.shipmentProducts];
                                        updatedProducts[productIndex].sizesProduct[sizeIndex].productQuantity = text;
                                        setShipment({ ...shipment, shipmentProducts: updatedProducts });
                                    }}
                                    keyboardType="numeric"
                                />
                                {/* Size Selection */}
                                <TouchableOpacity
                                    onPress={() =>
                                        setModalVisibility({
                                            ...modalVisibility,
                                            sizeSelection: true,
                                            productIndex,
                                            sizeIndex,
                                        })
                                    }
                                >
                                    <Text style={{ borderWidth: 1, padding: 10, marginBottom: 10, textAlign: 'center' }}>
                                        {size.sizeId ? `${getSizeName(size.sizeId)}` : 'Choose Size'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <Button title="Add Size" onPress={() => addSize(productIndex)} color="#4CAF50" />
                    </View>
                ))}

                <Button title="Add Product" onPress={addProduct} color="#2196F3" />

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
                        <Text>Select Product</Text>
                        <FlatList
                            data={products}
                            keyExtractor={(item) => item.productId}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => handleSelectProduct(modalVisibility.productIndex, item.productId)}
                                >
                                    <Text style={{ padding: 10, borderBottomWidth: 1 }}>{item.productName}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            onPress={() => setModalVisibility({ ...modalVisibility, productSelection: false })}
                            style={{ marginTop: 10 }}
                        >
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
                                <TouchableOpacity
                                    onPress={() => {
                                        handleSelectSize(
                                            modalVisibility.productIndex,
                                            modalVisibility.sizeIndex,
                                            item.productSizeId
                                        );
                                    }}
                                >
                                    <Text style={{ padding: 10, borderBottomWidth: 1 }}>{item.productSizeName}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            onPress={() => setModalVisibility({ ...modalVisibility, sizeSelection: false })}
                            style={{ marginTop: 10 }}
                        >
                            <Text style={{ textAlign: 'center', color: 'blue' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <AlertComponent
                title={alertType === 'success' ? "Success" : "Error"}
                description={
                    alertType === 'success'
                        ? "Product added successfully."
                        : "Thêm Thất Bại!! Vui Lòng Thử Lại"
                }
                alertType={alertType}
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
            />
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
    removeText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default AddProductShipment;
