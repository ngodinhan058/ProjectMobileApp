import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen'; 
import VerificationScreen from './src/screens/VerificationScreen'; 
import VerificationForgotScreen from './src/screens/VerificationForgotScreen'; 
import PasswordScreen from './src/screens/PasswordScreen';
import UpdatePassScreen from './src/screens/UpdatePassScreen';
import ResetPassScreen from './src/screens/ResetPassScreen';  

import Header from './src/components/Header';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpSceen" component={SignUpScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
      <Stack.Screen name="ResetPassScreen" component={ResetPassScreen} />
      <Stack.Screen name="VerificationForgotScreen" component={VerificationForgotScreen} />
      <Stack.Screen name="UpdatePassScreen" component={UpdatePassScreen} />
    </Stack.Navigator>
  );
}

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
        })}
      >
        <Tab.Screen 
          name="Mega Mall" 
          component={HomeScreen} 
          options={{
            header: () => <Header />,  // Hiển thị Header chỉ trên HomeScreen
          }} 
        />
        <Tab.Screen 
          name="Wishlist" 
          component={HomeScreen} 
          options={{
            headerShown: false,  // Không hiển thị Header ở màn hình khác
          }} 
        />
        <Tab.Screen 
          name="Order" 
          component={HomeScreen} 
          options={{
            headerShown: false,  
          }} 
        />
        <Tab.Screen 
          name="Login" 
          component={LoginStack}
          options={{
            headerShown: false,  
            tabBarStyle: { display: 'none' },  // Ẩn Bottom Navigation trên Login và SignUp
          }} 
        />
      </Tab.Navigator>
      
    </NavigationContainer>
  );
}
