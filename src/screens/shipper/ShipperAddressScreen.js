import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../api/config";

function ShipperAddressScreen({ route, navigation }) {
  const [address, setAddress] = useState({
    addressName: "",
    ward: "",
    district: "",
    city: "",
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) throw new Error("No user token found");

        const { token } = JSON.parse(userData);
        const response = await axios.get(`${BASE_URL}auth/users/myInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userAddress = response.data.data.address;
        setAddress({
          addressName: userAddress.addressName || "",
          ward: userAddress.ward || "",
          district: userAddress.district || "",
          city: userAddress.city || "",
        });
      } catch (error) {
        console.error("Failed to fetch user address:", error);
        Alert.alert("Error", "Failed to fetch user address information");
      }
    };

    fetchUserAddress();
  }, []);

  const handleInputChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAddress = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) throw new Error("No user token found");

      const { token } = JSON.parse(userData);

      await axios.put(
        `${BASE_URL}auth/users/updateAddress`,
        { ...address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Address updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save address:", error);
      Alert.alert("Error", "Failed to save address information");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Street Name</Text>
      <TextInput
        value={address.addressName}
        onChangeText={(text) => handleInputChange("addressName", text)}
        placeholder="Enter street name"
        style={styles.input}
      />

      <Text style={styles.label}>Ward</Text>
      <TextInput
        value={address.ward}
        onChangeText={(text) => handleInputChange("ward", text)}
        placeholder="Enter ward"
        style={styles.input}
      />

      <Text style={styles.label}>District</Text>
      <TextInput
        value={address.district}
        onChangeText={(text) => handleInputChange("district", text)}
        placeholder="Enter district"
        style={styles.input}
      />

      <Text style={styles.label}>City</Text>
      <TextInput
        value={address.city}
        onChangeText={(text) => handleInputChange("city", text)}
        placeholder="Enter city"
        style={styles.input}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAddress}>
        <Text style={styles.saveButtonText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
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
    marginBottom: 20,
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

export default ShipperAddressScreen;
