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
  TextInput,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';

const featuredProducts = [
  {
    id: '1',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp',
    },
    name: 'TMA-2 HD Wireless0',
    price: '1.500.000',
    rating: '4.0',
    review: '860',
  },
  {
    id: '2',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp',
    },
    name: 'TMA-2 HD Wireless2',
    price: '100.000',
    rating: '2.6',
    review: '6',
  },
  {
    id: '3',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
    name: 'TMA-2 HD Wireless',
    price: '1.000.000',
    rating: '0.6',
    review: '106',
  },
];

function WatingShipmentScreen({ route, navigation }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <View>
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Icon style={{ color: '#fcfc', fontSize: 28 }} name="search"></Icon>
          <TextInput style={{ fontSize: 24 }} placeholder="Search"></TextInput>
        </View>

        <View style={{}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFF7F3',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('MyOrderScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFF7F3',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('MyOrderConfirmScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Chờ xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFF7F3',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('GettingOrderedScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Chờ lấy hàng
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#3669c9',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('WatingShipmentScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                      color: '#fff',
                    }}
                  >
                    Chờ giao hàng
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFF7F3',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('SuccessShipmentScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Đã giao hàng
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFF7F3',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('CancelOrderScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Đã huỷ
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ margin: 10 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFF7F3',
                    padding: 16,
                    borderRadius: 50,
                  }}
                  onPress={() => navigation.navigate('ReturnOrderScreen')}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      fontWeight: '600',
                    }}
                  >
                    Trả hàng
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            padding: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            marginHorizontal: 2,
            marginBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}
          >
            <Text>00/00/0000</Text>
            <Text style={{ color: '#3669C9', fontWeight: 700 }}>
              Dang giao hang
            </Text>
          </View>

          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Image
                source={require('../assets/headphone.png')}
                style={{ width: 80, height: 80 }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: 60,
                }}
              >
                <View>
                  <Text>Tai Nghe Sieu Ngau</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>Mau: den</Text>
                    <Text>x1</Text>
                  </View>
                </View>
                <Text>1.500.000d</Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Image
                source={require('../assets/headphone.png')}
                style={{ width: 80, height: 80 }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: 60,
                }}
              >
                <View>
                  <Text>Tai Nghe Sieu Ngau</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>Mau: den</Text>
                    <Text>x1</Text>
                  </View>
                </View>
                <Text>1.500.000d</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Text>Tong</Text>
            <Text
              style={{
                color: '#3669C9',
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              3.000.000d
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ margin: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#AAAAAA',
                  padding: 16,
                  borderRadius: 1000,
                  marginHorizontal: 2,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  Xac Nhan Thanh Toan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            padding: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            marginHorizontal: 2,
            marginBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 10,
            }}
          >
            <Text>00/00/0000</Text>
            <Text style={{ color: '#3669C9', fontWeight: 700 }}>
              Da giao hang
            </Text>
          </View>

          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Image
                source={require('../assets/headphone.png')}
                style={{ width: 80, height: 80 }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: 60,
                }}
              >
                <View>
                  <Text>Tai Nghe Sieu Ngau</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>Mau: den</Text>
                    <Text>x1</Text>
                  </View>
                </View>
                <Text>1.500.000d</Text>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Image
                source={require('../assets/headphone.png')}
                style={{ width: 80, height: 80 }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  gap: 60,
                }}
              >
                <View>
                  <Text>Tai Nghe Sieu Ngau</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>Mau: den</Text>
                    <Text>x1</Text>
                  </View>
                </View>
                <Text>1.500.000d</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <Text>Tong</Text>
            <Text
              style={{
                color: '#3669C9',
                fontWeight: 700,
                fontSize: 24,
              }}
            >
              3.000.000d
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ margin: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  padding: 16,
                  borderRadius: 1000,
                  maxWidth: 300,
                  width: 100,
                  backgroundColor: '#fff',
                  marginHorizontal: 2,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#ccc',
                  }}
                >
                  Tra Hang
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ margin: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#3669C9',
                  padding: 16,
                  borderRadius: 1000,
                  marginHorizontal: 2,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#fff',
                  }}
                >
                  Xac Nhan Thanh Toan
                </Text>
              </TouchableOpacity>
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

export default WatingShipmentScreen;
