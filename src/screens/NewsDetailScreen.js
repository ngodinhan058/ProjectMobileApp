
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Button,
    TouchableOpacity,
    FlatList,
    Pressable,
} from 'react-native';
import NewItem from '../components/NewItem';
import Icon from 'react-native-vector-icons/FontAwesome';

const news = [
    { id: '1', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'The speaker unit contains a diaphragm that is precision-grown from NAC Audio bio-cellulose, making it stiffer, lighter and stronger than regular PET speaker units, and allowing the sound-producing diaphragm to vibrate without the levels of distortion found in other speakers. ', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },
    { id: '2', title: 'Philosophy That Addresses Topics Such As Goodness', description: 'The speaker unit contains a diaphragm that is precision-grown from NAC Audio bio-cellulose, making it stiffer, lighter and stronger than regular PET speaker units, and allowing the sound-producing diaphragm to vibrate without the levels of distortion found in other speakers. ', date: '13 Jan 2021', image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' }, },

];

function NewsDetailScreen({ route, navigation }) {
    const { title, description, date, image } = route.params;
    return (
        <ScrollView>
            <View style={styles.newDetailContainer}>

                <View style={styles.iconHeader}>
                    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={35} color="#000" />
                    </Pressable>
                    <Pressable style={styles.shareButton} onPress={() => navigation.goBack()}>
                        <Icon name="share" size={25} color="#000" />
                    </Pressable>
                </View>

                {/* New Image */}
                <View style={styles.newImgContainer}>
                    <Image
                        source={image}
                        style={styles.newImg}
                    />
                    
                </View>

                {/* New info */}
                <View style={styles.newInfo}>
                    <View>
                        <Text style={styles.newName}>{title}</Text>
                    </View>
                </View>
                {/* New info */}
                <View style={styles.newInfo}>
                    <View>
                        <Text style={styles.newDate}>{date}</Text>
                    </View>
                </View>

                {/* Description New */}
                <View>
                    <Text style={styles.descriptionnewText}>
                        {description}
                    </Text>
                </View>
                <View>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.textBold}>Những Bài Báo Khác</Text>

                    </View>
                    {news.map((news) => (
                        <NewItem
                            key={news.id}
                            title={news.title}
                            description={news.description}
                            date={news.date}
                            image={news.image}

                        />
                    ))}
                    <TouchableOpacity
                        style={{
                            padding: 15,
                            marginVertical: 25,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: '#000',
                            borderStyle: 'solid',
                            alignItems: 'center',
                        }} onPress={() => navigation.navigate('NewsScreen')}
                    >
                        <Text>Xem Tất Cả Bản Tin</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    newDetailContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    iconHeader: {
        position: 'relative',

    },
    backButton: {

        marginBottom: 10,
        fontWeight: 'bold'
    },
    shareButton: {
        position: 'absolute',
        marginTop: 8,
        fontWeight: 'bold',
        right: 0,
    },
    newImgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 200,
        position: 'relative',
        marginVertical: 20,
    },
    newImg: {
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

    newInfo: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },

    newName: {
        textTransform: 'uppercase',
        fontSize: 20,
        fontWeight: '700',
    },
    newDate: {
        textTransform: 'uppercase',
        fontSize: 14,
        fontWeight: '400',
        color: '#838589',
        marginBottom: 20,
    },

    newPrice: {
        color: '#FE3A30',
        fontWeight: '500',
    },

    currencyHighlight: {
        fontWeight: 'bold',
    },

    SoldnewInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    newStar: {
        flexDirection: 'row',
        gap: 5,
    },

    totalSellnew: {
        color: '#3A9B7A',
    },

    descriptionnewTitle: {
        fontWeight: '800',
        fontSize: 16,
        paddingTop: 10,
    },
    descriptionnewText: {
        lineHeight: 24,
        paddingBottom: 10,
        marginBottom: 20,
    },

    reviewnewContainer: {
        flexDirection: 'column',
    },

    reviewnewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reviewnewTitle: {
        fontWeight: '800',
        fontSize: 16,
    },

    sectionReviewerContainer: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    seeAll: {
        color: '#3669c9',
        marginBottom: 10,
        fontSize: 17,
    },
    newList: {
        marginBottom: 20,
    },
    reviewerImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
});

export default NewsDetailScreen;
