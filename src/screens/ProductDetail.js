import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
} from 'react-native';

function ProductDetail({ navigation }) {
  return (
    <ScrollView>
      <View style={styles.productDetailContainer}>
        {/* Product Image */}
        <View style={styles.productImgContainer}>
          <Image
            source={require('../assets/new1.png')}
            style={styles.productImg}
          />
          <Text style={styles.numberOfImage}>1/5 Foto</Text>
        </View>

        {/* Product info */}
        <View style={styles.productInfo}>
          <View style={{}}>
            <Text style={styles.productName}>TMA-2HD Wireless</Text>
          </View>

          <View>
            <Text style={styles.productPrice}>
              1&#46;500&#46;000{' '}
              <Text style={styles.currencyHighlight}>&#273;</Text>{' '}
            </Text>
          </View>

          <View style={styles.SoldProductInfo}>
            <View style={styles.productStar}>
              <Image source={require('../assets/star.png')} />
              <Text>4&#46;6</Text>
              <Text>86 reviewes</Text>
            </View>
            <View>
              <Text style={styles.totalSellProduct}>Sole &#58; 250</Text>
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
              <Text style={styles.reviewProductTitle}>(86)</Text>
            </View>
            <View style={styles.productStar}>
              <Image source={require('../assets/star.png')} />
              <Text>4&#46;6</Text>
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
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: '600' }}>
              See All Review
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>Featured Product</Text>
            <Text>See All</Text>
          </View>
          <View>
            <ScrollView horizontal={true}>
              <View style={{ flex: 1 }}>
                <Image source={require('../assets/new3.png')} />

                <View>
                  <Text style={styles.productPrice}>
                    1&#46;500&#46;000{' '}
                    <Text style={styles.currencyHighlight}>&#273;</Text>{' '}
                  </Text>
                </View>

                <View style={styles.SoldProductInfo}>
                  <View style={styles.productStar}>
                    <Image source={require('../assets/star.png')} />
                    <Text>4&#46;6</Text>
                    <Text>86 reviewes</Text>
                  </View>
                  <View>
                    <Text style={styles.totalSellProduct}>&#8942; </Text>
                  </View>
                </View>
              </View>

              <View style={{ flex: 1, paddingLeft: 20 }}>
                <Image source={require('../assets/new3.png')} />

                <View>
                  <Text style={styles.productPrice}>
                    1&#46;500&#46;000{' '}
                    <Text style={styles.currencyHighlight}>&#273;</Text>{' '}
                  </Text>
                </View>

                <View style={styles.SoldProductInfo}>
                  <View style={styles.productStar}>
                    <Image source={require('../assets/star.png')} />
                    <Text>4&#46;6</Text>
                    <Text>86 reviewes</Text>
                  </View>
                  <View>
                    <Text style={styles.totalSellProduct}>&#8942; </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

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
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ textAlign: 'center', fontWeight: '600' }}>
                      Added
                    </Text>
                    <Image
                      style={{ width: 20, height: 20 }}
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
                    Add To Cart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  productDetailContainer: {
    flex: 1,
    padding: 10,
    fontFamily: 'DMSSans',
  },
  productImgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
  },
  productImg: {
    width: '90%',
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

  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default ProductDetail;
