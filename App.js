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
import { ROLE_USER, ROLE_ADMIN, ROLE_SHIPPER } from './src/constants/Role';
import Icon from 'react-native-vector-icons/FontAwesome';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './src/screens/api/config';
import * as encoding from 'text-encoding';
import UUID from 'react-native-uuid';

import AddedProductToWishlist from './src/screens/AddedProductToWishlist';
import AddToCartScreen from './src/screens/AddToCartScreen';
import BuyNow from './src/screens/BuyNow';
import BioDataScreen from './src/screens/BioDataScreen';
import CreateAddressScreen from './src/screens/CreateAddressScreen';
import CompletedOrderConfirmationScreen from './src/screens/CompletedOrderConfirmationScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import InformationScreen from './src/screens/InformationScreen';
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
  /* Payment */
}
import PaymentWebViewScreen from './src/screens/payment/PaymentWebViewScreen';
import PaymentScreen from './src/screens/payment/PaymentScreen';

{
  /* Admin */
}
import AdminHome from './src/screens/admin/AdminHome';

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
  /* Admin Coupon*/
}
import AddCoupon from './src/screens/admin/product/coupon/AddCouponScreen';
import EditCoupon from './src/screens/admin/product/coupon/EditCouponScreen';
{
  /* Admin Shipment */
}
import HomeShipmentScreen from './src/screens/admin/shipment/HomeScreen';
import AddProductShipment from './src/screens/admin/shipment/AddProductShipment';
import DetailProductShipment from './src/screens/admin/shipment/DetailProductShipment';
import EditProductShipment from './src/screens/admin/shipment/EditProductShipment';
{
  /* Admin Size*/
}
import HomeSizeScreen from './src/screens/admin/size/HomeScreen';
import AddSizeScreen from './src/screens/admin/size/AddSizeScreen';
import EditSizeScreen from './src/screens/admin/size/EditSizeScreen';
import DetailSizeScreen from './src/screens/admin/size/DetailSizeScreen';
{
  /* Admin Supplier*/
}
import HomeSupplierScreen from './src/screens/admin/supplier/HomeScreen';
import AddSupplierScreen from './src/screens/admin/supplier/AddSupplierScreen';
import EditSupplierScreen from './src/screens/admin/supplier/EditSupplierScreen';
import DetailSupplierScreen from './src/screens/admin/supplier/DetailSupplierScreen';
{
  /* Admin Permission*/
}
import HomePermissionScreen from './src/screens/admin/permission/HomeScreen';
import AddPermissionScreen from './src/screens/admin/permission/AddPermissionScreen';
import EditPermissionScreen from './src/screens/admin/permission/EditPermissionScreen';
import DetailPermissionScreen from './src/screens/admin/permission/DetailPermissionScreen';
{
  /* Admin Role*/
}
import HomeRoleScreen from './src/screens/admin/role/HomeScreen';
import AddRoleScreen from './src/screens/admin/role/AddRoleScreen';
import EditRoleScreen from './src/screens/admin/role/EditRoleScreen';
import DetailRoleScreen from './src/screens/admin/role/DetailRoleScreen';
{
  /* Admin Coupon*/
}
import HomeCouponScreen from './src/screens/admin/coupon/HomeScreen';
import AddCouponScreen from './src/screens/admin/coupon/AddCouponScreen';
import EditCouponScreen from './src/screens/admin/coupon/EditCouponScreen';
import DetailCouponScreen from './src/screens/admin/coupon/DetailCouponScreen';
{
  /* Admin Slide */
}
import AddSlideScreen from './src/screens/admin/slideShow/AddSlideScreen';
import EditSlideScreen from './src/screens/admin/slideShow/EditSlideScreen';
import HomeSlideScreen from './src/screens/admin/slideShow/HomeScreen';
import DetailSlideScreen from './src/screens/admin/slideShow/DetailSlideScreen';
{
  /* Admin Content*/
}
import HomeContentScreen from './src/screens/admin/contentSlide/HomeScreen';
import AddContentScreen from './src/screens/admin/contentSlide/AddContentScreen';
import EditContentScreen from './src/screens/admin/contentSlide/EditContentScreen';
import DetailContentScreen from './src/screens/admin/contentSlide/DetailContentScreen';
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
import ShipperAddressScreen from './src/screens/shipper/ShipperAddressScreen';

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
import HomeChatScreen from './src/screens/admin/chat/HomeScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import ChatScreenAdmin from './src/screens/chat/ChatScreenAdmin';
import ChatBotScreen from './src/screens/chat/ChatBotScreen';

