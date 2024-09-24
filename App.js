import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import Header from './src/components/Header'; // Import Header

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mega Mall') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Wishlist') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Order') {
              iconName = focused ? 'bag' : 'bag-outline';
            } else if (route.name === 'Login') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          header: () => <Header />,  // Thêm Header vào mỗi màn hình
        })}
  
      >
        <Tab.Screen name="Mega Mall" component={HomeScreen} />
        <Tab.Screen name="Wishlist" component={HomeScreen} />
        <Tab.Screen name="Order" component={HomeScreen} />
        <Tab.Screen name="Login" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
