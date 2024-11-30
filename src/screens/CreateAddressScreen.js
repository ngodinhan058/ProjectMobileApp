import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AlertComponent from '../components/AlertComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './api/config';

const CreateAddressScreen = ({ navigation }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [detailedAddress, setDetailedAddress] = useState('');
  const [modalVisible, setModalVisible] = useState({
    type: '',
    visible: false,
  });
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [titleAleft, setTitleAleft] = useState();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [addressInfo, setAddressInfo] = useState({});
  const [location, setLocation] = useState({
    provinces: [],
    districts: [],
    wards: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        // Fetch provinces data first
        const provincesResponse = await axios.get(
          'https://provinces.open-api.vn/api/p/'
        );
        setLocation((prevLocation) => ({
          ...prevLocation,
          provinces: provincesResponse.data,
        }));

        // After provinces data is fetched, fetch districts
        const districtsResponse = await axios.get(
          'https://provinces.open-api.vn/api/d/'
        );
        setLocation((prevLocation) => ({
          ...prevLocation,
          districts: districtsResponse.data,
        }));

        // After districts data is fetched, fetch wards
        const wardsResponse = await axios.get(
          'https://provinces.open-api.vn/api/w/'
        );
        setLocation((prevLocation) => ({
          ...prevLocation,
          wards: wardsResponse.data,
        }));

        setTimeout(() => {
          setLoading(false);
        }, 2000); // Delay of 2000ms (2 seconds)
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally set loading to false if you want to stop showing loading even on error
        setLoading(false);
      }
    };

    fetchDataSequentially(); // Call the function to fetch data
  }, []); // Only run once when component mounts

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/p/')
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          `https://provinces.open-api.vn/api/d/?province_code=${selectedProvince}`
        )
        .then((response) =>
          setDistricts(
            response.data.filter((d) => d.province_code === selectedProvince)
          )
        )
        .catch((error) => console.error(error));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(
          `https://provinces.open-api.vn/api/w/?district_code=${selectedDistrict}`
        )
        .then((response) =>
          setWards(
            response.data.filter((d) => d.district_code === selectedDistrict)
          )
        )
        .catch((error) => console.error(error));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const openModal = (type) => {
    setSearchKeyword(''); // Xóa từ khóa khi mở Modal mới
    setModalVisible({ type, visible: true });
  };
  const closeModal = () => setModalVisible({ type: '', visible: false });

  const [user, setUser] = useState({});
  const [userInfo, setUserInfo] = useState(null);

  const getItem = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('userData');

      console.log(savedCart);

      if (savedCart) {
        const { username, token } = JSON.parse(savedCart);

        setUser({ username, token });
      } else {
        setUser({});
      }
    } catch (error) {
      console.error('Error loading cart from AsyncStorage:', error);
    }
  };

  const loadUserInfo = async () => {
    if (user.token) {
      try {
        console.log('User token:', user.token); // Log token

        // Use fetch to make the GET request and await the response
        const response = await fetch(`${BASE_URL}auth/users/myInfo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Log the status and check if the response was successful (status code 200-299)
        console.log('Response Status:', response.status);

        if (response.ok) {
          const result = await response.json(); // Manually parse JSON response
          console.log('API response:', result); // Log the API response

          if (result && result.data) {
            let userInfo = result.data;
            setAddressInfo(userInfo.address);
          } else {
            console.error(
              'No data in response or response format is incorrect.'
            );
          }
        } else {
          console.error('Failed to fetch user info. Status:', response.status);
          // Log the response body for debugging
          const errorData = await response.text(); // Get the raw response text
          console.error('Error Response Body:', errorData);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    } else {
      console.error('No user token found.');
    }
  };

  useEffect(() => {
    setSelectedProvince(
      location.provinces.find((p) => p.name === addressInfo.city)?.code
    );
    setSelectedDistrict(
      location.districts.find((p) => p.name === addressInfo.district)?.code
    );
    setSelectedWard(
      location.wards.find((p) => p.name === addressInfo.ward)?.code
    );
    setDetailedAddress(addressInfo?.addressName);
  }, [location, addressInfo]);

  useEffect(() => {
    getItem();
  }, [addressInfo]);

  useEffect(() => {
    if (user.token) {
      loadUserInfo();
    } else {
      getItem();
    }
  }, [user.token]);

  const updateAddress = async (body) => {
    console.log(body);

    try {
      const response = await axios.put(
        `${BASE_URL}auth/user-address/${addressInfo?.addressId}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);

      Alert.alert('Thành công', 'Chỉnh sửa địa chỉ thành công!');

      navigation.goBack();
      //await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Lưu thông tin người dùng
    } catch (error) {
      console.log(error);

      //Alert.alert('Thất bại', 'Quá trình đăng ký có lỗi.');
      throw error; // Ném lỗi để có thể hiển thị thông báo
    }
  };

  console.log(`${BASE_URL}/auth/user-address/${addressInfo?.addressId}`);

  const handleUpdate = () => {
    updateAddress({
      userAddress: detailedAddress,
      ward: wards.find((item) => item.code === selectedWard)?.name,
      district: districts.find((item) => item.code === selectedDistrict)?.name,
      city: provinces.find((item) => item.code === selectedProvince)?.name,
    });
  };

  const handleSelect = (type, value) => {
    if (type === 'province') {
      setSelectedProvince(value);
      setSelectedDistrict(null);
      setSelectedWard(null);
    } else if (type === 'district') {
      setSelectedDistrict(value);
      setSelectedWard(null);
    } else if (type === 'ward') {
      setSelectedWard(value);
    }
    closeModal();
  };
  const handleWardPress = () => {
    if (!selectedDistrict) {
      // Alert.alert(
      //   "Thông báo",
      //   "Vui lòng chọn Phường/Xã trước!",
      //   [{ text: "OK" }]
      // );
      setAlertVisible(true);
      setAlertType('error');
      setTitleAleft('Vui lòng chọn Phường/Xã trước!');
    } else {
      openModal('ward');
    }
  };
  const handleDistrictPress = () => {
    if (!selectedProvince) {
      // Alert.alert(
      //   "Thông báo",
      //   "Vui lòng chọn Tỉnh/Thành phố trước!",
      //   [{ text: "OK" }]
      // );
      setAlertVisible(true);
      setAlertType('error');
      setTitleAleft('Vui lòng chọn Tỉnh/Thành phố trước!');
    } else {
      openModal('district');
    }
  };
  const renderModalContent = () => {
    let data = [];
    let type = modalVisible.type;
    let title = '';
    if (type === 'province') {
      (data = provinces), (title = 'Tỉnh/Thành');
    } else if (type === 'district') {
      (data = districts), (title = 'Quận/Huyện');
    } else if (type === 'ward') {
      (data = wards), (title = 'Phường/Xã');
    }
    // Lọc danh sách theo từ khóa
    const filteredData = data.filter((item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    return (
      <>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>{title}</Text>
        <View style={styles.line}></View>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchKeyword}
          onChangeText={(text) => setSearchKeyword(text)}
        />
        <View
          style={{ height: 1, backgroundColor: '#EDEDED', width: '100%' }}
        ></View>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.code.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleSelect(type, item.code)}
            >
              <Text style={styles.modalText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
          }
        />
      </>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="angle-left" size={35} color="#000" />
          </Pressable>
          <Text style={styles.textHeader}>Địa Chỉ Mới</Text>
        </View>
        <Text style={styles.textTitle}>Tỉnh/Thành phố: </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openModal('province')}
        >
          <Text>
            {provinces.find((item) => item.code === selectedProvince)?.name ||
              'Chọn Tỉnh/Thành phố'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.textTitle}>Quận/Huyện: </Text>

        <TouchableOpacity style={styles.input} onPress={handleDistrictPress}>
          <Text>
            {districts.find((item) => item.code === selectedDistrict)?.name ||
              'Chọn Quận/Huyện'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.textTitle}>Phường/Xã: </Text>

        <TouchableOpacity style={styles.input} onPress={handleWardPress}>
          <Text>
            {wards.find((item) => item.code === selectedWard)?.name ||
              'Chọn Phường/Xã'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.textTitle}>Địa Chỉ : </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ chi tiết"
          value={detailedAddress}
          onChangeText={(text) => setDetailedAddress(text)}
        />

        <Modal
          visible={modalVisible.visible}
          animationType="slide"
          transparent={true}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>{renderModalContent()}</View>
        </Modal>
        <AlertComponent
          title={alertType === 'success' ? 'Success' : 'Error'}
          description={alertType === 'success' ? null : titleAleft}
          alertType={alertType}
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </View>
      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Sửa Địa Chỉ Của Bạn</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#EDEDED',
    marginVertical: 20,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    marginHorizontal: 5,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 20,
  },
  emailText: {
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ABABAB',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'relative',
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    padding: 20,
    backgroundColor: '#FFF',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
  },
  modalItem: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
  },
  optionText: {
    textAlign: 'center',
    fontSize: 18,
  },
  updateButton: {
    backgroundColor: '#3669c9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyText: { textAlign: 'center', color: 'gray', marginTop: 10 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default CreateAddressScreen;
