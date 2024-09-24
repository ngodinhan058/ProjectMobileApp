import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const NewItem = ({ title, description, date, image }) => {
  // Hàm để giới hạn mô tả, cắt chuỗi sau 30 ký tự
  const truncateDescription = (text) => {
    return text.length > 30 ? text.substring(0, 30) + '...' : text;
  };

  return (
    <View style={styles.container}>
      {/* Nội dung bài viết */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{truncateDescription(description)}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Hình ảnh bài viết */}
      <Image source={image} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default NewItem;
