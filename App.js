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
import WishListScreen from './src/screens/WishListScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import AddedProductToWishlist from './src/screens/AddedProductToWishlist';
import NewsScreen from './src/screens/NewsScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BioDataScreen from './src/screens/BioDataScreen';
{/* Admin */}
import MenuScreen from './src/screens/admin/MenuScreen';
{/* AdminProduct */}
import AddProductScreen from './src/screens/admin/product/AddProductScreen';
import EditProductScreen from './src/screens/admin/product/EditProductScreen';
import HomeAdminScreen from './src/screens/admin/product/HomeScreen';
import DetailScreen from './src/screens/admin/product/DetailProductScreen';
{/* AdminPost*/}
import AddPostScreen from './src/screens/admin/product/post/AddPostScreen';
import EditPostScreen from './src/screens/admin/product/post/EditPostScreen';
{/* AdminCategory*/}
import CategoryList from './src/screens/admin/category/HomeScreen';
{/* AdminInventory*/}
import InventoryList from './src/screens/admin/inventory/HomeScreen';
import DetailInventoryScreen from './src/screens/admin/inventory/DetailInventoryScreen';
{/* Success, Fail */}
import SuccessScreen from './src/screens/admin/SuccessScreen';


import Header from './src/components/Header';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductList" component={HomeAdminScreen} />
      
      {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
      <Stack.Screen name="SignUpSceen" component={SignUpScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
      <Stack.Screen name="ResetPassScreen" component={ResetPassScreen} />
      <Stack.Screen name="VerificationForgotScreen" component={VerificationForgotScreen} />
      <Stack.Screen name="UpdatePassScreen" component={UpdatePassScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      {/* đã login */}
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="BioDataScreen" component={BioDataScreen} />
      {/* Admin Menu */}
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      {/* Admin Product */}

      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
      {/* Admin Post */}
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
      {/* Admin Category */}
      <Stack.Screen name="CategoryList" component={CategoryList} />
      {/* <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} /> */}
      {/* Admin Invetory */}
      <Stack.Screen name="InventoryList" component={InventoryList} />
      <Stack.Screen name="DetailInventoryScreen" component={DetailInventoryScreen} />
      {/* Success, Fail */}
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="WishListScreen" component={WishListScreen} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
      <Stack.Screen name="AddedProductToWishlist" component={AddedProductToWishlist} />
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
          component={HomeStack}
          options={{
            header: () => <Header />,  // Hiển thị Header chỉ trên HomeScreen
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Ngăn hành vi mặc định khi bấm vào tab
              e.preventDefault();
              // Điều hướng về màn hình Home trong HomeStack bất kể đang ở đâu
              navigation.navigate('Home');
            },
          })}
        />

        <Tab.Screen
          name="Wishlist"
          component={WishListScreen}
          options={{
            header: () => <Header />,
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
