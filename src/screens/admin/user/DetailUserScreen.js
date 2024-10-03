import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function DetailScreen({ route, navigation }) {
    const { image, last_name, first_name, email, phone, number_id, rank,
        money, address, id_image_front, id_image_back, birthday, role
    } = route.params;

    // State quản lý việc nút mở rộng được mở hay không
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0)); // giá trị hoạt ảnh
    const [rotation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;

        // Thực hiện animation
        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsOpen(!isOpen);

        // Thực hiện animation xoay icon
        Animated.timing(rotation, {
            toValue: isOpen ? 0 : 1,
            duration: 300,
            useNativeDriver: true, // Để hiệu ứng xoay mượt hơn
        }).start();

        setIsOpen(!isOpen);
    };

    // Tạo hiệu ứng mở các nút theo chiều dọc
    const position1 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 160], // Chuyển từ vị trí của editButton lên trên
    });
    const position2 = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 100], // Chuyển từ vị trí của editButton lên trên
    });
    // Tạo hiệu ứng xoay dựa trên giá trị của rotation
    const rotateIcon = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'], // Xoay 90 độ khi bấm
    });

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.userDetailContainer}>
                    <View style={styles.iconHeader}>
                        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Icon name="angle-left" size={35} color="#000" />
                        </Pressable>
                        <Text style={styles.textHeader}>Chi Tiết Người Dùng</Text>
                    </View>

                    {/* user Image */}
                    <View style={styles.userImgContainer}>
                        <Image source={image} style={styles.userImg} />
                        <Text style={styles.numberOfImage}></Text>
                    </View>

                    {/* user info */}
                    <View style={styles.userInfo}>
                        <View>
                            <Text style={styles.userName}>Tên: {first_name}&#160;{last_name}</Text>
                            <Text style={styles.userName}>Email: {email}</Text>
                            <Text style={styles.userName}>Số Điện Thoại: {phone}</Text>
                        </View>

                        <View>
                            <Text style={styles.originalPrice}>Ngày Sinh: {birthday}</Text>
                            <Text style={styles.userPrice}>
                                {money} &#273;
                            </Text>
                            <Text style={styles.userSale}>
                                Địa Chỉ: {address}
                            </Text>
                        </View>

                        <View style={styles.SolduserInfo}>
                            <Text style={styles.userStar}>
                                Bậc:

                            </Text>
                            <View>

                            <Image source={rank} style={{ width: 25, height: 25, marginRight: 190 }} />

                            </View>
                            <View>
                                <Text style={styles.totalSelluser}>{role}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Description user */}
                    <Text style={styles.userName}>Căn Cước Công Dân: </Text>
                    <View>
                        <Text style={styles.descriptionuserTitle}>Số CCCD: {number_id}</Text>
                        
                            <View>
                                <Image source={id_image_front} style={styles.userImgFront} />
                            </View>
                            <View>
                                <Image source={id_image_back} style={styles.userImgBack} />
                            </View>
                        
                    </View>
                </View>
            </ScrollView>

            {/* Add Button */}
            <TouchableOpacity style={styles.editButton} onPress={toggleMenu}>
                <Animated.Text style={[styles.editButtonText, { transform: [{ rotate: rotateIcon }] }]}>
                    ▶
                </Animated.Text>
            </TouchableOpacity>

            {/* Các nút con */}
            <Animated.View style={[styles.subButtonPen, { bottom: position2 }]}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('EditUserScreen')}>
                    <Icon name="pencil" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.subButton, { bottom: position1 }]}>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="trash" size={20} color="#fff" />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        height: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 50,
    },
    iconHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingBottom: 10,
    },
    textHeader: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: 10,
    },
    userImgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 200,
        position: 'relative',
    },
    userImg: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    numberOfImage: {
        position: 'absolute',
        left: '10%',
        bottom: '10%',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userInfo: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },
    userName: {
        
        fontSize: 17,
        fontWeight: '700',
    },
    userPrice: {
        color: '#fff',
        fontSize: 16,
    },
    userSale: {
        fontSize: 15,
    },
    originalPrice: {
        fontSize: 15,
        color: '#888',
        marginTop: 10,
    },
    SolduserInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    userStar: {
        flexDirection: 'row',
        gap: 5,
    },
    totalSelluser: {
        color: '#3A9B7A',
    },
    descriptionuserTitle: {
        fontSize: 16,
        paddingTop: 10,
    },
    userImgFront: {
       width: '100%',
       height: 250,
       marginVertical: 20,
    },
    userImgBack: {
        width: '100%',
        height: 222,
        marginVertical: 20,
     },
    editButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    },
    editButtonText: {
        fontSize: 40,
        color: '#fff',
        marginLeft: 10,
        marginBottom: 10,

    },

    subButton: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ff5757',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subButtonPen: {
        position: 'absolute',
        right: 35,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3669c9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DetailScreen;
