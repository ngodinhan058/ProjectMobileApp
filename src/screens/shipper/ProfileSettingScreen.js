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

import React, { useState, useEffect, useRef } from 'react';
import ProductItem from '../../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';

function ProfileSettingScreen({ route, navigation }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ]);

  return (
    <View
      style={{
        marginTop: 50,
        padding: 20,
        justifyContent: 'space-between',
        flex: 1,
      }}
    >
      <Text style={{ fontWeight: 700, fontSize: 18 }}>Profile setting</Text>
      <Text>Modify your details</Text>

      <View>
        <Text style={{ color: '#B8B8B8' }}>Full Name</Text>
        <TextInput
          placeholder="Name"
          style={{ borderBottomWidth: 1, padding: 4 }}
        />
      </View>

      <View>
        <Text style={{ color: '#B8B8B8' }}>Email Address</Text>
        <TextInput
          placeholder="maill@gmail.com"
          style={{ borderBottomWidth: 1, padding: 4 }}
        />
      </View>

      <View>
        <Text style={{ color: '#B8B8B8' }}>Phone Number</Text>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
              borderBottomWidth: 1,
            }}
          >
            <TextInput placeholder="(+84)" style={{ padding: 4 }} />

            <Text style={{}}>⌄</Text>
          </View>
          <TextInput
            placeholder="maill@gmail.com"
            style={{ borderBottomWidth: 1, padding: 4, flex: 4 }}
          />
        </View>
      </View>

      <View>
        <Text style={{ color: '#B8B8B8' }}>CCCD</Text>
        <TextInput
          placeholder="079204058963"
          style={{ borderBottomWidth: 1, padding: 4 }}
        />
      </View>

      <View>
        <Text style={{ color: '#B8B8B8' }}>CCCD</Text>
        <TextInput
          placeholder="21/8 Đường 11, Phường Hiệp Bình, Thành Phố 
Thủ Đức, Thành Phố Hồ Chí Minh"
          style={{ borderBottomWidth: 1, padding: 4 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default ProfileSettingScreen;
