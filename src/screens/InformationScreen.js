import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { BASE_URL } from './api/config';
import axios from 'axios';
import AlertComponent from '../components/AlertComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InformationScreen = ({ route, navigation }) => {
  const { guestInfo } = route?.params || []
  const [email, setEmail] = useState(guestInfo?.userEmail|| '');
  const [firstName, setFirstname] = useState(guestInfo?.userName.split(' ')[0] || '');
  const [lastName, setLastname] = useState(guestInfo?.userName.split(' ')[1] || '');
  const [sdt, setSdt] = useState(guestInfo?.userPhone || '');
  const [address, setAdrress] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidLastname, setIsValidLastname] = useState(true);
  const [isValidFirstname, setIsValidFistame] = useState(true);
  const [isValidSdt, setIsValidSdt] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState(new Date(guestInfo?.userBirthday || null));
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const [addressInfo, setAddressInfo] = useState(guestInfo?.address || {});
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
    setDetailedAddress(addressInfo?.userAddress);
  }, [location, addressInfo]);


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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  useEffect(() => {
    const phoneNumberRegex = /^\d{10}$/;
    if (sdt.length !== 0) {
      setIsValidSdt(phoneNumberRegex.test(sdt));
    }

  }, [sdt]);


  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`;
  };

  // Hàm giả lập đăng nhập
  const handleLogin = async () => {
    if (
      isValidEmail &&
      isValidFirstname &&
      isValidLastname &&
      isValidSdt
    ) {
      try {
        // Gửi dữ liệu đăng ký
        const userData = {
          userEmail: email,
          userPhone: sdt,
          userBirthday: formatDateToString(dateOfBirth),
          userName: firstName + ' ' + lastName,
          address: {
            userAddress: detailedAddress,
            ward: wards.find((item) => item.code === selectedWard)?.name,
            district: districts.find((item) => item.code === selectedDistrict)?.name,
            city: provinces.find((item) => item.code === selectedProvince)?.name,
          },
        };
        // Lưu thông tin vào AsyncStorage
        await AsyncStorage.setItem('guestInfo', JSON.stringify(userData));

        Alert.alert('Thành công', 'Nhập Thông Tin Thành Công');
        navigation.replace('AddToCartScreen')
      } catch (error) {
        Alert.alert('Thất bại', 'Nhập Thông Tin thất bại');
        console.error(error);
      }
    } else {
      // Cập nhật trạng thái lỗi nếu không hợp lệ
      setIsValidFistame(firstName.length !== 0);
      setIsValidLastname(lastName.length !== 0);
      setIsValidEmail(email.length != 0);
      setIsValidSdt(sdt.length !== 0 ? isValidSdt : false);
    }
  };


  const formattedDate = `${dateOfBirth.getDate()}/${dateOfBirth.getMonth() + 1
    }/${dateOfBirth.getFullYear()}`;
  console.log(wards.find((item) => item.code === selectedWard)?.name);

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableOnAndroid={true} // Kích hoạt hỗ trợ trên Android
        extraHeight={150} // Điều chỉnh khoảng cách bàn phím với nội dung
        extraScrollHeight={-200} // Tùy chỉnh thêm khoảng cách cuộn
        keyboardShouldPersistTaps="handled" // Xử lý khi nhấn ngoài input
      >
        <View style={{ flex: 1 }}>
          {/* Nút quay lại */}
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#000" />
          </Pressable>
          {/* Tiêu đề */}
          <Text style={styles.title}>Thông Tin & Mật Khẩu</Text>
          <Text style={styles.subtitle}>
            Hoàn thành dữ liệu cuối cùng sau đây để vào ứng dụng Mega Mall
          </Text>
          <Text style={styles.textTitle}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập Email"
            placeholderTextColor="#C4C4C4"
            value={email}
            onChangeText={setEmail}
          />
          {!isValidEmail && (
            <Text style={{ color: 'red' }}>
              <Icon name="exclamation-triangle" size={15} color="red" />
              Email không được để trống
            </Text>
          )}
          <Text style={styles.textTitle}>Họ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ"
            placeholderTextColor="#C4C4C4"
            value={firstName}
            onChangeText={setFirstname}
          />
          {!isValidFirstname && (
            <Text style={{ color: 'red' }}>
              <Icon name="exclamation-triangle" size={15} color="red" />
              Họ không được để trống
            </Text>
          )}
          <Text style={styles.textTitle}>Tên đệm và tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên đệm và tên"
            placeholderTextColor="#C4C4C4"
            value={lastName}
            onChangeText={(e) => setLastname(e)}
          />
          {!isValidLastname && (
            <Text style={{ color: 'red' }}>
              <Icon name="exclamation-triangle" size={15} color="red" />
              Tên đệm và tên không được để trống
            </Text>
          )}
          <Text style={styles.textTitle}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            placeholderTextColor="#C4C4C4"
            value={sdt}
            onChangeText={setSdt}
            keyboardType="numeric"
          />
          {!isValidSdt && (
            <Text style={{ color: 'red' }}>
              <Icon name="exclamation-triangle" size={15} color="red" /> số điện
              thoại gồm 10 ký tự
            </Text>
          )}
          {/* Date of Birth Selection */}
          <Text style={styles.textTitle}>Ngày/Tháng/Năm sinh </Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {dateOfBirth ? formattedDate : 'What is your date of birth?'}
            </Text>
          </TouchableOpacity>

          {/* Day Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {/* Input Address*/}
          <Text style={styles.textTitle}>Địa Chỉ</Text>
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


          {/* Nút Sign In và Cancel */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.signInButton, { backgroundColor: '#3669c9' }]}
              onPress={handleLogin} // Gọi hàm đăng nhập khi nhấn nút
            >
              <Text style={styles.signInText}>Lưu Thông Tin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText} onPress={() => navigation.goBack()}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

      </KeyboardAwareScrollView>
      <AlertComponent
        title={alertType === 'success' ? 'Success' : 'Error'}
        description={alertType === 'success' ? null : titleAleft}
        alertType={alertType}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFF',
  },
  backButton: {
    marginVertical: 20,
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  titleBold: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginVertical: 15,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginVertical: 20,
  },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 10,
    borderColor: '#E0E0E0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    fontSize: 14,
    borderColor: '#E0E0E0',
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
  },
  eyeText: {
    fontSize: 30,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 10,
  },
  signInButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  signInText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center'
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#3669c9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '60%',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 14,
    color: '#0066FF',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
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
});
export default InformationScreen;
