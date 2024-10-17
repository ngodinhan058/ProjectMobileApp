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
import ProductItem from '../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import CheckBox from 'react-native-check-box';
import DropDownPicker from 'react-native-dropdown-picker';

function ChangePasswordScreen({ route, navigation }) {
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
        gap: 20,
        flex: 1,
      }}
    >
      <Text style={{ fontWeight: 700, fontSize: 18 }}>Change password</Text>
      <Text>Create a new password</Text>

      <View>
        <Text style={{ color: '#B8B8B8' }}>Old password</Text>

        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TextInput placeholder="" style={{ padding: 4 }} />

          <Image source={require('../assets/hide.png')} style={styles.clock} />
        </View>
      </View>

      <View>
        <Text style={{ color: '#B8B8B8' }}>New password</Text>

        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TextInput placeholder="" style={{ padding: 4 }} />

          <Image source={require('../assets/hide.png')} style={styles.clock} />
        </View>
      </View>

      <View>
        <Text style={{ color: '#B8B8B8' }}>Confirm new password</Text>

        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <TextInput placeholder="" style={{ padding: 4 }} />

          <Image source={require('../assets/hide.png')} style={styles.clock} />
        </View>
      </View>

      <View>
        <TouchableOpacity
          style={{
            width: '100%',
            padding: 20,
            borderRadius: 10,
            backgroundColor: '#3669C9',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              fontSize: 16,
              color: '#fff',
            }}
          >
            Luu mat khau
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default ChangePasswordScreen;
