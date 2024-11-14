import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PasswordScreen = ({ route, navigation }) => {
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [sdt, setSdt] = useState('');
  const [address, setAdrress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [passwordWarning, setPasswordWarning] = useState('');
  const [isValidLastname, setIsValidLastname] = useState(true);
  const [isValidFirstname, setIsValidFistame] = useState(true);
  const [isValidSdt, setIsValidSdt] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const { userEmail } = route.params;

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"',.<>?])[A-Za-z\d!@#$%^&*()_+{}\[\]:;"',.<>?]{8,}$/;
    const phoneNumberRegex = /^\d{10}$/;

    if (sdt.length !== 0) {
      setIsValidSdt(phoneNumberRegex.test(sdt));
    }

    if (password.length !== 0) {
      setIsPasswordValid(passwordRegex.test(password));
    }

    const validateInputs = () => {
      // Set warning message for password if invalid
      if (password.length !== 0 && !isPasswordValid) {
        setPasswordWarning(
          'Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, thường, số và ký tự đặc biệt'
        );
      } else {
        setPasswordWarning('');
      }
    };

    const timeoutId = setTimeout(() => {
      validateInputs();
    }, 2000); // Wait for 2000 milliseconds (2 seconds)

    // Cleanup function to clear timeout if values change
    return () => {
      clearTimeout(timeoutId);
    };
  }, [password, sdt]);

  const register = async (body) => {
    try {
      const response = await axios.post(
        `${BASE_URL}auth/register?userEmail=${email}`,
        body
      );
      const userData = response.data;

      //await AsyncStorage.setItem('userData', JSON.stringify(userData)); // Lưu thông tin người dùng
      return userData;
    } catch (error) {
      // console.log(error.response.data.error);

      // console.error(
      //   'Send otp throw email failed',
      //   error.response ? error.response.data : error.message
      // );
      throw error; // Ném lỗi để có thể hiển thị thông báo
    }
  };

  const handleRegister = async (body) => {
    try {
      const userData = await register(body); // Gọi API để kiểm tra
      //Alert.alert('Thành công', 'Đăng nhập thành công!');
      //navigation.replace('HaveLoginHome'); // Điều hướng sau khi đăng nhập
    } catch (error) {
      //Alert.alert('Thất bại', error.response.data.error);
    }
  };

  // Hàm giả lập đăng nhập
  const handleLogin = () => {
    if (
      isPasswordValid &&
      isValidFirstname &&
      isValidLastname &&
      isValidSdt &&
      isPasswordValid &&
      password === passwordAgain
    ) {
      handleRegister({
        userPassword: password,
        userPhone: sdt,
        userAddress: address,
        userLastName: lastName,
        userFirstName: firstName,
      });
    }

    setIsValidFistame(firstName.length !== 0);
    setIsValidLastname(lastName.length !== 0);
    setIsValidSdt(sdt.length !== 0 ? isValidSdt : false);
    setIsPasswordValid(password.length !== 0);
  };

  console.log('sdt', sdt);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true} // Kích hoạt hỗ trợ trên Android
      extraHeight={150} // Điều chỉnh khoảng cách bàn phím với nội dung
      extraScrollHeight={-200} // Tùy chỉnh thêm khoảng cách cuộn
      keyboardShouldPersistTaps="handled" // Xử lý khi nhấn ngoài input
    >
      <View style={{ flex: 1 }}>
        {/* Nút quay lại */}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#000" />
        </Pressable>

        {/* Tiêu đề */}
        <Text style={styles.title}>Thông Tin & Mật Khẩu</Text>
        <Text style={styles.subtitle}>
          Hoàn thành dữ liệu cuối cùng sau đây để vào ứng dụng Mega Mall
        </Text>

        {/* Input Fullname*/}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Tên Đầy Đủ"
          placeholderTextColor="#C4C4C4"
          value={userEmail}
          editable={false}
        />

        <Text style={styles.label}>Họ</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ"
          placeholderTextColor="#C4C4C4"
          value={firstName}
          onChangeText={setFirstname}
        />
        {!isValidFirstname && (
          <Text style={{ color: 'red' }}>
            <Icon name="exclamation-triangle" size={15} color="red" />
            Họ không được để trống
          </Text>
        )}

        <Text style={styles.label}>Tên đệm và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên đệm và tên"
          placeholderTextColor="#C4C4C4"
          value={lastName}
          onChangeText={(e) => setLastname(e)}
        />
        {!isValidLastname && (
          <Text style={{ color: 'red' }}>
            <Icon name="exclamation-triangle" size={15} color="red" />
            Tên đệm và tên không được để trống
          </Text>
        )}

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#C4C4C4"
          value={sdt}
          onChangeText={setSdt}
          keyboardType="numeric"
        />
        {!isValidSdt && (
          <Text style={{ color: 'red' }}>
            <Icon name="exclamation-triangle" size={15} color="red" /> số điện
            thoại gồm 10 ký tự
          </Text>
        )}
        {/* Input Address*/}
        <Text style={styles.label}>Địa Chỉ</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập Địa Chỉ"
          placeholderTextColor="#C4C4C4"
          value={address}
          onChangeText={setAdrress}
        />

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
            <Icon
              name={showPassword ? 'eye' : 'eye-slash'}
              size={20}
              color="#C4C4C4"
            />
          </Pressable>
        </View>
        {!isPasswordValid && (
          <Text style={{ color: 'red' }}>
            <Icon name="exclamation-triangle" size={15} color="red" /> Mật khẩu
            phải chứa ít nhất 8 ký tự bao gồm chữ hoa, thường, số và ký tự đặc
            biệt
          </Text>
        )}
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
            <Icon
              name={showPassword ? 'eye' : 'eye-slash'}
              size={20}
              color="#C4C4C4"
            />
          </Pressable>
        </View>
        {passwordAgain.length !== 0 && password !== passwordAgain && (
          <Text style={{ color: 'red' }}>
            <Icon name="exclamation-triangle" size={15} color="red" /> Mật khẩu
            không giống nhau
          </Text>
        )}

        {/* Nút Sign In và Cancel */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: '#3669c9' }]}
            onPress={handleLogin} // Gọi hàm đăng nhập khi nhấn nút
          >
            <Text style={styles.signInText}>Đăng ký</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText} onPress={() => navigation.goBack()}>
              Cancel
            </Text>
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
    fontWeight: 'bold',
  },
  signUpText: {
    fontSize: 14,
    color: '#0066FF',
  },
});
export default PasswordScreen;
