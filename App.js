import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import AddedProductToWishlist from './src/screens/AddedProductToWishlist';
import AddToCartScreen from './src/screens/AddToCartScreen';
import BioDataScreen from './src/screens/BioDataScreen';
import CompletedOrderConfirmationScreen from './src/screens/CompletedOrderConfirmationScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import MyOrderScreen from './src/screens/MyOrderScreen';
import NewsDetailScreen from './src/screens/NewsDetailScreen';
import NewsScreen from './src/screens/NewsScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import PasswordScreen from './src/screens/PasswordScreen';
import ProductByCateScreen from './src/screens/ProductByCateScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ResetPassScreen from './src/screens/ResetPassScreen';
import RejectOrderConfirmationScreen from './src/screens/RejectOrderConfirmationScreen';
import ReviewProductScreen from './src/screens/ReviewProductScreen';
import SearchScreen from './src/screens/SearchScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import StartSearchScreen from './src/screens/StartSearchScreen';
import UpdatePassScreen from './src/screens/UpdatePassScreen';
import VerificationForgotScreen from './src/screens/VerificationForgotScreen';
import VerificationScreen from './src/screens/VerificationScreen';
import WishListScreen from './src/screens/WishListScreen';

{
  /* Admin */
}

{
  /* AdminProduct */
}
import AddProductScreen from './src/screens/admin/product/AddProductScreen';
import EditProductScreen from './src/screens/admin/product/EditProductScreen';
import HomeAdminScreen from './src/screens/admin/product/HomeScreen';
import DetailScreen from './src/screens/admin/product/DetailProductScreen';
{
  /* AdminCategory*/
}
import CategoryList from './src/screens/admin/category/HomeScreen';
import AddCategoryScreen from './src/screens/admin/category/AddCategoryScreen';
import EditCategoryScreen from './src/screens/admin/category/EditCategoryScreen';
import DetailCategoryScreen from './src/screens/admin/category/DetailCategoryScreen';
{
  /* AdminInventory*/
}
import InventoryList from './src/screens/admin/inventory/HomeScreen';
import DetailInventoryScreen from './src/screens/admin/inventory/DetailInventoryScreen';
import ReturnOrder from './src/screens/admin/inventory/ReturnOrder';
import DetailReturnOrderScreen from './src/screens/admin/inventory/DetailReturnOrderScreen';
{
  /* AdminUser */
}
import HomeUserScreen from './src/screens/admin/user/HomeScreen';
import AddUserScreen from './src/screens/admin/user/AddUserScreen';
import EditUserScreen from './src/screens/admin/user/EditUserScreen';
import DetailUserScreen from './src/screens/admin/user/DetailUserScreen';
{
  /* AdminPost*/
}
import AddPostScreen from './src/screens/admin/product/post/AddPostScreen';
import EditPostScreen from './src/screens/admin/product/post/EditPostScreen';
{
  /* Admin Shipment */
}
import AddProductShipment from './src/screens/admin/shipment/AddProductShipment';
{
  /* Shipper */
}
import ShipperHomeScreen from './src/screens/shipper/ShipperHomeScreen';
import HistoryShippingScreen from './src/screens/shipper/HistoryShippingScreen';
import ShipperInformationScreen from './src/screens/shipper/ShipperInformationScreen';
import AllItemsInsidePackageScreen from './src/screens/shipper/AllItemsInsidePackageScreen';
import CheckedAllItemsInsidePackageScreen from './src/screens/shipper/CheckedAllItemsInsidePackageScreen';
import ConfirmReceiveMoneyScreen from './src/screens/shipper/ConfirmReceiveMoneyScreen';
import ConfirmShippingPackageScreen from './src/screens/shipper/ConfirmShippingPackageScreen';
import DetailShiperPackage from './src/screens/shipper/DetailShiperPackage';
import DetailWaitingShippingItemScreen from './src/screens/shipper/DetailWaitingShippingItemScreen';
import InprogressShippingPackageScreen from './src/screens/shipper/InprogressShippingPackageScreen';
import ItemHistoryScreen from './src/screens/shipper/ItemHistoryScreen';
import ProfileSettingScreen from './src/screens/shipper/ProfileSettingScreen';
import ShippingDetailScreen from './src/screens/shipper/ShippingDetailScreen';
import WaitingShippingScreen from './src/screens/shipper/WaitingShippingScreen';
import CompletedCancelOrderScreen from './src/screens/shipper/CompletedCancelOrderScreen';
import ChangePasswordScreen from './src/screens/shipper/ChangePasswordScreen';

{
  /* Accouting */
}
import AccountingHome from './src/screens/accounting/AccountingHome';
import CompletedReturnAccountScreen from './src/screens/accounting/CompletedReturnAccountScreen';
import ReturnAccountScreen from './src/screens/accounting/ReturnAccountScreen';
import RevenueScreen from './src/screens/accounting/RevenueScreen';

