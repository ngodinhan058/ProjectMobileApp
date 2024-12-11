import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import UploadImage from '../../../../components/Up_Image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, CLOUD_VISION_API_URl } from '../../../api/config';
import axios from 'axios';

const EditIdCardScreen = ({ route, navigation }) => {
  const cardInfo = route.params.iCard;

  console.log('Äaaaa', cardInfo?.imageFrontPath);

  const onSuccess = (e) => {
    console.log(e.data); // Dữ liệu mã QR được quét
    // Xử lý dữ liệu ở đây (parse và hiển thị thông tin từ CCCD)
  };

  const [CCCDNumber, setCCCDNumber] = useState(
    cardInfo?.idCardNumber ? cardInfo?.idCardNumber : ''
  );
  const [selectedImageFront, setSelectedFront] = useState(
    cardInfo?.imageFrontPath
  );
  const [selectedImageBack, setSelectedImageBack] = useState(
    cardInfo?.imageFrontPath
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    cardInfo?.idCardDate ? new Date(cardInfo?.idCardDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const [base64StringFront, setBase64StringFront] = useState('');
  const [base64StringBack, setBase64StringBack] = useState('');

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const convertImageToBase64 = (uri, isFront) => {
    fetch(uri)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1]; // Extract Base64 part
          if (isFront) {
            setBase64StringFront(base64); // Save Base64 string for front image
          } else {
            setBase64StringBack(base64); // Save Base64 string for back image
          }
        };
        reader.readAsDataURL(blob); // Read Blob as Data URL
      })
      .catch((error) => {
        console.error('Error converting image to Base64:', error);
      });
  };

  // Function to call Cloud Vision API and extract CCCD number
  const getNumberCCCD = async (uri) => {
    const data = {
      requests: [
        {
          image: { content: uri },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        },
      ],
    };
    try {
      const response = await axios.post(`${CLOUD_VISION_API_URl}`, data);
      const regex = /No\.\s*:\s*(\d{12,})/;
      const match =
        response.data.responses[0].textAnnotations[0].description.match(regex);

      if (match && match[1]) {
        setCCCDNumber(match[1]);
      } else {
        console.log('Không tìm thấy số No.');
      }
    } catch (error) {
      console.error('Error fetching CCCD number:', error);
    }
  };

  function convertDateFormat(dateString) {
    // Tách ngày, tháng, năm từ chuỗi
    const [day, month, year] = dateString.split('/');

    // Trả về đối tượng Date
    const dateObject = new Date(`${year}-${month}-${day}`);

    // Kiểm tra xem đối tượng Date có hợp lệ không
    if (isNaN(dateObject.getTime())) {
      console.error('Invalid Date format');
      return null;
    }

    return dateObject;
  }

  // Function to get date of birth
  const getDate = async (uri) => {
    const data = {
      requests: [
        {
          image: { content: uri },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
        },
      ],
    };
    try {
      const response = await axios.post(`${CLOUD_VISION_API_URl}`, data);
      const regexDate = /\d{2}\/\d{2}\/\d{4}/;

      const matchDate =
        response.data.responses[0].textAnnotations[0].description.match(
          regexDate
        );

      console.log('Matched Date:', matchDate);

      if (matchDate && matchDate[0]) {
        setDateOfBirth(convertDateFormat(matchDate[0]));
      } else {
        console.log('Không tìm thấy ngày.');
      }
    } catch (error) {
      console.error('Error fetching date of birth:', error);
    }
  };

  // Watch for changes in selectedImageFront, convert to Base64 and get CCCD
  useEffect(() => {
    if (selectedImageFront) {
      convertImageToBase64(selectedImageFront, true); // Convert front image to Base64
    }
  }, [selectedImageFront]);

  // Watch for changes in selectedImageBack, convert to Base64 and get Date
  useEffect(() => {
    if (selectedImageBack) {
      convertImageToBase64(selectedImageBack, false); // Convert back image to Base64
    }
  }, [selectedImageBack]);

  // Watch the base64StringFront for the front image and call getNumberCCCD
  useEffect(() => {
    if (base64StringFront) {
      getNumberCCCD(base64StringFront); // Call getNumberCCCD when Base64 string is ready
    }
  }, [base64StringFront]);

  // Watch the base64StringBack for the back image and call getDate
  useEffect(() => {
    if (base64StringBack) {
      getDate(base64StringBack); // Call getDate when Base64 string is ready for back image
    }
  }, [base64StringBack]);

  const getItem = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('userData');

      if (savedCart) {
        const { username, token } = JSON.parse(savedCart);

        setUser({ username, token });
      } else {
        setUser({});
      }
    } catch (error) {
      console.error('Error loading cart from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  const putImage = async (formData) => {
    if (!user.token) {
      Alert.alert('Error', 'User token is missing. Please log in again.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}auth/idcard/${cardInfo.cardId}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      Alert.alert('Thành công', 'Chỉnh sửa CCCD thành công.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateCard = async () => {
    if (!selectedImageFront || !selectedImageBack) {
      Alert.alert('Error', 'Both front and back images are required.');
      return;
    }

    const formData = new FormData();

    const fileTypeFront = selectedImageFront.split('.').pop();
    const fileTypeBack = selectedImageBack.split('.').pop();

    const newFileFront = {
      uri: selectedImageFront,
      name: `user-image.${fileTypeFront}`,
      type: `image/${fileTypeFront}`,
    };

    const newFileBack = {
      uri: selectedImageBack,
      name: `user-image.${fileTypeBack}`,
      type: `image/${fileTypeBack}`,
    };

    const formattedDate = dateOfBirth.toISOString().split('T')[0];
    // const params = {
    //   idCardNumber: CCCDNumber,
    //   idCardDate: formData.append('idCardDate', formattedDate),
    // };
    formData.append('ImageFront', newFileFront);
    formData.append('ImageBack', newFileBack);
    formData.append('idCardNumber', CCCDNumber);
    formData.append('idCardDate', formattedDate);

    console.log('cccc', JSON.stringify(formData));
    putImage(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="angle-left" size={35} color="#000" />
          </Pressable>
          <Text style={styles.textHeader}>Sửa Thông Tin CCCD</Text>
        </View>

        {/* CCCD Form */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Số CCCD:</Text>
          <TextInput
            style={styles.input}
            placeholder="Sửa Số CCCD"
            value={CCCDNumber}
            onChangeText={setCCCDNumber}
          />

          <Text style={styles.label}>Ngày Cấp CCCD:</Text>
          {/* Date of Birth */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ lineHeight: 45 }}>
              {dateOfBirth
                ? dateOfBirth.toISOString().split('T')[0]
                : 'Sửa Ngày Cấp'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <Text style={styles.label}>Hình Mặt Trước CCCD:</Text>
          {/* Icon Image */}
          <UploadImage
            onImagesSelected={setSelectedFront}
            image={selectedImageFront}
          />
          <Text style={styles.label}>Hình Mặt Sau CCCD:</Text>
          {/* Icon Image */}
          <UploadImage
            onImagesSelected={setSelectedImageBack}
            image={selectedImageBack}
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdateCard}>
            <Text style={styles.buttonText}>Sửa</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 20,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageIcon: {
    width: 155,
    height: 140,
    marginVertical: 20,
  },
  formContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dropdown: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  selectedValue: {
    fontSize: 16,
  },

  button: {
    width: '100%',
    backgroundColor: '#3669c9',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
  },
  filter: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    alignItems: 'center',
    right: 0,
  },
  iconCenter: {
    fontSize: 35,
    color: '#3669c9',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default EditIdCardScreen;
