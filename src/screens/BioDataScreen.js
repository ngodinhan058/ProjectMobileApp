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

  const [userPhone, setUserPhone] = useState(userData.userPhone);
  const [userBirthday, setUserBirthday] = useState(
    new Date(userData.userBirthday)
  );
  const [userLastName, setUserLastName] = useState(userData.userLastName);
  const [userFirstName, setUserFirstName] = useState(userData.userFirstName);
  const [userImagePath, setUserImagePath] = useState(
    'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doi-mu.jpg'
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState({}); // Để lưu thông tin user (bao gồm token)
  const [selectedImage, setSelectedImage] = useState(userData?.userImagePath);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('userData');
        if (savedCart) {
          const { username, token } = JSON.parse(savedCart);
          setUser({ username, token });
        }
      } catch (error) {
        console.error('Error loading user data from AsyncStorage:', error);
      }
    };

    loadUser();
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || userBirthday;
    setShowDatePicker(false);
    setUserBirthday(currentDate);
  };

  const callApiUpdate = async (token, formData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}auth/customer/myInfo`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Token được lấy từ AsyncStorage
          },
        }
      );
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = () => {
    if (!selectedImage) {
      Alert.alert('Error', 'images is required.');
      return;
    }
    const formData = new FormData();

    const formattedDate = userBirthday.toISOString().split('T')[0];

    const fileType = selectedImage.split('.').pop();

    const newFile = {
      uri: selectedImage,
      name: `user-image.${fileType}`,
      type: `image/${fileType}`,
    };

    formData.append('image', newFile);

    const userData = {
      userPhone: userPhone,
      userBirthday: formattedDate,
      userLastName: userLastName,
      userFirstName: userFirstName,
      userPassword: '12345678', // Replace with the real password or hashed password
    };
    // const url = `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=car&api_key=${apiKey}`;

    formData.append('request', JSON.stringify(userData));

    if (!user.token) {
      Alert.alert('Error', 'User token is missing. Please log in again.');
      return;
    }

    callApiUpdate(user.token, formData);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.iconHeader}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>
        <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <UploadImage
          onImagesSelected={setSelectedImage}
          image={selectedImage}
        />

        <Text style={styles.nameText}>{user.username || 'Tên người dùng'}</Text>
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
              value={userFirstName}
              onChangeText={setUserFirstName}
            />
          </View>

          <View style={{ flex: 1 }}>
            {/* Last Name */}
            <Text style={styles.textTitle}>Tên Của Bạn: </Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập Tên Của Bạn"
              value={userLastName}
              onChangeText={setUserLastName}
            />
          </View>
        </View>

        {/* Phone Number */}
        <Text style={styles.textTitle}>Số Điện Thoại: </Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Số Điện Thoại Của Bạn"
          value={userPhone}
          onChangeText={setUserPhone}
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
              {userBirthday
                ? userBirthday.toISOString().split('T')[0]
                : 'Nhập Ngày Sinh Của Bạn'}
            </Text>
            <IconI name="calendar-outline" size={22} color="#000" />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={userBirthday}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </ScrollView>

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProfile}
      >
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
