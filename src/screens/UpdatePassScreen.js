import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { BASE_URL } from './api/config'; // Ensure this points to your API's base URL

const UpdatePassScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const { email } = route.params; // Get email passed from the previous screen

  useEffect(() => {
    // Enable the button only if both passwords are at least 8 characters long
    if (password.length >= 8 && passwordAgain.length >= 8) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [password, passwordAgain]);

  // Handle password reset by making an API call to the backend
  const handlePasswordReset = async () => {
    if (password === passwordAgain) {
      try {
        const response = await axios.post(`${BASE_URL}auth/reset?email=${email}`, {
          userPassword: password,
          confirmPassword: passwordAgain,
        });

        // Show success alert if the password is updated
        Alert.alert('Thành công', 'Mật khẩu đã được cập nhật!');
        navigation.navigate('LoginScreen'); // Navigate to the login screen
      } catch (error) {
        // Show error alert if there's an issue
        Alert.alert('Thất bại', 'Đã có lỗi xảy ra, vui lòng thử lại.');
        console.error(error);
      }
    } else {
      // Alert if the passwords do not match
      Alert.alert('Thất bại', 'Mật khẩu không trùng khớp, vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={150}
      extraScrollHeight={-200}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }}>
        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>Cập Nhật Mật Khẩu</Text>
        <Text style={styles.subtitle}>Hoàn thành dữ liệu cuối cùng sau đây để vào ứng dụng Mega Mall</Text>

        {/* Password Input */}
        <Text style={styles.label}>Mật Khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Mật Khẩu"
            placeholderTextColor="#C4C4C4"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#C4C4C4" />
          </Pressable>
        </View>
        <Text style={{ color: '#C4C4C4' }}><Icon name="info-circle" size={15} color="#C4C4C4" /> Mật khẩu phải có 8 ký tự trở lên</Text>

        {/* Confirm Password Input */}
        <Text style={styles.label}>Nhập Lại Mật Khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Mật Khẩu"
            placeholderTextColor="#C4C4C4"
            secureTextEntry={!showPassword}
            value={passwordAgain}
            onChangeText={setPasswordAgain}
          />
          <Pressable
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#C4C4C4" />
          </Pressable>
        </View>

        {/* Sign In Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: isButtonEnabled ? '#3669c9' : '#E0E0E0' }]}
            disabled={!isButtonEnabled}
            onPress={handlePasswordReset} // Call API to reset the password
          >
            <Text style={styles.signInText}>Cập Nhật Mật Khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
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
  },
  signInButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  signInText: {
    fontSize: 14,
    color: '#FFF',
  },
  cancelButton: {
    backgroundColor: '#3669c9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  cancelText: {
    fontSize: 14,
    color: '#FFF',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '60%',
    
  },
  footerText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  },
  signUpText: {
    fontSize: 14,
    color: '#0066FF',
  },
});
export default UpdatePassScreen;