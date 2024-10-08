import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Text style={styles.logo}>Mega Mall</Text>

      {/* Icon thông báo và giỏ hàng */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Image source={require('../assets/bell.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AddToCartScreen')}>
          <Image source={require('../assets/cart.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    paddingTop: 50,

  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3669c9',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
});

export default Header;
