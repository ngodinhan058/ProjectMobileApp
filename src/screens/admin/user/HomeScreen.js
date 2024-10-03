import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const HomeAdminScreen = ({ navigation }) => {
    const products = [
        {
            id: '1' , image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '123@gmail.com', phone: '0923039880',
            birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'An', first_name: 'Ngô Định', money: '200', rank: require('../../../assets/diamond.png') , number_id: '079203000000',
            id_image_front: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.2-1024x0.jpg' },
            id_image_back: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.3-1024x0.jpg' }, role: 'Khách Hàng',
        },
        {
            id: '2' , image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '456@gmail.com', phone: '0923039880',
            birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'A', first_name: 'Nguyễn Văn', money: '200', rank: require('../../../assets/silver.png') , number_id: '079203000000',
            id_image_front: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.2-1024x0.jpg' },
            id_image_back: { uri: 'https://canhsatquanlyhanhchinh.gov.vn/Uploads/Images/2024/7/4/3/4.1.3-1024x0.jpg' }, role: 'Khách Hàng',
        },
        {
            id: '3' , image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, pass: '***', email: '789@gmail.com', phone: '0923039880',
            birthday: '14-09-2004', address: '21/8', pin: '1234', last_name: 'B', first_name: 'Phạm Thị', money: '200', rank: require('../../../assets/bronze.png') , number_id: '079203000000',
            id_image_front: require('../../../assets/silver.png'),
            id_image_back: require('../../../assets/silver.png'), role: 'Khách Hàng',
        },
       

    ];

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate('DetailUserScreen', {
                image: item.image,
                email: item.email,
                first_name: item.first_name,
                last_name: item.last_name,
                id_image_front: item.id_image_front,
                id_image_back: item.id_image_back,
                pass: item.pass,
                birthday: item.birthday,
                address: item.address,
                phone: item.phone,
                money: item.money,
                role: item.role,
                rank: item.rank,
                number_id: item.number_id,
            })}
        >

            <View style={{
                marginRight: 20,
            }}>
                <Image source={item.image} style={styles.productIcon} />
            </View>

            <View style={styles.productDetails}>
                <Text style={styles.productCode}>{item.first_name}&#160;{item.last_name}</Text>
                <Image source={item.rank} style={styles.rankIcon} />
                <Text style={styles.productStatus}>Email: {item.email}</Text>
                <View style={styles.line}></View>
                <Text style={styles.productCode}>Ví Tiền: {item.money} ₫</Text>
            </View>
            <Pressable>
                <Icon name="angle-right" size={25} color="#000" />
            </Pressable>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeText}>Hi Admin!</Text>
                    <Text style={styles.subtitleText}>Welcome back to your panel.</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('LoginScreen')}
                >
                    <Image source={require('../../../assets/right_from_bracket.png')} style={{ width: 30, height: 30, marginLeft: 115 }} />
                </TouchableOpacity>
            </View>

            {/* Product List Title */}
            <View style={{ position: 'relative', marginBottom: 30 }}>
                <Pressable style={styles.menuIcon} onPress={() => navigation.navigate('MenuScreen')}>
                    <Icon name="bars" size={15} color="#000" style={{ marginLeft: 9, marginTop: 6, }} />
                </Pressable>
                <Text style={styles.productListTitle}>User List</Text>

            </View>

            {/* Product List */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                style={styles.productList}
            />

            {/* Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUserScreen')}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,

    },
    line: {
        width: '95%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 10,
    },
    menuButton: {
        marginRight: 10,
    },
    menuIcon: {
        width: 35,
        height: 35,
        borderColor: '#ededed',
        borderRadius: 24,
        borderWidth: 2,
        marginTop: 0,
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
    },
    productListTitle: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        left: '35%'

    },
    productList: {
        flex: 1,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ededed',
        borderWidth: 2,
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    productIcon: {
        width: 55,
        height: 55,
        marginLeft: 5,
        marginTop: 5,

    },
    rankIcon: {
        position: 'absolute',
        width: 25,
        height: 25,
        right: 0,


    },
    productDetails: {
        flex: 1,
    },
    productCode: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    productStatus: {
        fontSize: 14,
        color: '#888',
    },
    arrowIcon: {
        width: 20,
        height: 20,
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 40,
        color: '#fff',
    },
});

export default HomeAdminScreen;
