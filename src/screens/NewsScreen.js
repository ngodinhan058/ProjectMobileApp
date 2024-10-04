import React from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NewItem from '../components/NewItem';


const news = [
    { id: '1', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
    { id: '2', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'The speaker unit contains a diaphragm that is precision-grown from NAC Audio bio-cellulose, making it stiffer, lighter and stronger than regular PET speaker units, and allowing the sound-producing diaphragm to vibrate without the levels of distortion found in other speakers. ', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
    { id: '3', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'The speaker unit contains a diaphragm that is precision-grown from NAC Audio bio-cellulose, making it stiffer, lighter and stronger than regular PET speaker units, and allowing the sound-producing diaphragm to vibrate without the levels of distortion found in other speakers. ', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
    { id: '4', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'The speaker unit contains a diaphragm that is precision-grown from NAC Audio bio-cellulose, making it stiffer, lighter and stronger than regular PET speaker units, and allowing the sound-producing diaphragm to vibrate without the levels of distortion found in other speakers. ', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
    { id: '5', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
    { id: '6', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'Agar tetap kinclong, bodi motor ten...', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
];
const NewsScreen = () => {

    return (
        <View style={styles.container}>
            <View>
                {/* Thanh tìm kiếm */}
                <View style={styles.searchBar}>
                    <TextInput style={styles.searchInput} placeholder="Search Product Name" />
                    <Image source={require('../assets/iconSeach.png')} style={styles.icon} />
                </View>
                
            </View>

            {/* Danh sách sản phẩm dạng lưới */}
            <ScrollView>
                {news.map((news) => (
                    <NewItem
                        key={news.id}
                        title={news.title}
                        description={news.description}
                        date={news.date}
                        image={news.image}

                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    searchBar: {
        position: 'relative',
        marginVertical: 10,
        marginTop: 30,
    },
    searchInput: {
        width: '100%',
        height: 50,
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 10,
        borderWidth: 5,
        borderColor: '#fafafa'
    },
    icon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: '90%',
        top: 15,
    },
    listContent: {
        paddingVertical: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },

});

export default NewsScreen;
