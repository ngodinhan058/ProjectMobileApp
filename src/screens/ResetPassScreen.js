import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from './api/config';

const ResetPassScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Kiểm tra email để kích hoạt nút
    setIsButtonEnabled(email.trim() !== '');
  }, [email]);

  const enterEmail = async (email) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}auth/forgot?email=${email}`
      );
      return response.data;
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      Alert.alert('Thất bại', 'Không thể gửi email xác nhận.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await enterEmail(email);
      navigation.navigate('VerificationForgotScreen', { email }); // Truyền email đúng key
    } catch (error) {
      // Báo lỗi nếu không gửi được email
      Alert.alert('Thất bại', 'Không thể gửi email xác nhận.');
    }
  };
  

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraHeight={150}
      extraScrollHeight={-280}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ flex: 1 }}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>

        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.titleBold}>Mega Mall</Text>
        <Text style={styles.subtitle}>
          Nhập email để lấy mã xác nhận
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          placeholderTextColor="#C4C4C4"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: isButtonEnabled ? '#3669c9' : '#E0E0E0' },
            ]}
            disabled={!isButtonEnabled}
            onPress={handleReset}
          >
            <Text style={styles.signInText}>Tiếp tục</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText} onPress={() => navigation.goBack()}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#3669c9" />
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
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
    marginTop: '98%',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginRight: 10,
  },
  signUpText: {
    fontSize: 14,
    color: '#0066FF',
  },
});
export default ResetPassScreen;
