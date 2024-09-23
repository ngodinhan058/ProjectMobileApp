import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductItem = ({ image, name, price, rating, review }) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price} ₫</Text>
      <View style={styles.rate}>
        <Text style={styles.rating}>
            <Image source={require('../../assets/star.png')} style={styles.icon}/> {rating}</Text>
        <Text style={styles.review}>{review} Review</Text>
        <Text style={styles.heart}><Image source={require('../../assets/heart.png')}/></Text>
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
   
  },
  rate:{
    position: 'relative',
    width: 131,
    height: 15,
  },
  image: {
    width: 125,
    height: 125,
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    color: 'red',
    fontSize: 14,
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

export default ProductItem;
