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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AlertComponent from '../components/AlertComponent';


const CreateAddressScreen = ({ navigation }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [detailedAddress, setDetailedAddress] = useState('');
  const [modalVisible, setModalVisible] = useState({ type: '', visible: false });
  const [searchKeyword, setSearchKeyword] = useState(''); // Từ khóa tìm kiếm
  const [titleAleft, setTitleAleft] = useState();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    axios.get('https://provinces.open-api.vn/api/p/')
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      axios.get(`https://provinces.open-api.vn/api/d/?province_code=${selectedProvince}`)
        .then((response) => setDistricts(response.data))
        .catch((error) => console.error(error));
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`https://provinces.open-api.vn/api/w/?district_code=${selectedDistrict}`)
        .then((response) => setWards(response.data))
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
      setTitleAleft('Vui lòng chọn Phường/Xã trước!')
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
      setTitleAleft('Vui lòng chọn Tỉnh/Thành phố trước!')
    } else {
      openModal('district');
    }
  };
  const renderModalContent = () => {
    let data = [];
    let type = modalVisible.type;
    let title = '';
    if (type === 'province') {
      data = provinces,
        title = 'Tỉnh/Thành'
    }
    else if (type === 'district') {
      data = districts,
        title = 'Quận/Huyện'

    }
    else if (type === 'ward') {
      data = wards,
        title = 'Phường/Xã'

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
        <View style={{ height: 1, backgroundColor: '#EDEDED', width: '100%' }}></View>
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
          ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy kết quả</Text>}
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
        <TouchableOpacity style={styles.input} onPress={() => openModal('province')}>
          <Text>{provinces.find((item) => item.code === selectedProvince)?.name || 'Chọn Tỉnh/Thành phố'}</Text>
        </TouchableOpacity>
        <Text style={styles.textTitle}>Quận/Huyện: </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={handleDistrictPress}
        >
          <Text>{districts.find((item) => item.code === selectedDistrict)?.name || 'Chọn Quận/Huyện'}</Text>
        </TouchableOpacity>
        <Text style={styles.textTitle}>Phường/Xã: </Text>

        <TouchableOpacity
          style={styles.input}
          onPress={handleWardPress}
        >
          <Text>{wards.find((item) => item.code === selectedWard)?.name || 'Chọn Phường/Xã'}</Text>
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
          <View style={styles.modalContainer}>
            {renderModalContent()}
          </View>
        </Modal>
        <AlertComponent
          title={alertType === 'success' ? "Success" : "Error"}
          description={
            alertType === 'success'
              ? null
              : titleAleft
          }
          alertType={alertType}
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
        />
      </View>
      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Sửa Địa Chỉ Của Bạn</Text>
      </TouchableOpacity>

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
    marginVertical: 20
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

export default CreateAddressScreen;