{
  /* AdminUserIdCard*/
}
import AddIdCardScreen from './src/screens/admin/user/idcard/AddIdCardScreen';
import EditIdCardScreen from './src/screens/admin/user/idcard/EditIdCardScreen';
{
  /* Success, Fail */
}
import SuccessScreen from './src/screens/admin/SuccessScreen';

import ModalConfirm from './src/screens/shipper/ModalConfirm';
import ChatScreen from './src/screens/shipper/ChatScreen';

import Header from './src/components/Header';
import Footer from './src/components/Footer';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="PasswordScreen" component={PasswordScreen} />
      <Stack.Screen name="ResetPassScreen" component={ResetPassScreen} />
      <Stack.Screen
        name="VerificationForgotScreen"
        component={VerificationForgotScreen}
      />
      <Stack.Screen name="UpdatePassScreen" component={UpdatePassScreen} />
    </Stack.Navigator>
  );
}

function NoLoginHome() {
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  // Hàm callback để cập nhật trạng thái hiển thị của footer
  const handleScroll = (isVisible) => {
    setIsFooterVisible(isVisible);
  };

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <Footer {...props} isVisible={isFooterVisible} />
      )}
    >
      <Tab.Screen
        name="Mega Mall"
        options={{
          header: () => <Header />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home');
          },
        })}
      >
        {() => (
          <HomeStack
            onScroll={handleScroll}
            setIsFooterVisible={setIsFooterVisible}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Wishlist" options={{
        header: () => <Header />,
      }}>
        {() => <WishListScreen onScroll={handleScroll} />}
      </Tab.Screen>
      <Tab.Screen
        name="MyOrderScreen"
        component={MyOrderScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setIsFooterVisible(false),
          blur: () => setIsFooterVisible(true),
        }}
      />
      <Tab.Screen name="Login" component={LoginStack} options={{ headerShown: false }} listeners={{
        focus: () => setIsFooterVisible(false),
        blur: () => setIsFooterVisible(true),
      }} />
    </Tab.Navigator>
  );
}

function HomeStack({ onScroll, setIsFooterVisible }) {
  const screens = [
    { name: "Home", component: HomeScreen, showFooter: true },
    { name: "ProductByCateScreen", component: ProductByCateScreen, showFooter: true },
    { name: "SearchScreen", component: SearchScreen, showFooter: true },
    { name: "StartSearchScreen", component: StartSearchScreen, showFooter: true },
    { name: "ProductDetailScreen", component: ProductDetailScreen, showFooter: true },
    { name: "NewsScreen", component: NewsScreen, showFooter: true },
    { name: "NewsDetailScreen", component: NewsDetailScreen, showFooter: true },
    { name: "AddedProductToWishlist", component: AddedProductToWishlist, showFooter: false },
    { name: "AddToCartScreen", component: AddToCartScreen, showFooter: false }, // Ẩn Footer cho màn AddToCartScreen
    { name: "ReviewProductScreen", component: ReviewProductScreen, showFooter: true },
    { name: "SuccessScreen", component: SuccessScreen, showFooter: true },
  ];

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          options={{ headerShown: false }}
          listeners={{
            focus: () => setIsFooterVisible(screen.showFooter), // Thiết lập hiển thị Footer khi focus vào màn hình
          }}
        >
          {(props) => React.createElement(screen.component, { ...props, onScroll })}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}

function HaveLoginHome() {
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  // Hàm callback để cập nhật trạng thái hiển thị của footer
  const handleScroll = (isVisible) => {
    setIsFooterVisible(isVisible);
  };
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <Footer {...props} isVisible={isFooterVisible} />
      )}
    >
      <Tab.Screen
        name="Mega Mall"
        options={{
          header: () => <Header />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Home');
          },
        })}
      >
        {() => <HomeStack onScroll={handleScroll} setIsFooterVisible={setIsFooterVisible} />}
      </Tab.Screen>

      <Tab.Screen name="Wishlist" options={{
        header: () => <Header />,
      }}>
        {() => <WishListScreen onScroll={handleScroll} />}
      </Tab.Screen>
      <Tab.Screen name="MyOrderScreen" component={MyOrderScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Login" options={{ headerShown: false }} >
        {() => <HaveLoginStack onScroll={handleScroll} setIsFooterVisible={setIsFooterVisible}/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
function HaveLoginStack({ onScroll, setIsFooterVisible }) {
  const screens = [
    // { name: "CompletedOrderConfirmationScreen" ,component : CompletedOrderConfirmationScreen},
    // { name: "RejectOrderConfirmationScreen" ,component : RejectOrderConfirmationScreen},
    // { name: "OrderConfirmationScreen" ,component : OrderConfirmationScreen},
    { name: "ProfileScreen", component: ProfileScreen, showFooter: true },
    { name: "BioDataScreen", component: BioDataScreen, showFooter: false },

  ];
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {screens.map((screen, index) => (
        <Stack.Screen
          key={index}
          name={screen.name}
          options={{ headerShown: false }}
          listeners={{
            focus: () => setIsFooterVisible(screen.showFooter),
          }}
        >
          {(props) => React.createElement(screen.component, { ...props, onScroll })}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );

}
{
  /* Admin Product */
}
function ProductAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductList" component={HomeAdminScreen} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} />
      <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
      <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
      {/* Admin Post */}
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      <Stack.Screen name="EditPostScreen" component={EditPostScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Category */
}
function CategoryAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CategoryList" component={CategoryList} />
      <Stack.Screen
        name="DetailCategoryScreen"
        component={DetailCategoryScreen}
      />
      <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
      <Stack.Screen name="EditCategoryScreen" component={EditCategoryScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin User */
}
function UserAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserList" component={HomeUserScreen} />
      <Stack.Screen name="AddUserScreen" component={AddUserScreen} />
      <Stack.Screen name="EditUserScreen" component={EditUserScreen} />
      <Stack.Screen name="DetailUserScreen" component={DetailUserScreen} />
      {/* Admin IdCard */}
      <Stack.Screen name="AddIdCardScreen" component={AddIdCardScreen} />
      <Stack.Screen name="EditIdCardScreen" component={EditIdCardScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Shipment */
}
function ShipmentAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddProductShipment" component={AddProductShipment} />
      
    </Stack.Navigator>
  );
}
function AdminDrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Danh Sách Sản Phẩm" component={ProductAdmin} />
      <Drawer.Screen name="Danh Sách Danh Mục" component={CategoryAdmin} />
      <Drawer.Screen name="Danh Sách Người Dùng" component={UserAdmin} />
      <Drawer.Screen name="Danh Sách Shipment" component={ShipmentAdmin} />
    </Drawer.Navigator>
  );
}
{
  /* Admin Invetory */
}
function InventoryAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryList" component={InventoryList} />
      <Stack.Screen
        name="DetailInventoryScreen"
        component={DetailInventoryScreen}
      />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Invetory ReturnOrder*/
}

