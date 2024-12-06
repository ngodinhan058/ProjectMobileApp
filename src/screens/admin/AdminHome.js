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


const data = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'], // Các tháng
  datasets: [
    {
      data: [500000, 700000, 1000000, 900000, 1300000, 1200000], // Doanh thu theo từng tháng
      color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`, // Màu cột
      strokeWidth: 3,
    },
  ],
  legend: ['Doanh Thu'], // Nhãn dưới các cột
};

const data2 = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'], // Các tháng
  datasets: [
    {
      data: [500000, 700000, 1000000, 900000, 1300000, 1200000], // Doanh thu theo từng tháng
      color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`, // Màu đường
      strokeWidth: 3, // Độ dày của đường
    },
  ],
};

const orderStatusData = [
  {
    name: 'Đơn hàng đã hoàn thành', // Trạng thái: Đơn hàng đã hoàn thành
    population: 4000, // Tỷ trọng đơn hàng hoàn thành (Số lượng)
    color: 'rgba(76, 175, 80, 1)', // Màu sắc biểu thị trạng thái hoàn thành (xanh lá)
    legendFontColor: '#000', // Màu sắc của nhãn
    legendFontSize: 15, // Kích thước chữ của nhãn
  },
  {
    name: 'Đơn hàng đang chờ', // Trạng thái: Đơn hàng đang chờ xử lý
    population: 1500, // Tỷ trọng đơn hàng đang chờ
    color: 'rgba(255, 165, 0, 1)', // Màu sắc biểu thị trạng thái chờ (vàng)
    legendFontColor: '#000', // Màu sắc của nhãn
    legendFontSize: 15, // Kích thước chữ của nhãn
  },
  {
    name: 'Đơn hàng đã hủy', // Trạng thái: Đơn hàng đã hủy
    population: 800, // Tỷ trọng đơn hàng đã hủy
    color: 'rgba(255, 0, 0, 1)', // Màu sắc biểu thị trạng thái đã hủy (đỏ)
    legendFontColor: '#000', // Màu sắc của nhãn
    legendFontSize: 15, // Kích thước chữ của nhãn
  },
  {
    name: 'Đơn hàng đã thanh toán', // Trạng thái: Đơn hàng đã thanh toán
    population: 1200, // Tỷ trọng đơn hàng đã thanh toán
    color: 'rgba(0, 123, 255, 1)', // Màu sắc biểu thị trạng thái thanh toán (xanh dương)
    legendFontColor: '#000', // Màu sắc của nhãn
    legendFontSize: 15, // Kích thước chữ của nhãn
  },
];

const chartConfig = {
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const chartConfig2 = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
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
              navigation.navigate('Trang Chủ Admin');
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

      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Biểu đồ Doanh Thu</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <BarChart
              data={data}
              width={screenWidth - 10} // Độ rộng của biểu đồ
              height={300} // Chiều cao của biểu đồ
              chartConfig={chartConfig}
              verticalLabelRotation={20} // Xoay nhãn trục X
              fromZero={true} // Đảm bảo trục Y bắt đầu từ 0
              showValuesOnTopOfBars={true} // Hiển thị giá trị trên cột
              withVerticalLines={false} // Tắt các đường dọc
              withHorizontalLines={true} // Hiển thị các đường ngang
              yAxisLabel="$"
            />
          </ScrollView>

          <Text style={styles.title}>Biểu đồ Đơn Hàng</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <PieChart
              data={orderStatusData}
              width={screenWidth - 40}
              height={100}
              chartConfig={chartConfig2}
              accessor={'population'}
              backgroundColor={'transparent'}
              paddingLeft={'-50%'}
              center={[40, 10]}
              style={styles.pieChartStyle}
            />
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pieChartStyle: {
    marginVertical: 10,
    borderRadius: 15,
  },
});

export default AccountHomeScreen;
