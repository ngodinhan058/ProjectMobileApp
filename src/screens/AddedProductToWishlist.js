import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from './api/config';

const { width } = Dimensions.get('window');
function AddedProductToWishlist({ route, navigation }) {
  const [loading, setLoading] = useState(true); // Track the loading state
  const [productRelate, setProductRelate] = useState([]); // Dữ liệu sản phẩm
  const [productsState, setProductsState] = useState([]); // Dữ liệu sản phẩm
  const { id } = route.params;

  useEffect(() => {
    let apiUrl = `${BASE_URL}products/${id}`;
    axios.get(apiUrl)
      .then(response => {
        const productData = response.data.data; // Get the entire data object
        // Set product relate state with productData
        setProductRelate(productData); // Set the entire product data
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]); // Make sure to include `id` in the dependency array

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log("hinh", productRelate);

  const onScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  // useEffect(() => {
  //   let apiUrl = `${BASE_URL}products/filters?`;
  //   const queryParams = [];
  //   apiUrl += queryParams.join('&');
  //   console.log(apiUrl)
  //   axios.get(apiUrl)
  //     .then(response => {
  //       const { content } = response.data.data;
  //       setProductsState(content);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //       setLoading(false);
  //     });
  // }, []);
  const scrollViewRef = useRef();
  const flatListRef = useRef(null);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  //   }, [])
  // );
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.productDetailContainer}>
        <View style={styles.iconHeader}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="angle-left" size={35} color="#000" />
          </Pressable>
          <Text style={styles.textHeader}>Chi Tiết Sản Phẩm</Text>
          <Pressable style={styles.shareButton} onPress={() => navigation.goBack()}>
            <Icon name="share" size={25} color="#000" />
          </Pressable>
        </View>

        {/* Product Image */}
        <View style={styles.productImgContainer}>
        {/* <Image
                source={{ uri: productRelate.productImages[0]['productImagePath'] }} // Use URI for each image path
                style={styles.productImg}
              /> */}
          <FlatList
            data={productRelate.productImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.productImageIndex}
            renderItem={({ item }) => {
              <View>
                {/* <Image
                  source={{ uri: productRelate.productImages[0]['productImagePath']}} // Use URI for each image path
                  style={styles.productImg}
                /> */}
                <Text>{item['productImagePath']}</Text>
              </View>
            }}
            onMomentumScrollEnd={onScrollEnd}
          />
          {/* <Text style={styles.numberOfImage}>
            {currentImageIndex + 1}/{Array.isArray(productRelate.productImages.length)} Ảnh
          </Text> */}
        </View>
        {/* Product info */}
        <View style={styles.productInfo}>
          <View>
            <Text style={styles.productName}>{productRelate.productName}</Text>
          </View>

          <View>
            {productRelate.productSale == 0 ? (


              <Text style={styles.productPrice}>
                {productRelate.productPrice}
              </Text>
            ) : (
              <View>
                <Text style={styles.productPrice}>
                  {productRelate.productPrice}
                </Text>
                <Text style={styles.originalPrice}>
                  {productRelate.productPriceSale}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.SoldProductInfo}>
            <View style={styles.productStar}>
              <Image source={require('../assets/star.png')} />
              <Text> {productRelate.productRating}</Text>
              {/* <Text>{review} reviewes</Text> */}
            </View>
            <View>
              {/* <Text style={styles.totalSellProduct}>Sole : 250</Text> */}
            </View>
          </View>
        </View>

        {/* Description Product */}
        <View>
          <Text style={styles.descriptionProductTitle}>
            Description Product
          </Text>
          <Text style={styles.descriptionProductText}>
            The speaker unit contains a diaphragm that is precision-grown from
            NAC Audio bio-cellulose, making it stiffer, lighter and stronger
            than regular PET speaker units, and allowing the sound-producing
            diaphragm to vibrate without the levels of distortion found in other
            speakers.
          </Text>

          <Text style={styles.descriptionProductText}>
            The speaker unit contains a diaphragm that is precision-grown from
            NAC Audio bio-cellulose, making it stiffer, lighter and stronger
            than regular PET speaker units, and allowing the sound-producing
            diaphragm to vibrate without the levels of distortion found in other
            speakers.
          </Text>
        </View>

        {/* Review Product */}
        <View style={styles.reviewProductContainer}>
          <View style={styles.reviewProductHeader}>
            <View>
              <Text style={styles.reviewProductTitle}>Review</Text>
              {/* <Text style={styles.reviewProductTitle}>({review})</Text> */}
            </View>
            <View style={styles.productStar}>
              <Image source={require('../assets/star.png')} />
              <Text>{productRelate.productRating}</Text>
            </View>
          </View>

          <View style={{}}>
            <View style={styles.sectionReviewerContainer}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.reviewerImage}
                  source={require('../assets/new3.png')}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text>Yelena Belova</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                    </View>
                  </View>
                  <View>
                    <Text>2 Minggu yang lalu</Text>
                  </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionReviewerContainer}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.reviewerImage}
                  source={require('../assets/new3.png')}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text>Yelena Belova</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                    </View>
                  </View>
                  <View>
                    <Text>2 Minggu yang lalu</Text>
                  </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionReviewerContainer}>
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.reviewerImage}
                  source={require('../assets/new3.png')}
                />
              </View>
              <View style={{ flex: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <Text>Yelena Belova</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                      <Image source={require('../assets/star.png')} />
                    </View>
                  </View>
                  <View>
                    <Text>2 Minggu yang lalu</Text>
                  </View>
                </View>
                <View style={{ paddingTop: 10 }}>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ margin: 10 }}>
          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 15,
              marginVertical: 20,
              borderRadius: 10,
            }} onPress={() => navigation.navigate('ReviewProductScreen')}
          >
            <Text style={{ textAlign: 'center', fontWeight: '600' }}>
              See All Review
            </Text>
          </TouchableOpacity>
        </View>


      </View>
      <View style={styles.greySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.textBold}>Sản Phẩm Đề Xuất</Text>
          <Text style={styles.seeAll}>Xem Tất Cả</Text>
        </View>
        <FlatList
          horizontal
          ref={scrollViewRef}
          data={productRelate}
          renderItem={({ item }) => {
            // Kiểm tra xem mảng productImages có tồn tại và có ít nhất 1 phần tử

            const imageUrl = Array.isArray(item.productImages) && item.productImages.length > 0
              ? (item.productImages.find(img => img.productImageIndex === 1)?.productImagePath || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png')
              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/langvi-300px-No_image_available.svg.png';



            return (
              <ProductItem
                id={item['productId']}
                name={item['productName']}
                price={item['productPriceSale']}
                oldPrice={item['productPrice']}
                image={imageUrl}  // Truyền URL của ảnh đầu tiên vào prop images
                rating={item['productRating']}
                sale={item['productSale']}
                isLoading={false}  // Set isLoading to false when not loading
              />
            );
          }}
          keyExtractor={(item) => item['productId'].toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.productList}
        />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#fff',
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 20,
                borderRadius: 10,
                backgroundColor: '#FE3A30',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#FFF',
                  }}
                >
                  Đã thêm yêu thích
                </Text>
                <Image
                  style={{ width: 20, height: 20, tintColor: '#fff' }}
                  source={require('../assets/heart.png')}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: '#3669C9',
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#fff',
                }}
              >
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>



  );
}

