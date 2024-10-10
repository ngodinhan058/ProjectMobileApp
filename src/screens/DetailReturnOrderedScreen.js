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

function DetailReturnOrderedScreen({ route, navigation }) {
  return (
    <ScrollView style={{ marginTop: 60, padding: 20 }}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 28,
              height: 28,
              backgroundColor: '#3669C9',
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#fff',
                borderRadius: 28,
              }}
            ></View>
          </View>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: '#FFF7F3',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              Tra hang
            </Text>
          </View>
        </View>

        <View style={styles.line} />
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 28,
              height: 28,
              backgroundColor: '#3669C9',
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#fff',
                borderRadius: 28,
              }}
            ></View>
          </View>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: '#FFF7F3',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              Kiem tra hang hoan
            </Text>
          </View>
        </View>
        <View style={styles.line} />
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 28,
              height: 28,
              backgroundColor: '#3669C9',
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#fff',
                borderRadius: 28,
              }}
            ></View>
          </View>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: '#FFF7F3',
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              Hoan Tien
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: 18,
            color: '#3669C9',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          Đang Chờ Xác Nhận
        </Text>
        <Text style={{ marginBottom: 10 }}>
          Vui lòng chờ đợi trong 24h để nhân viên có thể làm thủ tục trả hàng
        </Text>
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
              Cho xac nhan
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
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  item: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  line: {
    width: 2, // Thickness of the line
    backgroundColor: 'black', // Color of the line
    marginHorizontal: 5, // Space between items and line
    transform: [{ rotate: '90deg' }],
    height: 100,
    textAlign: 'center',
  },
});

export default DetailReturnOrderedScreen;
