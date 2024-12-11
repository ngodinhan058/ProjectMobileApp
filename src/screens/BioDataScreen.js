import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from './api/config';
import IconI from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import UploadImage from '../components/Up_Image';

const BiodataScreen = ({ navigation, route }) => {
  const { userData } = route.params;
  const [formData, setFormData] = useState({
    userPhone: '',
    userBirthday: '',
    userLastName: '',
    userFirstName: '',
    userAddress: 'Loading...',
  });

  const [avatar, setAvatar] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(userData?.userImagePath);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) throw new Error('No user token found');

        const { token } = JSON.parse(userData);
        const response = await fetch(`${BASE_URL}auth/users/myInfo`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userInfo = await response.json();
          const userData = userInfo.data;

          setFormData({
            userPhone: userData.userPhone,
            userBirthday: userData.userBirthday
              ? new Date(userData.userBirthday).toISOString().slice(0, 10)
              : '',
            userLastName: userData.userLastName,
            userFirstName: userData.userFirstName,
            userAddress: userData.address
              ? `${userData.address.addressName}, ${userData.address.ward}, ${userData.address.district}, ${userData.address.city}`
              : 'No Address Found',
          });

          setAvatar(userData.userImagePath || null);
        } else {
          Alert.alert('Error', 'Failed to fetch user information');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        Alert.alert('Error', 'Failed to fetch user information');
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) throw new Error('No user token found');

      const { token } = JSON.parse(userData);

      const formDataToSend = new FormData();

      const requestPayload = {
        userPhone: formData.userPhone,
        userBirthday: formData.userBirthday,
        userLastName: formData.userLastName,
        userFirstName: formData.userFirstName,
      };
      formDataToSend.append('request', JSON.stringify(requestPayload));

      if (selectedImage) {
        const fileType = selectedImage.split('.').pop();

        const newFile = {
          uri: selectedImage,
          name: `user-image.${fileType}`,
          type: `image/${fileType}`,
        };
        formDataToSend.append('image', newFile);
      }

      const response = await axios.put(
        `${BASE_URL}auth/customer/myInfo`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
        navigation.goBack();
      } else {
        console.error('Response error data:', response.data);
        Alert.alert(
          'Error',
          `Failed to update profile. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Response error:', error.response.data);
      }
      Alert.alert('Error', 'Unable to update profile due to a network error.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || userBirthday;
    setShowDatePicker(false);
    handleInputChange('userBirthday', currentDate);
  };

  console.log(userData?.roles.filter((r) => r.roleName === 'SHIPPER'));

  const hasPermission = (role) =>
    userData?.roles.filter((r) => r.roleName === role);

  return (
    <View style={styles.container}>
      {/* Header */}

      {hasPermission('SHIPPER').length === 0 ? (
        <View style={styles.iconHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="angle-left" size={35} color="#000" />
          </Pressable>
          <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>
        </View>
      ) : (
        <View style={{ paddingTop: 20 }}></View>
      )}

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <UploadImage
          onImagesSelected={setSelectedImage}
          image={selectedImage}
        />

        {/* <Text style={styles.nameText}>{formData.username || 'Tên người dùng'}</Text> */}
      </View>

      <ScrollView style={{ flex: 1, marginTop: 30, marginHorizontal: 2 }}>
        {/* First Name */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.textTitle}>Họ và Tên Đệm: </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập Họ và Tên Đệm"
              value={formData.userFirstName}
              onChangeText={(text) => handleInputChange('userLastName', text)}
            />
          </View>

          <View style={{ flex: 1 }}>
            {/* Last Name */}
            <Text style={styles.textTitle}>Tên Của Bạn: </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập Tên Của Bạn"
              value={formData.userLastName}
              onChangeText={(text) => handleInputChange('userFirstName', text)}
            />
          </View>
        </View>

        {/* Phone Number */}
        <Text style={styles.textTitle}>Số Điện Thoại: </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Số Điện Thoại Của Bạn"
          value={formData.userPhone}
          onChangeText={(text) => handleInputChange('userPhone', text)}
          keyboardType="phone-pad"
        />

        {/* Date of Birth */}
        <Text style={styles.textTitle}>Ngày Sinh: </Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text>
              {formData.userBirthday
                ? new Date(formData.userBirthday).toISOString().split('T')[0]
                : 'Nhập Ngày Sinh Của Bạn'}
            </Text>
            <IconI name="calendar-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.userBirthday}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </ScrollView>

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton} onPress={handleSave}>
        <Text style={styles.updateButtonText}>Sửa Thông Tin Của Bạn</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingBottom: 20,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
    marginHorizontal: 5,
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
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
    paddingVertical: 50,
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
    marginTop: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default BiodataScreen;
