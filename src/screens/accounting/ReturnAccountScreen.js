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

function ReturnAccountScreen({ route, navigation }) {
  return (
    <View
      style={{
        marginTop: 50,
        padding: 20,
        justifyContent: 'space-between',
        gap: 24,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Ma don hang</Text>
        <Text style={{ color: '#3669C9' }}>#HWDSF776567DS</Text>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            <Text>Nguyen Van A</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>So tien hoan:</Text>
          <Text>10.000.000vnđ</Text>
        </View>
      </View>

      <View style={{ marginTop: 10, gap: 10 }}>
        <Text>Ly do hoan tien</Text>
        <TextInput
          style={{
            backgroundColor: '#ccc',
            padding: 10,
            borderRadius: 10,
            opacity: 0.25,
          }}
          placeholder="Nhap ly do"
        ></TextInput>
      </View>

      <View>
        <Text>Loi san pham</Text>

        <View>
          <Text style={{ padding: 10 }}>San pham loi</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <View
              style={{
                width: 100,
                alignItems: 'center',
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
              <Image
                source={require('../../assets/headphone.png')}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            </View>
            <View
              style={{
                width: 100,
                alignItems: 'center',
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
              <Image
                source={require('../../assets/headphone.png')}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            </View>
            <View
              style={{
                width: 100,
                alignItems: 'center',
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
              <Image
                source={require('../../assets/headphone.png')}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            </View>
            <View
              style={{
                width: 100,
                alignItems: 'center',
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
              <Image
                source={require('../../assets/headphone.png')}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            </View>
          </View>
        </View>
      </View>

      <View>
        <View>
          <TouchableOpacity
            style={{
              width: '100%',
              padding: 20,
              borderRadius: 10,
              backgroundColor: '#3498DB',
            }}
            onPress={() => navigation.navigate('CompletedReturnAccountScreen')}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '700',
                fontSize: 16,
                color: '#fff',
              }}
            >
              Hoan Tien
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default ReturnAccountScreen;
