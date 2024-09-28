import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Button, Pressable, Image,TouchableWithoutFeedback  } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';


const BiodataScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleGenderSelect = (selectedGender) => {
    setGender(selectedGender);
    setIsGenderModalVisible(false);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconHeader}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>
        <Text style={styles.textHeader}>Thông Tin Của Bạn</Text>
      </View>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Avatar%20Doremon%20cute-doi-mu.jpg?1704788682389' }} // URL hình ảnh đại diện
        />
        <Text style={styles.nameText}>Yourname</Text>
        <Text style={styles.emailText}>youremail@gmail.com</Text>
      </View>

      {/* First Name */}
      <TextInput
        style={styles.input}
        placeholder="What's your first name?"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* Last Name */}
      <TextInput
        style={styles.input}
        placeholder="And your last name?"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* Phone Number */}
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Gender */}
      <TouchableOpacity style={styles.input} onPress={() => setIsGenderModalVisible(true)}>
        <Text>{gender ? gender : 'Select your gender'}</Text>
      </TouchableOpacity>

      {/* Gender Selection Modal */}
      <Modal visible={isGenderModalVisible} transparent={true} animationType="slide">
  <TouchableWithoutFeedback onPress={() => setIsGenderModalVisible(false)}>
    <View style={styles.modalContainer}>
      <FlatList
        data={genderOptions}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.optionButton} onPress={() => handleGenderSelect(item)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </TouchableWithoutFeedback>
</Modal>

      {/* Date of Birth */}
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{dateOfBirth ? dateOfBirth.toDateString() : 'What is your date of birth?'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Update Button */}
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  backButton: {
    marginRight: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#fff'
},
  avatarContainer: {
    justifyContent:'space-between',
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
  nameText:{
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 20,
  },
  emailText:{
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ABABAB',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
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
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BiodataScreen;
