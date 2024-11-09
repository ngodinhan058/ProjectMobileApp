import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import CartItem from '../components/CartItem';

function AddToCartScreen({ navigation }) {
  return (
    <ScrollView style={{ padding: 20 , backgroundColor: '#fff'}}>
      <View style={{ gap: 20 }}>
        <View>
          <Text>Giao hàng đến</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 20,
            }}
          >
            <Image source={require('../assets/star.png')} />
            <Text style={{ flex: 2 }}>21/8 Đường 35, Khu phố B</Text>
            <Image source={require('../assets/star.png')} />
          </View>
        </View>

        <View style={{ marginTop: 20, marginHorizontal: 2 }}>
            <CartItem />
        </View>

        <View style={{ marginTop: 10, gap: 10 }}>
          <Text>Ghi Chú</Text>
          <TextInput
            style={{
              backgroundColor: '#ddd',
              padding: 10,
              borderRadius: 10,
              opacity: 0.25,
            }}
            placeholder="Nhap ghi chu"
          ></TextInput>
        </View>

        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Ưa Đãi Của Tôi</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 20,
              padding: 20,
              marginVertical: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10
            }}
          >
            <Image source={require('../assets/star.png')} />
            <Text
              style={{
                flex: 2,
                color: '#3669C9',
              }}
            >
              Chọn Mã Giảm Giá
            </Text>
            <Image source={require('../assets/star.png')} />
          </View>
        </View>

        <View>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng Cộng</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <Text>Tổng tạm tính</Text>
            <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <Text>Khuyến mãi</Text>
            <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <Text>Khuyến mãi vouchers</Text>
            <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}
          >
            <Text>Phí giao hàng</Text>
            <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
          </View>
        </View>

        <View>
          <Text style={{ color: '#3669C9' }}>Phương thức thanh toán</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 20,
              padding: 10,
            }}
          >
            <Image source={require('../assets/star.png')} />
            <Text
              style={{
                color: '#3669C9',
              }}
            >
              Tiền mặt
            </Text>
            <Image source={require('../assets/star.png')} />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ color: '#3669C9' }}>10.000.000đ</Text>
          </View>
        </View>

        <View style={{ margin: 10 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#3669C9',
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 20,
              borderRadius: 10,
              marginBottom: 50,
            }}
          >
            <Text
              style={{ textAlign: 'center', fontWeight: '600', color: '#fff' }}
            >
              Thanh toán
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default AddToCartScreen;