const styles = StyleSheet.create({
  productDetailContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  greySection: {
    flex: 1,
    padding: 20,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 10,
  },
  textHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 10,
  },
  shareButton: {
    marginLeft: 10,
  },

  productImgContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 300,
    position: 'relative',
  },
  productImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },

  numberOfImage: {
    position: 'absolute',
    left: '10%',
    bottom: '10%',

    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  productInfo: {
    flexDirection: 'column',
    marginTop: 10,
    marginBottom: 10,
  },

  productName: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '700',
  },

  productPrice: {
    color: '#FE3A30',
    fontWeight: '500',
    fontSize: 20,
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 10,
  },
  currencyHighlight: {
    fontWeight: 'bold',
  },

  SoldProductInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  productStar: {
    flexDirection: 'row',
    gap: 5,
  },

  totalSellProduct: {
    color: '#3A9B7A',
  },

  descriptionProductTitle: {
    fontWeight: '800',
    fontSize: 16,
    paddingTop: 10,
  },
  descriptionProductText: {
    lineHeight: 24,
    paddingBottom: 10,
    paddingBottom: 10,
  },

  reviewProductContainer: {
    flexDirection: 'column',
  },

  reviewProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewProductTitle: {
    fontWeight: '800',
    fontSize: 16,
  },

  sectionReviewerContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  seeAll: {
    color: '#3669c9',
    marginBottom: 10,
    fontSize: 17,
  },
  productList: {
    marginBottom: 20,
  },
  reviewerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
export default AddedProductToWishlist;
