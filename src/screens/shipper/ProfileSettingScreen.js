import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "../api/config";
import axios from "axios";


const ProfileSettingScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    userPhone: "",
    userBirthday: "",
    userLastName: "",
    userFirstName: "",
    userAddress: "Loading...",
  });

  const [avatar, setAvatar] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) throw new Error("No user token found");

        const { token } = JSON.parse(userData);
        const response = await fetch(`${BASE_URL}auth/users/myInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userInfo = await response.json();
          const userData = userInfo.data;

          setFormData({
            userPhone: userData.userPhone,
            userBirthday: userData.userBirthday
              ? new Date(userData.userBirthday).toISOString().slice(0, 10)
              : "",
            userLastName: userData.userLastName,
            userFirstName: userData.userFirstName,
            userAddress: userData.address
              ? `${userData.address.addressName}, ${userData.address.ward}, ${userData.address.district}, ${userData.address.city}`
              : "No Address Found",
          });

          setAvatar(userData.userImagePath || null);
        } else {
          Alert.alert("Error", "Failed to fetch user information");
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        Alert.alert("Error", "Failed to fetch user information");
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSave = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("No user token found");
  
      const { token } = JSON.parse(userData);
  
      const formDataToSend = new FormData();
  
      const requestPayload = {
        userPhone: formData.userPhone,
        userBirthday: formData.userBirthday,
        userLastName: formData.userLastName,
        userFirstName: formData.userFirstName,
      };
      formDataToSend.append("request", JSON.stringify(requestPayload));
  
      if (imageFile) {
        formDataToSend.append("image", {
          uri: imageFile.uri,
          name: imageFile.name || "avatar.jpg",
          type: "image/jpeg",
        });
      }
  
      const response = await axios.put(
        `${BASE_URL}auth/customer/myInfo`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        console.error("Response error data:", response.data);
        Alert.alert("Error", `Failed to update profile. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error.message);
      if (error.response) {
        console.error("Response error:", error.response.data);
      }
      Alert.alert("Error", "Unable to update profile due to a network error.");
    }
  };

  const handleChooseAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Permission to access media library is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        setAvatar(file.uri);
        setImageFile({
          uri: file.uri,
          name: file.uri.split("/").pop(),
          type: file.type || "image/jpeg",
        });
      }
    } catch (error) {
      console.error("Error while picking image: ", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={handleChooseAvatar}>
          <Image
            source={{
              uri: avatar || "https://example.com/default-avatar.png",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.avatarText}>Tap to change profile picture</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          value={formData.userLastName}
          onChangeText={(text) => handleInputChange("userLastName", text)}
          placeholder="Enter your last name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          value={formData.userFirstName}
          onChangeText={(text) => handleInputChange("userFirstName", text)}
          placeholder="Enter your first name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={formData.userPhone}
          onChangeText={(text) => handleInputChange("userPhone", text)}
          placeholder="Enter your phone number"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Birthday</Text>
        <TextInput
          value={formData.userBirthday}
          onChangeText={(text) => handleInputChange("userBirthday", text)}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 14,
    color: "#666",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#B8B8B8",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#3669C9",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileSettingScreen;
