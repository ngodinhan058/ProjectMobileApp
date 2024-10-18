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
import ProductItem from '../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
const featuredProducts = [
  {
    id: '1',
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' },
    name: 'TMA-2 HD Wireless0',
    price: '1.500.000',
    rating: '4.0',
    review: '860'
  },
  {
    id: '2',
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp' },
    name: 'TMA-2 HD Wireless2',
    price: '100.000',
    rating: '2.6',
    review: '6'
  },
  {
    id: '3',
    image: { uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp' },
    name: 'TMA-2 HD Wireless',
    price: '1.000.000',
    rating: '0.6',
    review: '106'
  },
];

function AddedProductToWishlist({ route, navigation }) {
  const { image, name, price, rating, review } = route.params;
  return (
    <ScrollView>
      <View style={styles.productDetailContainer}>
        <View style={styles.iconHeader}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={35} color="#000" />
          </Pressable>
          <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
          <Pressable style={styles.shareButton} onPress={() => navigation.goBack()}>
            <Icon name="share" size={25} color="#000" />
          </Pressable>
        </View>

        {/* Product Image */}
        <View style={styles.productImgContainer}>
          <Image
            source={image}
            style={styles.productImg}
          />
          <Text style={styles.numberOfImage}>1/5 Foto</Text>
        </View>

        {/* Product info */}
        <View style={styles.productInfo}>
          <View>
            <Text style={styles.productName}>{name}</Text>
          </View>

          <View>
            <Text style={styles.productPrice}>
              {price}
            </Text>
          </View>

          <View style={styles.SoldProductInfo}>
            <View style={styles.productStar}>
              <Image source={require('../assets/star.png')} />
              <Text>{rating}</Text>
              <Text>{review} reviewes</Text>
            </View>
            <View>
              <Text style={styles.totalSellProduct}>Sole : 250</Text>
            </View>
          </View>
        </View>

        {/* Description Product */}
        <View>
          <Text style={styles.descriptionProductTitle}>
            Description Product
          </Text>
          <Text style={styles.descriptionProductText}>
            The speaker unit contains a diaphragm that is precision-grown from
            NAC Audio bio-cellulose, making it stiffer, lighter and stronger
            than regular PET speaker units, and allowing the sound-producing
            diaphragm to vibrate without the levels of distortion found in other
            speakers.
          </Text>

          <Text style={styles.descriptionProductText}>
            The speaker unit contains a diaphragm that is precision-grown from
            NAC Audio bio-cellulose, making it stiffer, lighter and stronger
            than regular PET speaker units, and allowing the sound-producing
            diaphragm to vibrate without the levels of distortion found in other
            speakers.
          </Text>
        </View>

        {/* Review Product */}
        <View style={styles.reviewProductContainer}>
          <View style={styles.reviewProductHeader}>
            <View>
              <Text style={styles.reviewProductTitle}>Review</Text>
              <Text style={styles.reviewProductTitle}>({review})</Text>
            </View>
            <View style={styles.productStar}>
              <Image source={require('../assets/star.png')} />
              <Text>{rating}</Text>
            </View>
          </View>

          <View style={{}}>
            <View style={styles.sectionReviewerContainer}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.reviewerImage}
                  source={require('../assets/new3.png')}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text>Yelena Belova</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                    </View>
                  </View>
                  <View>
                    <Text>2 Minggu yang lalu</Text>
                  </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionReviewerContainer}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.reviewerImage}
                  source={require('../assets/new3.png')}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text>Yelena Belova</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                    </View>
                  </View>
                  <View>
                    <Text>2 Minggu yang lalu</Text>
                  </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionReviewerContainer}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.reviewerImage}
                  source={require('../assets/new3.png')}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text>Yelena Belova</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                    </View>
                  </View>
                  <View>
                    <Text>2 Minggu yang lalu</Text>
                  </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ margin: 10 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 15,
              marginVertical: 20,
              borderRadius: 10,
            }} onPress={() => navigation.navigate('ReviewProductScreen')}
          >
            <Text style={{ textAlign: 'center', fontWeight: '600' }}>
              See All Review
            </Text>
          </TouchableOpacity>
        </View>


      </View>
      <View style={styles.greySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.textBold}>Sản Phẩm Đề Xuất</Text>
          <Text style={styles.seeAll}>Xem Tất Cả</Text>
        </View>
        <FlatList
          horizontal
          data={featuredProducts}
          renderItem={({ item }) => <ProductItem {...item} />}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.productList}
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 20,
                borderRadius: 10,
                backgroundColor: '#FE3A30',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#FFF',
                  }}
                >
                  Đã thêm yêu thích
                </Text>
                <Image
                  style={{ width: 20, height: 20, tintColor: '#fff' }}
                  source={require('../assets/heart.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#3669C9',
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#fff',
                }}
              >
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>



  );
}

const styles = StyleSheet.create({
  productDetailContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  greySection: {
    flex: 1,
    padding: 20,
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
  shareButton: {
    marginLeft: 10,
  },
  
  productImgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
  },
  productImg: {
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

  productInfo: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },

  productName: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '700',
  },

  productPrice: {
    color: '#FE3A30',
    fontWeight: '500',
  },

  currencyHighlight: {
    fontWeight: 'bold',
  },

  SoldProductInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  productStar: {
    flexDirection: 'row',
    gap: 5,
  },

  totalSellProduct: {
    color: '#3A9B7A',
  },

  descriptionProductTitle: {
    fontWeight: '800',
    fontSize: 16,
    paddingTop: 10,
  },
  descriptionProductText: {
    lineHeight: 24,
    paddingBottom: 10,
    paddingBottom: 10,
  },

  reviewProductContainer: {
    flexDirection: 'column',
  },

  reviewProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewProductTitle: {
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
  productList: {
    marginBottom: 20,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
export default AddedProductToWishlist;
