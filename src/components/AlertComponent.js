import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

const AlertComponent = ({ title, description, alertType, visible, onClose }) => {
    const [fadeAnim] = useState(new Animated.Value(0)); // Opacity animation
    const [translateYAnim] = useState(new Animated.Value(0)); // Slide animation

    useEffect(() => {
        if (visible) {
            // Hiện alert với animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // 2 giây sau, tự động ẩn alert
            const timeout = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateYAnim, {
                        toValue: -10, // Đi lên trên
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    if (onClose) onClose(); // Gọi hàm onClose sau khi ẩn
                });
            }, 2000);

            return () => clearTimeout(timeout);
        } else {
            // Ẩn ngay khi visible = false
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: -10,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const alertStyles = alertType === 'error' ? styles.errorAlert : styles.successAlert;

    return (
        <Animated.View
            style={[
                styles.alertContainer,
                alertStyles,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateYAnim }],
                },
            ]}
        >
            {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity> */}
            <Text style={styles.alertTitle}>{title}</Text>
            <Text style={styles.alertDescription}>{description}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: 5,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 8,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
        zIndex: 999,
    },
    errorAlert: {
        backgroundColor: '#ffcccc',
        borderColor: '#ff4d4d',
        borderWidth: 1,
    },
    successAlert: {
        backgroundColor: '#ccffcc',
        borderColor: '#33cc33',
        borderWidth: 1,
    },
    alertTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    alertDescription: {
        fontSize: 14,
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
        backgroundColor: 'transparent',
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AlertComponent;
