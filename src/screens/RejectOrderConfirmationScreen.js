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

function RejectOrderConfirmationScreen({ navigation }) {
  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#fff' }}>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              backgroundColor: '#FF0000',
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              width: 50,
              height: 50,
            }}
          >
            <Image
              style={{ width: 32, height: 32, borderRadius: 50 }}
              source={require('../assets/new3.png')}
            />
          </View>

          <View>
            <Text style={{ fontWeight: '700' }}>Huy xac nhan don hang</Text>
            <Text style={{ fontWeight: '700' }}>Don cua ban la #BE12345</Text>
          </View>
        </View>

        <View>
          <Text>
            Chúng tôi sẽ gửi đơn cho bạn thông qua yourmail@gmail.com để xác
            nhận hoặc bạn có thể xác nhận thông qua bên dưới
          </Text>
        </View>

        <View>
          <Text style={{ fontWeight: '700' }}>
            Time placed: 17/02/2020 12:45 CEST
          </Text>
        </View>

        <View>
          <Text style={{ fontWeight: '700' }}>Billing</Text>

          <View
            style={{
              padding: 20,
              backgroundColor: '#F5F5F5',
              borderRadius: 20,
            }}
          >
            <Text style={{ fontWeight: '700' }}>Banu Elson</Text>
            <Text style={{ fontWeight: '700' }}>orders@banuelson.com</Text>
            <Text style={{ fontWeight: '700' }}>+49 179 111 1010</Text>
            <Text style={{ fontWeight: '700' }}>
              Leibnizstraße 16, Wohnheim 6, No: 8X Clausthal-Zellerfeld, Germany
            </Text>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: '700' }}>Order Items</Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('../assets/new3.png')}
              />
            </View>

            <View>
              <Text style={{ fontWeight: '700' }}>NikeCourt Lite 2</Text>
              <Text style={{ color: '#868E96' }}>Color: Blue</Text>
              <Text style={{ color: '#868E96' }}>Size: 37</Text>
              <Text style={{ color: '#868E96' }}>Qty: 1</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <View>
              <Image
                style={{ width: 100, height: 100 }}
                source={require('../assets/new3.png')}
              />
            </View>

            <View>
              <Text style={{ fontWeight: '700' }}>NikeCourt Lite 2</Text>
              <Text style={{ color: '#868E96' }}>Color: Blue</Text>
              <Text style={{ color: '#868E96' }}>Size: 37</Text>
              <Text style={{ color: '#868E96' }}>Qty: 1</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: '700' }}>Order Summary</Text>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>Subtotal</Text>
            <Text>$147.45</Text>
          </View>

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>Shipping</Text>
            <Text>$147.45</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopWidth: 2,
            }}
          >
            <Text>Subtotal</Text>
            <Text>$147.45</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

export default RejectOrderConfirmationScreen;
