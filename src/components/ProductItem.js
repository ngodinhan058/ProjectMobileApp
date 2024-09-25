import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const ProductItem = ({ image, name, price, rating, review }) => {
  const [loading, setLoading] = useState(true); // Track the loading state

  const truncateName = (text) => {
    return text.length > 17 ? text.substring(0, 17) + '...' : text;
  };

  return (
    <View style={styles.container}>
      {loading && ( // Show the loading indicator while the image is loading
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      )}
      <Image
        source={image}
        style={styles.image}
        onLoad={() => setLoading(false)} // Once the image loads, hide the loading indicator
      />
      <Text style={styles.name}>{truncateName(name)}</Text>
      <Text style={styles.price}>{price} ₫</Text>
      <View style={styles.rate}>
        <Text style={styles.rating}>
          <Image source={require('../assets/star.png')} style={styles.icon} /> {rating}
        </Text>
        <Text style={styles.review}>{review} Review</Text>
        <Text style={styles.heart}>
          <Image source={require('../assets/heart.png')} />
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 156,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative', // Ensure the loading animation and image stack correctly
  },
  loadingIndicator: {
    position: 'absolute', // Center the loading indicator over the image
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    zIndex: 1,
  },
  image: {
    width: 125,
    height: 125,
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    height: 40,
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    color: 'red',
    fontSize: 14,
  },
  rate: {
    position: 'relative',
    width: 131,
    height: 15,
  },
  rating: {
    fontSize: 12,
  },
  review: {
    position: 'absolute',
    fontSize: 12,
    left: '30%',
  },
  heart: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 15,
    height: 15,
  },
  icon: {
    width: 12,
    height: 12,
  },
});

export default ProductItem;
