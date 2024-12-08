import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Image,
    TextInput,
} from "react-native";

const CompareModal = ({ visible, products, onClose, onApply }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState({
        slot1: null,
        slot2: null,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(products);

    const truncateName = (text) => {
        return text.length > 17 ? text.substring(0, 17) + '...' : text;
    };
    const handleProductSelect = (productId, productName, productImage, productPriceSale) => {
        if (selectedSlot) {
            // Kiểm tra sản phẩm đã được chọn ở slot khác chưa
            const otherSlot = selectedSlot === 1 ? selectedProducts.slot2 : selectedProducts.slot1;
            if (otherSlot === productId) {
                Alert.alert("Lỗi", "Sản phẩm này đã được chọn ở ô khác.");
                return;
            }

            // Cập nhật sản phẩm cho slot hiện tại
            setSelectedProducts((prev) => ({
                ...prev,
                [`slot${selectedSlot}`]: { productId: productId, productName: productName, productImage: productImage, productPriceSale: productPriceSale }, // Lưu cả id và name
            }));

            setSelectedSlot(null); // Đóng danh sách sản phẩm sau khi chọn
        }
    };


    const handleApply = () => {
        const { slot1, slot2 } = selectedProducts;
        if (!slot1 || !slot2) {
            Alert.alert("Lỗi", "Bạn cần chọn cả 2 sản phẩm để so sánh.");
            return;
        } else if (slot1.productId === slot2.productId) {
            Alert.alert("Lỗi", "Bạn cần chọn 2 sản phẩm khác nhau để so sánh.");
            return;
        }
        onApply(slot1.productId, slot2.productId);
        onClose();
    };
    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = products.filter((product) =>
            product.productName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
    };



    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Chọn sản phẩm để so sánh</Text>

                    <View style={styles.selectionContainer}>
                        {/* Slot 1 */}
                        <TouchableOpacity
                            style={styles.selectionSlot}
                            onPress={() => setSelectedSlot(1)}
                        >
                            <Text>
                                {selectedProducts.slot1
                                    ? (<View style={styles.productContainer}>
                                        <Image
                                            source={{ uri: selectedProducts.slot1.productImage.productImagePath }}
                                            style={styles.productImage}
                                        />
                                        <Text style={styles.productName}>
                                            {truncateName(selectedProducts.slot1.productName) || 'Tên sản phẩm không có sẵn'}
                                        </Text>
                                        <Text style={styles.productPrice}>{selectedProducts.slot1.productPriceSale}</Text>
                                    </View>)
                                    : "Chọn sản phẩm 1"}
                            </Text>
                        </TouchableOpacity>

                        {/* Slot 2 */}
                        <TouchableOpacity
                            style={styles.selectionSlot}
                            onPress={() => setSelectedSlot(2)}
                        >
                            <Text>
                                {selectedProducts.slot2
                                    ? (<View style={styles.productContainer}>
                                        <Image
                                            source={{ uri: selectedProducts.slot2.productImage.productImagePath }}
                                            style={styles.productImage}
                                        />
                                        <Text style={styles.productName}>
                                            {truncateName(selectedProducts.slot2.productName) || 'Tên sản phẩm không có sẵn'}
                                        </Text>
                                        <Text style={styles.productPrice}>{selectedProducts.slot2.productPriceSale}</Text>
                                    </View>)
                                    : "Chọn sản phẩm 2"}
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {selectedSlot && (
                        <View style={styles.productList}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View><Text style={styles.subtitle}>sản phẩm {selectedSlot}:</Text></View>
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                />
                            </View>

                            {/* Danh sách sản phẩm */}
                            <FlatList
                                data={filteredProducts}
                                keyExtractor={(item) => item.productId}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.productItem}
                                        onPress={() =>
                                            handleProductSelect(
                                                item.productId,
                                                item.productName,
                                                item.productImages[0],
                                                item.productPriceSale
                                            )
                                        } // Truyền cả id và name
                                    >
                                        <Text>{item.productName}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}


                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Đóng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleApply}>
                            <Text style={styles.buttonText}>So sánh</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    productContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 15,
        width: '100%',
        maxWidth: 350,
        marginHorizontal: 20,
        overflow: 'hidden',
        zIndex: 99,
    },

    productImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    productName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
        width: '100%',
        flexWrap: 'wrap',
    },

    productPrice: {
        fontSize: 14,
        color: 'red',
        marginBottom: 5,
        textAlign: 'center',
    },
    searchInput: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 5,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    selectionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    selectionSlot: {
        width: "48%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden',
        marginBottom: 10,
    },

    productList: {
        marginTop: 16,
        maxHeight: 300,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
        marginRight: 10,
    },
    productItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    button: {
        padding: 12,
        backgroundColor: "#3669c9",
        borderRadius: 4,
        alignItems: "center",
        width: "48%",
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: 'bold'
    },
});

export default CompareModal;
