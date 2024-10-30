// CustomTabNavigator.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName;
        if (route.name === 'Mega Mall') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Wishlist') {
          iconName = isFocused ? 'heart' : 'heart-outline';
        } else if (route.name === 'MyOrderScreen') {
          iconName = isFocused ? 'bag' : 'bag-outline';
        } else if (route.name === 'Login') {
          iconName = isFocused ? 'person' : 'person-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabButton}
          >
            <Icon name={iconName} size={24} color={isFocused ? '#3669c9' : '#999'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 20,
    bottom:0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  margin: 10
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',

  },
});