import Header from './src/components/Header';
import Footer from './src/components/Footer';
import { jwtDecode } from 'jwt-decode';
import SeeAllProductScreen from './src/components/SeeAllProductScreen';
import Map from './src/screens/shipper/Map';

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

  return (
    <Tab.Navigator
      tabBar={(props) => <Footer {...props} isVisible={isFooterVisible} />}
    >
      <Tab.Screen
        name="Mega Mall"
        options={{
          header: () => <Header />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.replace('Home');
          },
        })}
      >
        {() => <HomeStack setIsFooterVisible={setIsFooterVisible} />}
      </Tab.Screen>

      <Tab.Screen
        name="Yêu Thích"
        options={{
          header: () => <Header />,
        }}
      >
        {() => <WishListScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Đơn Hàng"
        component={MyOrderScreen}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setIsFooterVisible(false),
          blur: () => setIsFooterVisible(true),
        }}
      />
      <Tab.Screen
        name="Đăng Nhập"
        component={LoginStack}
        options={{ headerShown: false }}
        listeners={{
          focus: () => setIsFooterVisible(false),
          blur: () => setIsFooterVisible(true),
        }}
      />
    </Tab.Navigator>
  );
}

function HomeStack({ onScroll, setIsFooterVisible }) {
  const screens = [
    { name: 'Home', component: HomeScreen, showFooter: true },
    {
      name: 'SeeAllProductScreen',
      component: SeeAllProductScreen,
      showFooter: true,
    },
    {
      name: 'ProductByCateScreen',
      component: ProductByCateScreen,
      showFooter: true,
    },
    { name: 'SearchScreen', component: SearchScreen, showFooter: true },
    {
      name: 'StartSearchScreen',
      component: StartSearchScreen,
      showFooter: true,
    },
    {
      name: 'ProductDetailScreen',
      component: ProductDetailScreen,
      showFooter: true,
    },
    { name: 'NewsScreen', component: NewsScreen, showFooter: true },
    { name: 'NewsDetailScreen', component: NewsDetailScreen, showFooter: true },
    {
      name: 'AddedProductToWishlist',
      component: AddedProductToWishlist,
      showFooter: false,
    },
    {
      name: 'BuyNow',
      component: BuyNow,
      showFooter: false,
    },
    { name: 'AddToCartScreen', component: AddToCartScreen, showFooter: false },
    {
      name: 'ChatScreen',
      component: ChatScreen,
      options: {
        headerShown: false, // Ẩn header
      },
      showFooter: false, // Đây là một thuộc tính tùy chỉnh bạn có thể xử lý riêng trong logic của mình
    },
    {
      name: 'ChatScreenAdmin',
      component: ChatScreenAdmin,
      options: {
        headerShown: false, // Ẩn header
      },
      showFooter: false, // Đây là một thuộc tính tùy chỉnh bạn có thể xử lý riêng trong logic của mình
    },
    {
      name: 'ChatBotScreen',
      component: ChatBotScreen,
      options: {
        headerShown: false, // Ẩn headerChatBotScreen
      },
      showFooter: false, // Đây là một thuộc tính tùy chỉnh bạn có thể xử lý riêng trong logic của mình
    },
    {
      name: 'ReviewProductScreen',
      component: ReviewProductScreen,
      showFooter: true,
    },
    { name: 'SuccessScreen', component: SuccessScreen, showFooter: true },
    {
      name: 'OrderConfirmationScreen',
      component: OrderConfirmationScreen,
      showFooter: false,
    },
    {
      name: 'CompletedOrderConfirmationScreen',
      component: CompletedOrderConfirmationScreen,
      showFooter: false,
    },
    {
      name: 'RejectOrderConfirmationScreen',
      component: RejectOrderConfirmationScreen,
      showFooter: false,
    },
    {
      name: 'PaymentWebViewScreen',
      component: PaymentWebViewScreen,
      showFooter: false,
    },
    {
      name: 'PaymentScreen',
      component: PaymentScreen,
      showFooter: false,
    },
    {
      name: 'InformationScreen',
      component: InformationScreen,
      showFooter: false,
      options: {
        headerShown: false,
      },
    },
    {
      name: 'CreateAddressScreen',
      component: CreateAddressScreen,
      showFooter: false,
    },
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
          {(props) =>
            React.createElement(screen.component, { ...props, onScroll })
          }
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
}

function HaveLoginHome() {
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  return (
    <Tab.Navigator
      tabBar={(props) => <Footer {...props} isVisible={isFooterVisible} />}
    >
      <Tab.Screen
        name="Mega Mall"
        options={{
          header: () => <Header />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.replace('Home');
          },
        })}
      >
        {() => <HomeStack setIsFooterVisible={setIsFooterVisible} />}
      </Tab.Screen>

      <Tab.Screen
        name="Yêu Thích"
        options={{
          header: () => <Header />,
        }}
      >
        {() => <WishListScreen />}
      </Tab.Screen>
      <Tab.Screen
        name="Đơn Hàng"
        component={MyOrderScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Tài Khoản" options={{ headerShown: false }}>
        {() => <HaveLoginStack setIsFooterVisible={setIsFooterVisible} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
function HaveLoginStack({ onScroll, setIsFooterVisible }) {
  const screens = [
    { name: 'ProfileScreen', component: ProfileScreen, showFooter: true },
    { name: 'BioDataScreen', component: BioDataScreen, showFooter: false },
    { name: 'MyOrderScreen', component: MyOrderScreen, showFooter: false },
    {
      name: 'EditIdCardScreen',
      component: EditIdCardScreen,
      showFooter: false,
    },
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
          {(props) =>
            React.createElement(screen.component, { ...props, onScroll })
          }
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
      <Stack.Screen name="AddCoupon" component={AddCoupon} />
      {/* <Stack.Screen name="EditCoupon" component={EditCoupon} /> */}
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
      <Stack.Screen name="ShipmentList" component={HomeShipmentScreen} />
      <Stack.Screen name="AddProductShipment" component={AddProductShipment} />
      <Stack.Screen
        name="DetailProductShipment"
        component={DetailProductShipment}
      />
      <Stack.Screen
        name="EditProductShipment"
        component={EditProductShipment}
      />
    </Stack.Navigator>
  );
}
{
  /* Admin Size */
}
function SizeAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SizeList" component={HomeSizeScreen} />
      <Stack.Screen name="AddSizeShipment" component={AddSizeScreen} />
      <Stack.Screen name="DetailSizeScreen" component={DetailSizeScreen} />
      <Stack.Screen name="AddSizeScreen" component={AddSizeScreen} />
      <Stack.Screen name="EditSizeScreen" component={EditSizeScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Supplier */
}
function SupplierAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupplierList" component={HomeSupplierScreen} />
      <Stack.Screen name="AddSupplierShipment" component={AddSupplierScreen} />
      <Stack.Screen
        name="DetailSupplierScreen"
        component={DetailSupplierScreen}
      />
      <Stack.Screen name="AddSupplierScreen" component={AddSupplierScreen} />
      <Stack.Screen name="EditSupplierScreen" component={EditSupplierScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Permission */
}
function PermissionAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PermissionList" component={HomePermissionScreen} />
      <Stack.Screen
        name="DetailPermissionScreen"
        component={DetailPermissionScreen}
      />
      <Stack.Screen
        name="AddPermissionScreen"
        component={AddPermissionScreen}
      />
      <Stack.Screen
        name="EditPermissionScreen"
        component={EditPermissionScreen}
      />
    </Stack.Navigator>
  );
}
{
  /* Admin Role */
}
function RoleAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RoleList" component={HomeRoleScreen} />
      <Stack.Screen name="DetailRoleScreen" component={DetailRoleScreen} />
      <Stack.Screen name="AddRoleScreen" component={AddRoleScreen} />
      <Stack.Screen name="EditRoleScreen" component={EditRoleScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Coupon */
}
function CouponAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CouponList" component={HomeCouponScreen} />
      <Stack.Screen name="DetailCouponScreen" component={DetailCouponScreen} />
      <Stack.Screen name="AddCouponScreen" component={AddCouponScreen} />
      <Stack.Screen name="EditCouponScreen" component={EditCouponScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Slide */
}
function SlideAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SlideList" component={HomeSlideScreen} />
      <Stack.Screen name="DetailSlideScreen" component={DetailSlideScreen} />
      <Stack.Screen name="AddSlideScreen" component={AddSlideScreen} />
      <Stack.Screen name="EditSlideScreen" component={EditSlideScreen} />
    </Stack.Navigator>
  );
}
{
  /* Admin Content */
}
function ContentAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContentList" component={HomeContentScreen} />
      <Stack.Screen name="AddContentShipment" component={AddContentScreen} />
      <Stack.Screen
        name="DetailContentScreen"
        component={DetailContentScreen}
      />
      <Stack.Screen name="AddContentScreen" component={AddContentScreen} />
      <Stack.Screen name="EditContentScreen" component={EditContentScreen} />
    </Stack.Navigator>
  );
}
function AdminDrawerNavigator() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getItem = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          // setUser(userData);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };
    getItem();
  }, []);

  console.log('User roles:', user?.role);

  const hasPermission = (role) => user?.role?.includes(role);
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Trang Chủ Admin" component={AdminHome} />
      {hasPermission('PERMISSION_PRODUCTS') && (
        <>
          <Drawer.Screen name="Chọn Đề Tài Slide" component={ContentAdmin} />
          <Drawer.Screen name="Sản Phẩm" component={ProductAdmin} />
          <Drawer.Screen name="Màu" component={SizeAdmin} />
          <Drawer.Screen name="Thương Hiệu" component={SupplierAdmin} />
          <Drawer.Screen name="Slide Show" component={SlideAdmin} />
        </>
      )}
      {hasPermission('PERMISSION_CATEGORIES') && (
        <Drawer.Screen name="Danh Mục" component={CategoryAdmin} />
      )}
      {hasPermission('PERMISSION_USERS') && (
        <>
          <Drawer.Screen name="Người Dùng" component={UserAdmin} />
          <Drawer.Screen name="Quyền Người Dùng" component={RoleAdmin} />
          <Drawer.Screen name="Cho Phép Chức Năng" component={PermissionAdmin} />
        </>
      )}
      {hasPermission('PERMISSION_SHIPMENT') && (
        <Drawer.Screen name="Nhập Hàng" component={ShipmentAdmin} />
      )}
      {hasPermission('PERMISSION_COUPON') && (
        <Drawer.Screen name="Mã Giảm Giá" component={CouponAdmin} />
      )}
      {hasPermission('PERMISSION_CHAT') && (
        <Drawer.Screen name="Chat" component={ChatAdmin} />
      )}
      {hasPermission('PERMISSION_INVENTORY') && (
        <Drawer.Screen name="Tồn Kho" component={InventoryAdmin} />
      )}
      <Drawer.Screen name="Trang Chủ User" component={HaveLoginHome} />
      <Drawer.Screen name="Trang Chủ Shipper" component={ShipperDrawerNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}
{
  /* Admin Chat */
}
function ChatAdmin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={HomeChatScreen} />
      <Stack.Screen name="ChatScreenAdmin" component={ChatScreenAdmin} />
    </Stack.Navigator>
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
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3669C9',
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#f5f5f5',
          width: 250,
        },
        drawerActiveTintColor: '#3669C9',
        drawerInactiveTintColor: '#333',
        drawerActiveBackgroundColor: '#e1efff',
      }}
    >
      <Drawer.Screen
        name="Trang Chủ"
        component={ShipperHome}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          headerTitle: 'Trang Chủ',
        }}
      />
      <Drawer.Screen
        name="Lịch Sử Giao Hàng"
        component={HistoryShipping}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
          headerTitle: 'Lịch Sử Giao Hàng',
        }}
      />
      <Drawer.Screen
        name="Đang Chờ Giao"
        component={WaitingShippingScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="truck" size={size} color={color} />
          ),
          headerTitle: 'Đang Chờ Giao',
        }}
      />
      <Drawer.Screen
        name="Thông Tin Cá Nhân"
        component={ShipperInformation}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
          headerTitle: 'Thông Tin Cá Nhân',
        }}
      />
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

      <Stack.Screen name="Map" component={Map} />
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
        name="ShipperAddressScreen"
        component={ShipperAddressScreen}
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
  const [user, setUser] = useState({});
  const [userData, setUserData] = useState({});
  const [uuid, setUUID] = useState('');

  const getItem = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('userData');

      if (savedCart) {
        const { username, token } = JSON.parse(savedCart);
        const decoded = jwtDecode(token);
        setUser({ username, token, role: decoded.scope.split(' ') });
        // setUser({ username, token, role: decoded.scope.split(' ')[0] });
      } else {
        setUser({});
        let storedUUID = await AsyncStorage.getItem('guestId');
        if (!storedUUID) {
          // If not, generate a new one
          storedUUID = UUID.v4();
          await AsyncStorage.setItem('guestId', storedUUID);
          setUUID(storedUUID);
        } else {
          setUUID(storedUUID);
        }
      }
    } catch (error) {
      // console.error('Error loading cart from AsyncStorage:', error);
      // Check if guestId exists in AsyncStorage
      let storedUUID = await AsyncStorage.getItem('guestId');
      if (!storedUUID) {
        // If not, generate a new one
        storedUUID = UUID.v4();
        await AsyncStorage.setItem('guestId', storedUUID);
        setUUID(storedUUID);
      } else {
        setUUID(storedUUID);
      }
    }
  };
  const handleStateChange = async (state) => {
    const currentRoute = state.routes[state.index];
    // console.log('Current Route:', currentRoute.name);

    // If you want to fetch user data each time the navigation state changes
    if (
      currentRoute.name === 'Mega Mall' ||
      currentRoute.name === 'Trang Chủ Admin'
    ) {
      try {
        getItem();
      } catch (error) {
        console.error('Error loading cart from AsyncStorage:', error);
      }
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  const loadUserInfo = async () => {
    if (user) {
      try {
        const response = await fetch(`${BASE_URL}auth/users/myInfo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Kiểm tra mã trạng thái phản hồi
        if (response.ok) {
          const result = await response.json();

          if (result) {
            let userInfo = result.data;

            // Check if cartId is null and create a new cart if necessary
            if (userInfo.cartId == null) {
              try {
                const createCartResponse = await fetch(
                  `${BASE_URL}cart/user/`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                      userId: userInfo.userId,
                    }),
                  }
                );

                if (createCartResponse.ok) {
                  const cartResult = await createCartResponse.json();
                  userInfo.cartId = cartResult.data.cartId;

                  console.log('New cart created:', cartResult.data.cartId);
                } else {
                  console.log(
                    'Failed to create cart. Status:',
                    createCartResponse.status
                  );
                }
              } catch (error) {
                console.error('Error creating cart:', error);
              }
            }
            setUserData(userInfo); // Lưu thông tin người dùng vào state

            // Lưu thông tin người dùng vào AsyncStorage
            await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            console.log('User info saved to AsyncStorage');
          } else {
            console.log('No data in API response');
          }
        } else {
          console.log('Failed to fetch user info. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    } else {
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userData');
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, [user.token]);

  // console.log(user);
  const hasRole = (role) => user?.role?.includes(role);
  return (
    <NavigationContainer onStateChange={handleStateChange}>
      {Object.keys(user).length === 0 && <NoLoginHome />}
      {Object.keys(user).length !== 0 && hasRole('ROLE_USER') && (
        <HaveLoginHome />
      )}
      {Object.keys(user).length !== 0 && hasRole('PERMISSION_ADMIN') && (
        <AdminDrawerNavigator />
      )}
      {Object.keys(user).length !== 0 && hasRole('ROLE_SHIPPER') && (
        <ShipperDrawerNavigator />
      )}
      {/* <HaveLoginHome /> */}
      {/* <AdminDrawerNavigator />  */}
      {/* <HaveLoginHome /> */}
      {/* <NoLoginHome /> */}
      {/* <InventoryDrawerNavigator /> */}

      {/* <Accouting /> */}
    </NavigationContainer>
  );
}
