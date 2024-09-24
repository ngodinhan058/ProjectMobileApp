import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SaleItem = ({ image, name, salePrice, originalPrice, rating, reviews }) => {
    const truncateName = (text) => {
        return text.length > 17 ? text.substring(0, 17) + '...' : text;
      };
  return (
    <View style={styles.container}>
      {/* Nhãn SALE */}
      <View style={styles.saleLabel}>
        <Text style={styles.saleText}>SALE</Text>
      </View>

      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{truncateName(name)}</Text>
      <Text style={styles.salePrice}>{salePrice}</Text>
      <Text style={styles.originalPrice}>{originalPrice}</Text>

      <View style={styles.rate}>
        <Text style={styles.rating}>
            <Image source={require('../assets/star.png')} style={styles.icon}/> {rating}</Text>
        <Text style={styles.review}>{reviews} Review</Text>
        <Text style={styles.heart}><Image source={require('../assets/heart.png')}/></Text>
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
  },
  saleLabel: {
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  saleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 10,
  },
  rate:{
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
    left: '30%'
  },
  heart:{
    position: 'absolute',
    bottom: 0,
    right:0,
    width:15,
    height:15,
  },
  icon:{
    width:12,
    height:12,
  },
});

export default SaleItem;
