import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BASE_URL } from './api/config';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    if (email.trim() !== '' && password.length >= 2) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [email, password]);

  const login = async (email, password) => {
    try {
      console.log({ userEmail: email, userPassword: password });
      const response = await axios.post(`${BASE_URL}users`, {
        userEmail: email,
        userPasswordLevel2: password,
      });
      const userData = response.data.data;
      await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Lưu thông tin người dùng
      return userData;
    } catch (error) {
      console.error('Login failed', error.response ? error.response.data : error.message);
      throw error; // Ném lỗi để có thể hiển thị thông báo
    }
  };

  const handleLogin = async () => {
    try {
      const userData = await login(email, password); // Gọi API để kiểm tra
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.replace('HaveLoginHome'); // Điều hướng sau khi đăng nhập
    } catch (error) {
      Alert.alert('Thất bại', 'Sai email hoặc mật khẩu. Vui lòng thử lại.');
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
      <View style={styles.innerContainer}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>

        <Text style={styles.title}>Chào Mừng Bạn Quay Lại</Text>
        <Text style={styles.titleBold}>Mega Mall</Text>
        <Text style={styles.subtitle}>Nhập Email/Tên Đăng Nhập, và Mật khẩu để đăng nhập</Text>

        <Text style={styles.label}>Tên Đăng Nhập/ Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên Đăng Nhập/ Gmail"
          placeholderTextColor="#C4C4C4"
          value={email}
          onChangeText={setEmail}
        />

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

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: isButtonEnabled ? '#3669c9' : '#E0E0E0' },
            ]}
            disabled={!isButtonEnabled}
            onPress={handleLogin}
          >
            <Text style={styles.signInText}>Đăng Nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ResetPassScreen')}>
            <Text style={styles.footerText}>Quên Mật Khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={{ color: '#3669c9', fontSize: 14, fontWeight: 'bold' }}>Sign Up</Text>
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
  innerContainer: {
    flex: 1,
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
    marginBottom: 20,
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
    fontWeight: 'bold',
  },
});

export default LoginScreen;