function InventoryReturnOrder() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReturnOrder" component={ReturnOrder} />
      <Stack.Screen
        name="DetailReturnOrderScreen"
        component={DetailReturnOrderScreen}
      />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
    </Stack.Navigator>
  );
}

{
  /* Shipper Invetory ReturnOrder*/
}
function ShipperDrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Trang Chủ" component={ShipperHome} />
      <Drawer.Screen name="Lịch Sử Giao Hàng" component={HistoryShipping} />
      <Drawer.Screen name="Thông Tin Cá Nhân" component={ShipperInformation} />
    </Drawer.Navigator>
  );
}

function ShipperHome() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShipperHomeScreen" component={ShipperHomeScreen} />
      <Stack.Screen
        name="ShippingDetailScreen"
        component={ShippingDetailScreen}
      />
      <Stack.Screen
        name="DetailShiperPackage"
        component={DetailShiperPackage}
      />

      <Stack.Screen
        name="AllItemsInsidePackageScreen"
        component={AllItemsInsidePackageScreen}
      />

      <Stack.Screen
        name="CheckedAllItemsInsidePackageScreen"
        component={CheckedAllItemsInsidePackageScreen}
      />

      <Stack.Screen
        name="ConfirmShippingPackageScreen"
        component={ConfirmShippingPackageScreen}
      />

      <Stack.Screen
        name="InprogressShippingPackageScreen"
        component={InprogressShippingPackageScreen}
      />

      <Stack.Screen
        name="ConfirmReceiveMoneyScreen"
        component={ConfirmReceiveMoneyScreen}
      />

      <Stack.Screen
        name="CompletedCancelOrderScreen"
        component={CompletedCancelOrderScreen}
      />
    </Stack.Navigator>
  );
}

function HistoryShipping() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HistoryShippingScreen"
        component={HistoryShippingScreen}
      />
      <Stack.Screen
        name="WaitingShippingScreen"
        component={WaitingShippingScreen}
      />
      <Stack.Screen name="ItemHistoryScreen" component={ItemHistoryScreen} />

      <Stack.Screen
        name="DetailWaitingShippingItemScreen"
        component={DetailWaitingShippingItemScreen}
      />
    </Stack.Navigator>
  );
}

function ShipperInformation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ShipperInformationScreen"
        component={ShipperInformationScreen}
      />
      <Stack.Screen
        name="WaitingShippingScreen"
        component={WaitingShippingScreen}
      />
      <Stack.Screen
        name="ProfileSettingScreen"
        component={ProfileSettingScreen}
      />

      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />

      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function Accouting() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AccountingHome" component={AccountingHome} />
      <Stack.Screen
        name="ReturnAccountScreen"
        component={ReturnAccountScreen}
      />
      <Stack.Screen
        name="CompletedReturnAccountScreen"
        component={CompletedReturnAccountScreen}
      />

      <Stack.Screen name="RevenueScreen" component={RevenueScreen} />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      {/* <HaveLoginHome /> */}
      {/* <NoLoginHome /> */}
      <AdminDrawerNavigator /> 
      {/* <InventoryDrawerNavigator /> */}
      {/* <ShipperDrawerNavigator /> */}
      {/* <Accouting /> */}

    </NavigationContainer>
  );
}
