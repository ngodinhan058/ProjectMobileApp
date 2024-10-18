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

function RevenueScreen({ route, navigation }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        gap: 20,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
      }}
    >
      <StatusBar hidden={true} />
      <View style={{ backgroundColor: '#fff' }}>
        <ScrollView style={{ padding: 20 }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontWeight: 700 }}>Hom nay</Text>
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
                  <Text>#HWDSF776567DS</Text>
                  <Text>On the way &#183; 00/00/0000</Text>
                </View>

                <View>
                  <Text style={{ color: '#3629B7', fontWeight: 700 }}>
                    +S1200
                  </Text>
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
                  <Text>#HWDSF776567DS</Text>
                  <Text>On the way &#183; 00/00/0000</Text>
                </View>

                <View>
                  <Text style={{ color: '#3629B7', fontWeight: 700 }}>
                    +S1200
                  </Text>
                </View>
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
              <Text style={{ fontWeight: 700 }}>Hom qua</Text>
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
                  <Text style={{ color: '#3629B7', fontWeight: 700 }}>
                    +S1200
                  </Text>
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
                  <Text style={{ color: '#3629B7', fontWeight: 700 }}>
                    +S1200
                  </Text>
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

export default RevenueScreen;
