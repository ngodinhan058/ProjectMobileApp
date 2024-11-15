import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BASE_URL } from './api/config';
import axios from 'axios';

const VerificationForgotScreen = ({ navigation, route }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const inputRefs = useRef([]);

  const { email } = route.params;

  useEffect(() => {
    const allFilled = code.every((digit) => digit !== '');
    setIsButtonEnabled(allFilled);
  }, [code]);

  const handleInputChange = (text, index) => {
    let newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Nếu người dùng nhập 1 ký tự và nó không phải là ký tự cuối, focus vào ô tiếp theo
    if (text && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Nếu người dùng nhấn "Backspace" và ô hiện tại trống, focus vào ô trước đó
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleGetOTP = async () => {
    try {
      const userData = await enterEmail(email); // Gọi API để kiểm tra
      //Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.navigate('Mega Mall'); // Điều hướng sau khi đăng nhập
    } catch (error) {
      //Alert.alert('Thất bại', error.response.data.error);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      console.log(`${BASE_URL}?email=${email}&otp=${otp}`);

      const response = await axios.post(
        `${BASE_URL}auth/verify?email=${email}&otp=${otp}`
      );

      console.log(`${BASE_URL}?email=${email}&otp=${otp}`);

      const userData = response.data;
      //await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Lưu thông tin người dùng
      return userData;
    } catch (error) {
      console.log(error);

      console.error(
        'Send otp throw email failed',
        error.response ? error.response.data : error.message
      );
      throw error; // Ném lỗi để có thể hiển thị thông báo
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const userData = await verifyOTP(otp); // Gọi API để kiểm tra
      navigation.navigate('PasswordScreen', { userEmail: email });
    } catch (error) {
      Alert.alert(
        'Thất bại',
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    handleGetOTP();
  }, []);

  const handleNextVerifyOTP = () => {
    handleVerifyOTP(code.join(''));
  };

  //() => navigation.navigate('UpdatePassScreen')
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true} // Kích hoạt hỗ trợ trên Android
      extraHeight={150} // Điều chỉnh khoảng cách bàn phím với nội dung
      extraScrollHeight={-200} // Tùy chỉnh thêm khoảng cách cuộn
      keyboardShouldPersistTaps="handled" // Xử lý khi nhấn ngoài input
    >
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* Tiêu đề */}
        <Text style={styles.title}>Xác Thực</Text>
        <Text style={styles.subtitle}>
          Chúng tôi đã gửi mã xác minh tới ****
          <Text style={styles.changeNumber}> Thay đổi?</Text>
        </Text>

        {/* Input Mã xác nhận */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              ref={(ref) => (inputRefs.current[index] = ref)} // Lưu ref vào mảng
            />
          ))}
        </View>

        <TouchableOpacity>
          <Text style={styles.resendCode}>Gửi Lại Mã</Text>
        </TouchableOpacity>

        {/* Nút Continue và Cancel */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: isButtonEnabled ? '#3669c9' : '#E0E0E0' }, // Change color based on button state
            ]}
            disabled={!isButtonEnabled} // Disable button if not enabled
            onPress={handleNextVerifyOTP}
          >
            <Text style={styles.continueText}>Tiếp Tục</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  changeNumber: {
    color: '#3669c9',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    textAlign: 'center',
    fontSize: 18,
    borderColor: '#E0E0E0',
  },
  resendCode: {
    fontSize: 14,
    color: '#3669c9',
    textAlign: 'right',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  continueButton: {
    backgroundColor: '#3669c9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  continueText: {
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
});

export default VerificationForgotScreen;
