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

function HistoryShippingScreen({ route, navigation }) {
  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <View
        style={{
          gap: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 20,
            borderRadius: 10,
            borderBottomWidth: 1,
          }}
          onPress={() => navigation.navigate('HistoryShippingScreen')}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: '#909090',
            }}
          >
            Lich sử
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 20,
            borderRadius: 10,
          }}
          onPress={() => navigation.navigate('WaitingShippingScreen')}
          s
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: '#1E1E1E',
            }}
          >
            Đang chờ giao
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
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
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 20,
            justifyContent: 'space-between',
            padding: 10,
          }}
          onPress={() => navigation.navigate('ItemHistoryScreen')}
        >
          <View>
            <Image source={require('../../assets/drive.png')} />
          </View>

          <View>
            <Text>87, South Lester Street, London Close Belgium</Text>
            <Text>28 Aug, 4.39 PM</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
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
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            gap: 20,
            justifyContent: 'space-between',
            padding: 10,
          }}
          onPress={() => navigation.navigate('ItemHistoryScreen')}
        >
          <View>
            <Image source={require('../../assets/drive.png')} />
          </View>

          <View>
            <Text>87, South Lester Street, London Close Belgium</Text>
            <Text>28 Aug, 4.39 PM</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 20,
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
        <View>
          <Image source={require('../../assets/drive.png')} />
        </View>

        <View>
          <Text>87, South Lester Street, London Close Belgium</Text>
          <Text>28 Aug, 4.39 PM</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default HistoryShippingScreen;
