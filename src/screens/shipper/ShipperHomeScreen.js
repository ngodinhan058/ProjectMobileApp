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
import ProductItem from '../../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

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

function ShipperHomeScreen({ route, navigation }) {
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <StatusBar hidden={true} />
      <View
        style={{
          flex: 2,
          backgroundColor: '#3669C9',
          justifyContent: 'space-around',
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Image
            style={{ width: 50, height: 50, borderRadius: 50 }}
            source={require('../../assets/new2.png')}
          />

          <View>
            <Text style={{ textAlign: 'center' }}>Name ⌄</Text>
            <Text>Golf city, Plot 8, Sector 75</Text>
          </View>

          <View
            style={{
              position: 'relative',
              borderRadius: 50,
              borderWidth: 2,
              padding: 5,
              backgroundColor: '#fff',
            }}
          >
            <Image
              style={{
                width: 24,
                height: 24,
              }}
              source={require('../../assets/bell.png')}
            />
            <Text
              style={{
                position: 'absolute',
                right: -10,
                top: -5,
                backgroundColor: '#FF5E5E',
                borderRadius: 50,
                padding: 4,
                color: '#fff',
                width: 24,
                height: 24,
                textAlign: 'center',
              }}
            >
              1
            </Text>
          </View>
        </View>

        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#fff',
            marginBottom: 10,
          }}
        >
          <Icon style={{ color: '#2490A9', fontSize: 18 }} name="search"></Icon>
          <TextInput style={{ fontSize: 14 }} placeholder="Search"></TextInput>
        </View>
      </View>

      <View style={{ flex: 4, backgroundColor: '#fff' }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              position: 'relative',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                margin: 'auto',
                position: 'relative',
                top: -50,
                alignItems: 'center',
                backgroundColor: '#fff',
                borderRadius: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 50,
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Image
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  source={require('../../assets/checkrate.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#000',
                  }}
                >
                  Hoan tien
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 50,
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Image
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  source={require('../../assets/pickup.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#000',
                  }}
                >
                  Bao cao
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 50,
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Image
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  source={require('../../assets/dropoff.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#000',
                  }}
                >
                  Doanh thu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: 16,
                  borderRadius: 50,
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('ReviewProductScreen')}
              >
                <Image
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  source={require('../../assets/history.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#000',
                  }}
                >
                  Doanh thu
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={{ padding: 20 }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontWeight: 700 }}>Dang van chuyen</Text>
            </View>

            <View>
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
                  marginTop: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => navigation.navigate('ShippingDetailScreen')}
                >
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                    source={require('../../assets/new2.png')}
                  />

                  <View>
                    <Text>#HWDSF776567DS</Text>
                    <Text>On the way &#183; 00/00/0000</Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: '#22D1EE',
                      padding: 4,
                      borderRadius: 8,
                      maxWidth: 80,
                    }}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                      Dang giao hang
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontWeight: 700 }}>Don hang cho giao</Text>
              <Text style={{ fontWeight: 700, color: '#2490A9' }}>
                View all
              </Text>
            </View>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                  marginTop: 5,
                }}
              >
                <Image
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                  source={require('../../assets/new2.png')}
                />

                <View>
                  <Text>Kiem tra don hang thanh cong</Text>
                  <Text>On the way &#183; 00/00/0000</Text>
                </View>

                <View>
                  <Text>▶</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                  marginTop: 5,
                }}
              >
                <Image
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                  source={require('../../assets/new2.png')}
                />

                <View>
                  <Text>Kiem tra don hang thanh cong</Text>
                  <Text>On the way &#183; 00/00/0000</Text>
                </View>

                <View>
                  <Text>▶</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default ShipperHomeScreen;
