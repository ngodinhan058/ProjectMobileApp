import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { BASE_URL } from '../screens/api/config';

import axios from "axios";

const FilterScreen = ({
  isVisible,
  onClose,
  onApply,
  onReset,
  selectedProductcoupons,
}) => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState(
    selectedProductcoupons || null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const apiUrl = `${BASE_URL}coupons`;

    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const data = response.data.data.content;
        setCoupons(data);
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, []);

  const toggleCheckbox = (couponId) => {
    setSelectedCouponId(couponId === selectedCouponId ? null : couponId);
  };

  const handleApply = () => {
    const selectedCoupon = coupons.find((coupon) => coupon.couponId === selectedCouponId);

    const selectedFilters = selectedCoupon
      ? {
          couponId: selectedCoupon.couponId,
          couponName: selectedCoupon.couponName,
        }
      : { couponId: null, couponName: null };

    onApply(selectedFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedCouponId(null);
    onReset();
    onClose();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const couponsToShow = isExpanded ? coupons : coupons.slice(0, 4);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <Text style={styles.title}>Thương Hiệu</Text>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.checkboxContainer}>
            {couponsToShow.map((coupon) => (
              <View key={coupon.couponId} style={styles.checkboxRow}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleCheckbox(coupon.couponId)}
                >
                  <Text style={styles.checkboxText}>
                    {coupon.couponName.charAt(0).toUpperCase() +
                      coupon.couponName.slice(1)}
                  </Text>
                  {selectedCouponId === coupon.couponId && (
                    <View style={styles.checkedBox}>
                      <Text style={styles.tickCheckedBox}>✔</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={toggleExpand}>
            <Text style={styles.toggleButtonText}>
              {isExpanded ? "Thu gọn lại" : "Hiển thị thêm"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'relative',
    },
    container: {
        position: 'absolute',
        width: '100%',
        padding: 20,
        backgroundColor: '#FFF',
        height: '50%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        bottom: 0,
    },
    scrollView: {
        height: '20%',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    titleSmall: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    sliderContainer: {
        marginHorizontal: 15,

    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    resetButton: {
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
    },
    applyButton: {
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#3669c9',
        borderRadius: 10,
    },
    applyText: {
        color: 'white',
    },
    checkboxContainer: {
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    checkboxColumn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 150,
        height: 50,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxText: {
        position: 'absolute',
        fontSize: 16,
    },
    checkedBox: {
        width: 150,
        height: 50,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: '#3669c9'
    },
    tickCheckedBox: {
        position: 'absolute',
        width: 15,
        height: 15,
        backgroundColor: '#3669c9',
        borderRadius: 15,
        textAlign: 'center',
        color: '#fff',
        right: 5,
        top: 5,
        fontSize: 10,
    },
    toggleButtonText: {
        color: '#0066ff',
        textAlign: 'center',
        marginTop: 10,
    },

    radioContainer: {
        width: '100%',
        height: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3669c9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#3669c9',
    },
    radioText: {
        fontSize: 16,
    },
});

export default FilterScreen;