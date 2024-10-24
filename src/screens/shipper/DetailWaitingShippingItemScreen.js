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
  Switch,
} from 'react-native';
import ProductItem from '../../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';

function DetailWaitingShippingItemScreen({ route, navigation }) {
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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <Image source={require('../../assets/drive.png')} />
          </View>
          <Text style={{ textAlign: 'center', fontWeight: 700 }}>
            Ref ID: 12747599
          </Text>
          <Text style={{ opacity: 0.4 }}>28 Aug, 4.39 PM</Text>
        </View>
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
        <View style={{ gap: 20 }}>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Image
              source={require('../../assets/delivery.png')}
              style={{ width: 40, height: 40, objectFit: 'cover' }}
            />
            <Text
              style={{
                color: '#925BFE',
                alignItems: 'center',
                padding: 4,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {' '}
              Dang van chuyen
            </Text>
          </View>

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
                Dang van chuyen
              </Text>
              <Text>Nguyen Van A</Text>
            </View>
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 80, color: '#3669C9' }}>↓</Text>
          <Text style={{ fontSize: 80, color: '#3669C9' }}>↑</Text>
        </View>

        <Text style={{ fontSize: 16, fontWeight: 700, color: '#3669C9' }}>
          Den noi
        </Text>
        <Text>
          53 Đ. Võ Văn Ngân, Linh Chiểu, Thành Phố Thủ Đức, Hồ Chí Minh
        </Text>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          paddingTop: 10,
          gap: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: 700, color: '#3669C9' }}>
            Trong luong
          </Text>
          <Text>Document 5kg</Text>
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: 700, color: '#3669C9' }}>
            Trong luong
          </Text>
          <Text>Document 5kg</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default DetailWaitingShippingItemScreen;
