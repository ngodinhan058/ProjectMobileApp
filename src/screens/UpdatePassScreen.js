import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const UpdatePassScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    // Điều kiện để thay đổi màu nút: Email không rỗng và password trên 8 ký tự
    if (password.length >= 8 && passwordAgain.length >= 8) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [password, passwordAgain]);

//   // Hàm giả lập đăng nhập
  const handleLogin = () => {
    if (password === passwordAgain) {
      // Đăng nhập thành công
      Alert.alert('Thành công', 'Thay đổi mật khẩu thành công!');
    } else {
      // Đăng nhập thất bại
      Alert.alert('Thất bại', 'Mật khẩu không trùng. Vui lòng thử lại.');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}  // Kích hoạt hỗ trợ trên Android
      extraHeight={150}  // Điều chỉnh khoảng cách bàn phím với nội dung
      extraScrollHeight={-200}  // Tùy chỉnh thêm khoảng cách cuộn
      keyboardShouldPersistTaps="handled"  // Xử lý khi nhấn ngoài input
    >
    <View style={{flex:1}}>
      {/* Nút quay lại */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#000" />
      </Pressable>

      {/* Tiêu đề */}
      <Text style={styles.title}>Cập Nhập Mật Khẩu</Text>
      <Text style={styles.subtitle}>Hoàn thành dữ liệu cuối cùng sau đây để vào ứng dụng Mega Mall</Text>

      {/* Input Password */}
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
      <Text style={{color: '#C4C4C4'}}><Icon name="info-circle" size={15} color="#C4C4C4" /> Mật khẩu phải có 8 ký tự trở lên</Text>

      {/* Input Again Password */}
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

      {/* Nút Sign In và Cancel */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.signInButton,
            { backgroundColor: isButtonEnabled ? '#3669c9' : '#E0E0E0' },
          ]}
          disabled={!isButtonEnabled}
          onPress={handleLogin} // Gọi hàm đăng nhập khi nhấn nút
        >
          <Text style={styles.signInText}>Đăng Nhập</Text>
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