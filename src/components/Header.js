import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.logo}>Mega Mall</Text>
      </TouchableOpacity>

      {/* Icon thông báo và giỏ hàng */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Yêu Thích')}>
          <Image source={require('../assets/heart.png')} style={{
            width: 28,
            height: 28,
            marginLeft: 20,
          }} />
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
