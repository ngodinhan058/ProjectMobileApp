import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to AsyncStorage
export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value)); // Đảm bảo luôn lưu dưới dạng JSON
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
};

// Load data from AsyncStorage
export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value); // Chỉ parse nếu là JSON hợp lệ
      } catch (parseError) {
        console.error(`Error parsing data for key "${key}":`, parseError);
        return []; // Trả về mảng trống nếu parse thất bại
      }
    }
    return []; // Trả về mảng trống nếu không có dữ liệu
  } catch (error) {
    console.error(`Error loading data for key "${key}":`, error);
    return [];
  }
};

// Remove data from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
  }
};

// Check if data exists in AsyncStorage
export const checkDataExists = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null; // Trả về true nếu dữ liệu tồn tại
  } catch (error) {
    console.error(`Error checking existence of data for key "${key}":`, error);
    return false; // Trả về false nếu có lỗi
  }
};
