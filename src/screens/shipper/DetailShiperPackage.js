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

function DetailShiperPackage({ route, navigation }) {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        marginTop: 40,
        gap: 20,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Mã Đơn Hàng:</Text>
        <Text>#HWDSF776567DS</Text>
      </View>

      <View
        style={{
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
          gap: 10,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View
            style={{
              backgroundColor: '#925BFE',
              width: 50,
              height: 50,
              borderRadius: 50,
              alignItems: 'center',
              padding: 4,
              opacity: 0.5,
            }}
          >
            <Image
              source={require('../../assets/profile.png')}
              style={{ width: 40, height: 40, objectFit: 'cover' }}
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#3669C9' }}>
              Duoc phep kiem hang
            </Text>
            <Text>Nguyen Van A</Text>
          </View>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 700, color: '#3669C9' }}>
          Nhan tu
        </Text>
        <Text>
          53 Đ. Võ Văn Ngân, Linh Chiểu, Thành Phố Thủ Đức, Hồ Chí Minh
        </Text>

        <Text style={{ fontSize: 80, color: '#3669C9' }}>↓</Text>

        <Text style={{ fontSize: 16, fontWeight: 700, color: '#3669C9' }}>
          Den noi
        </Text>
        <Text>
          53 Đ. Võ Văn Ngân, Linh Chiểu, Thành Phố Thủ Đức, Hồ Chí Minh
        </Text>
      </View>

      <View style={{ borderTopWidth: 1, paddingTop: 10, gap: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 700, color: '#3669C9' }}>
          Trong luong
        </Text>
        <Text>Document 5kg</Text>
      </View>

      <View>
        <TouchableOpacity
          style={{
            width: '100%',
            padding: 20,
            borderRadius: 10,
            backgroundColor: '#3669C9',
          }}
          onPress={() => navigation.navigate('AllItemsInsidePackageScreen')}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: '#fff',
            }}
          >
            Chap nhan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default DetailShiperPackage;
