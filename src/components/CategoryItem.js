import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CategoryItem = ({ image, name}) => {
  return (
    <View>
        <View style={styles.categoryItem}>
            <Image source={image} style={styles.categoryImage} />
        </View>
      <Text style={styles.categoryName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    categoryItem: {
        position:'relative',
        backgroundColor: '#e4f3ea',
        borderRadius: 10,
        marginRight: 30,
        alignItems: 'center',
        width: 48,  
        height: 48, 
      },
      categoryImage: {
        position:'absolute',
        width: 30,  
        height: 30, 
        marginTop: 9,
      },
      categoryName:{
        width: 48,
        marginTop: 8,
        textAlign: 'center'
        
      },
});

export default CategoryItem;
