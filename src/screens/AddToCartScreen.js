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

function AddToCartScreen({ navigation }) {
  return (
    <ScrollView style={{ padding: 20 }}>
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

        <View style={{ gap: 10, marginTop: 20 }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 10,
                borderColor: '#ccc',
                borderWidth: 2,
                padding: 10,
              }}
            >
              <View>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../assets/headphone.png')}
                />
              </View>
              <View>
                <Text>Tai Nghe</Text>
                <Text>Tai nghe sieu dep, sieu ngau</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  position: 'relative',
                  marginLeft: 5,
                }}
              >
                <Text style={{ position: 'absolute', left: -10, top: 10 }}>
                  1
                </Text>
                <View>
                  <Text>🔼</Text>
                  <Text>🔽</Text>
                </View>
              </View>

              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <Text>10.000.000đ</Text>
                <Text>🗑️</Text>
              </View>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderRadius: 10,
                borderColor: '#ccc',
                borderWidth: 2,
                padding: 10,
              }}
            >
              <View>
                <Image
                  style={{ width: 50, height: 50 }}
                  source={require('../assets/headphone.png')}
                />
              </View>
              <View>
                <Text>Tai Nghe</Text>
                <Text>Tai nghe sieu dep, sieu ngau</Text>
              </View>

              <View style={{ flexDirection: 'row', position: 'relative' }}>
                <Text style={{ position: 'absolute', left: -10, top: 10 }}>
                  1
                </Text>
                <View>
                  <Text>🔼</Text>
                  <Text>🔽</Text>
                </View>
              </View>

              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <Text>10.000.000đ</Text>
                <Text>🗑️</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10, gap: 10 }}>
          <Text>Ghi chu</Text>
          <TextInput
            style={{
              backgroundColor: '#ccc',
              padding: 10,
              borderRadius: 10,
              opacity: 0.25,
            }}
            placeholder="Nhap ghi chu"
          ></TextInput>
        </View>

        <View>
          <Text>Uu dai cua toi</Text>
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
                flex: 2,
                color: '#3669C9',
              }}
            >
              Chon ma giam gia
            </Text>
            <Image source={require('../assets/star.png')} />
          </View>
        </View>

        <View>
          <Text>Tổng cộng</Text>
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
