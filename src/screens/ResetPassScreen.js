import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';

const ResetPassScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    // Điều kiện để thay đổi màu nút: Email không rỗng và password trên 8 ký tự
    if (email.trim() !== '') {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [email]);


  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}  // Kích hoạt hỗ trợ trên Android
      extraHeight={150}  // Điều chỉnh khoảng cách bàn phím với nội dung
      extraScrollHeight={-280}  // Tùy chỉnh thêm khoảng cách cuộn
      keyboardShouldPersistTaps="handled"  // Xử lý khi nhấn ngoài input
    >
      <View style={{ flex: 1, }}>
        {/* Nút quay lại */}
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="angle-left" size={35} color="#000" />
        </Pressable>

        {/* Tiêu đề */}
        <Text style={styles.title}>Quên Mật Khẩu</Text>
        <Text style={styles.titleBold}>Mega Mall</Text>
        <Text style={styles.subtitle}>Nhập email/ Số điện thoại để lấy mã xác nhận</Text>
        {/* Input email/ Số điện thoại */}
        <Text style={styles.label}>Email/ Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email/ Số điện thoại"
          placeholderTextColor="#C4C4C4"
          value={email}
          onChangeText={setEmail}
        />

        {/* Nút Sign In và Cancel */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              { backgroundColor: isButtonEnabled ? '#3669c9' : '#E0E0E0' },
            ]}
            disabled={!isButtonEnabled}
            onPress={() => navigation.navigate('VerificationForgotScreen')} // Gọi hàm đăng nhập khi nhấn nút
          >
            <Text style={styles.signInText}>Tiếp tục</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText} onPress={() => navigation.goBack()}>Cancel</Text>
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
    justifyContent: 'center'
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
