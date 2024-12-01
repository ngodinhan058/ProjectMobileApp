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
import axios from 'axios';
import { BASE_URL } from '../../../api/config';

const EditIdCardScreen = ({ route, navigation }) => {
  const cardInfo = route.params.iCard;

  const [CCCDNumber, setCCCDNumber] = useState(
    cardInfo?.idCardNumber ? cardInfo?.idCardNumber : ''
  );
  const [selectedImageFront, setSelectedFront] = useState(null);
  const [selectedImageBack, setSelectedImageBack] = useState(null);

  const [dateOfBirth, setDateOfBirth] = useState(
    cardInfo?.idCardDate ? new Date(cardInfo?.idCardDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  console.log(cardInfo);

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

    console.log(JSON.stringify(formData));
    console.log(`${BASE_URL}auth/idcard/${cardInfo.cardId}`);

    if (!user.token) {
      Alert.alert('Error', 'User token is missing. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}auth/idcard/${cardInfo.cardId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Specify content type for form data
          },
        }
      );
      Alert.alert('Thành công', 'Chỉnh sửa CCCD thành công.');
      navigation.navigate('EditUserScreen', { id: route.params.id });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
            image={cardInfo['imageFrontPath']}
          />
          <Text style={styles.label}>Hình Mặt Sau CCCD:</Text>
          {/* Icon Image */}
          <UploadImage
            onImagesSelected={setSelectedImageBack}
            image={cardInfo['imageBackPath']}
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
