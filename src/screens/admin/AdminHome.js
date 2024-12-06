import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dimensions } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api/config';

const screenWidth = Dimensions.get("window").width;
const featuredProducts = [
  {
    id: '1',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp',
    },
    name: 'TMA-2 HD Wireless0',
    price: '1.500.000',
    rating: '4.0',
    review: '860',
  },
  {
    id: '2',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/01/anh-nen-cute.jpg.webp',
    },
    name: 'TMA-2 HD Wireless2',
    price: '100.000',
    rating: '2.6',
    review: '6',
  },
  {
    id: '3',
    image: {
      uri: 'https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/08/anh-phat-dep-lam-hinh-nen-62.jpg.webp',
    },
    name: 'TMA-2 HD Wireless',
    price: '1.000.000',
    rating: '0.6',
    review: '106',
  },
];
const data = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 55, 66, 77, 88, 99, 100],
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      strokeWidth: 3,
    },
  ],
  legend: ["Monthly Data"],
};

const chartConfig = {
  backgroundGradientFrom: "#2c2c2c",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#1a1a1a",
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 3,
  barPercentage: 0.5,
  useShadowColorFromDataset: true,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: "#ffffff",
  },
};

function AccountHomeScreen({ route, navigation }) {
  const handleLogout = async () => {
    try {
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn muốn đăng xuất phải không?',
        [
          {
            text: 'Huỷ',
            style: 'cancel',
          },
          {
            text: 'Đúng',
            onPress: async () => {
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('userInfo');

              Alert.alert('Đăng xuất thành công', 'Bạn đã đăng xuất.');
              navigation.navigate('Người Dùng');
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('Thất bại', error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 2,
          backgroundColor: '#3669C9',
          justifyContent: 'space-around',
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Image
            style={{ width: 50, height: 50, borderRadius: 50 }}
            source={require('../../assets/new2.png')}
          />

          <View>
            <Text style={{ textAlign: 'center' }}>Name ⌄</Text>
            <Text>Golf city, Plot 8, Sector 75</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <View
              style={{
                position: 'relative',
                borderRadius: 50,
                borderWidth: 2,
                padding: 5,
                backgroundColor: '#fff',
                alignItems: 'center'
              }}
            >

              <Icon name="log-out-outline" size={30} color="#000" />

            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#fff',
            marginBottom: 10,
          }}
        >
          <Icon style={{ color: '#2490A9', fontSize: 18 }} name="search"></Icon>
          <TextInput style={{ fontSize: 14 }} placeholder="Search"></TextInput>
        </View>
      </View>

      <View style={{ flex: 5, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: "row", backgroundColor: "#1a1a1a" }}>
          {/* Cột bên trái */}
          <View style={{ width: 45, paddingHorizontal: 10 }}>
            <Text style={{ color: "white", fontSize: 14, marginBottom: 25, marginTop: 35 }}>100</Text>
            <Text style={{ color: "white", fontSize: 14, marginBottom: 25, }}>80</Text>
            <Text style={{ color: "white", fontSize: 14, marginBottom: 0, }}>60</Text>
            <Text style={{ color: "white", fontSize: 14, marginTop: 22, }}>40</Text>
            <Text style={{ color: "white", fontSize: 14, marginTop: 20, }}>20</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={data}
              width={screenWidth * 2} // Độ rộng để cuộn được
              height={220}
              chartConfig={chartConfig}
              withHorizontalLabels={true}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

export default AccountHomeScreen;
