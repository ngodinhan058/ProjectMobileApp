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

function ShipperInformationScreen({ route, navigation }) {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 50,
        padding: 20,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
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
            source={require('../assets/profile.png')}
            style={{ width: 40, height: 40, objectFit: 'cover' }}
          />
        </View>

        <Text style={{ fontSize: 18, fontWeight: 700 }}>Karim Santel</Text>
        <Text>0167873902</Text>
      </View>

      <View>
        <Text>Account Settings</Text>

        <View style={{ gap: 20, marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#925BFE',
                width: 50,
                height: 50,
                borderRadius: 50,
                alignItems: 'center',
                padding: 4,
                opacity: 0.4,
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../assets/profile.png')}
                style={{ width: 24, height: 24, objectFit: 'cover' }}
              />
            </View>

            <Text>Profile setting</Text>
            <Text style={{ fontSize: 20 }}>˃</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#925BFE',
                width: 50,
                height: 50,
                borderRadius: 50,
                alignItems: 'center',
                padding: 4,
                opacity: 0.4,
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../assets/Lock.png')}
                style={{ width: 24, height: 24, objectFit: 'cover' }}
              />
            </View>

            <Text>Change password</Text>
            <Text style={{ fontSize: 20 }}>˃</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#925BFE',
                width: 50,
                height: 50,
                borderRadius: 50,
                alignItems: 'center',
                padding: 4,
                opacity: 0.4,
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../assets/Chat.png')}
                style={{ width: 24, height: 24, objectFit: 'cover' }}
              />
            </View>

            <Text>Chat support</Text>
            <Text style={{ fontSize: 20 }}>˃</Text>
          </View>
        </View>
      </View>

      <View style={{ borderTopWidth: 1, borderStyle: 'dashed', marginTop: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            marginTop: 20,
          }}
        >
          <Image
            source={require('../assets/Download.png')}
            style={{ width: 40, height: 40, objectFit: 'cover' }}
          />
          <Text style={{ fontSize: 16 }}>Log out</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            marginTop: 20,
          }}
        >
          <Image
            source={require('../assets/Deactive.png')}
            style={{ width: 40, height: 40, objectFit: 'cover' }}
          />
          <Text style={{ color: '#FF4310', fontSize: 16 }}>
            Deactivate account
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default ShipperInformationScreen;
