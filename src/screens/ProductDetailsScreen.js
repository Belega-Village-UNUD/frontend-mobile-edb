import { Ionicons, SimpleLineIcons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../constants/theme";
import styles from "./styles/productDetails.style";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URI } from "@env";
import WebView from "react-native-webview";

const GUEST_DETAIL_PRODUCT_URI = BASE_URI + "/api/products/guest/";
const PAYMENT_URI = BASE_URI + "/api/transaction";
const USER_PROFILE_URI = BASE_URI + "/api/profiles";
const TYPES_URI = BASE_URI + "/api/types/";
const SANDBOX_URI = "https://app.sandbox.midtrans.com/snap/v2/vtweb";

const ProductDetailsScreen = ({ navigation, route }) => {
  const [count, setCount] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionUrl, setTransactionUrl] = useState(null);
  const [profile, setProfile] = useState(null);

  const { id } = route.params;
  const noImage = [require("../assets/no-image.png")];

  const handleGetProductDetails = async () => {
    try {
      const response = await axios.get(`${GUEST_DETAIL_PRODUCT_URI}${id}`);
      setProduct(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // const handleGetProductType = async () => {
  //   try {
  //     const response = await axios.get(`${TYPES_URI}${product.id}`);
  //     const { type_id } = response.data.data;
  //     setProduct((prevProduct) => ({ ...prevProduct, type_id }));
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setError(error.message);
  //     setIsLoading(false);
  //   }
  // };

  // const handleGetProfile = async () => {
  //   const userToken = await AsyncStorage.getItem("token");
  //   const response = await axios.get(USER_PROFILE_URI, {
  //     headers: {
  //       Authorization: `Bearer ${userToken}`,
  //     },
  //   });
  //   const { name, phone, address } = response.data.data.profile;
  //   const { email } = response.data.data.user.email;
  //   setProfile({ name, phone, address, email });
  // };

  const handleBuyPress = async () => {
    const userToken = await AsyncStorage.getItem("token");
    if (!userToken) {
      Alert.alert(
        "Login Terlebih Dahulu",
        "Anda harus login terlebih dahulu untuk melakukan aksi ini.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Auth", { screen: "Login" }),
          },
        ]
      );
    } else {
      try {
        const response = await axios.post(
          `${PAYMENT_URI}`,
          {
            id: product.id + (Math.floor(Math.random() * 1000) + 1),
            productName: product.name_product,
            price: product.price,
            quantity: count,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setTransactionUrl(
          `${SANDBOX_URI}/${response.data.data.midtrans_token}`
        );
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong, please try again later.");
      }
    }
  };

  const handleCartPress = async () => {
    const userToken = await AsyncStorage.getItem("token");
    if (!userToken) {
      Alert.alert(
        "Login Terlebih Dahulu",
        "Anda harus login terlebih dahulu untuk melakukan aksi ini.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Auth", { screen: "Login" }),
          },
        ]
      );
    } else {
      try {
        const response = await axios.post(
          `${BASE_URI}/api/carts`,
          {
            product_id: id,
            quantity: count,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        Alert.alert(
          "Success",
          "Your product has been added to cart, please check your cart.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Cart"),
            },
          ]
        );
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong, please try again later.");
      }
    }
  };

  const handleChatPress = async () => {
    const userToken = await AsyncStorage.getItem("token");
    if (!userToken) {
      Alert.alert(
        "Login Terlebih Dahulu",
        "Anda harus login terlebih dahulu untuk melakukan aksi ini.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Auth", { screen: "Login" }),
          },
        ]
      );
    } else {
      try {
        const response = await axios.post(
          `${BASE_URI}/api/chats`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        Alert.alert(
          "Success",
          "Your product has been added to cart, please check your cart.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Cart"),
            },
          ]
        );
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong, please try again later.");
      }
    }
  };

  const handleIncrement = () => {
    if (count < product.stock) {
      setCount(count + 1);
    } else {
      Alert.alert(
        "Error",
        "Anda tidak dapat memesan lebih dari jumlah stok produk."
      );
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount(count - 1);
    } else {
      Alert.alert("Error", "Anda tidak dapat memesan kurang dari 1 produk.");
    }
  };

  useEffect(() => {
    handleGetProductDetails();
    // handleGetProfile();
  }, []);

  const images = product?.image_product
    ? Array.isArray(product?.image_product)
      ? product?.image_product
      : [product?.image_product]
    : noImage;

  return (
    <View style={styles.container}>
      {transactionUrl ? (
        <WebView source={{ uri: transactionUrl }} />
      ) : (
        <>
          <View style={styles.upperRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back-circle"
                size={30}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="heart" size={30} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <SliderBox
            images={images}
            style={styles.image}
            dotColor={COLORS.primary}
            inactiveDot={COLORS.secondary}
            ImageComponentStyle={{
              borderRadius: 15,
              width: "90%",
              marginTop: 15,
            }}
            autoplay
            circleLoop
            autoplayInterval={3000}
          />
          <View style={styles.details}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product?.name_product}</Text>
              <View style={styles.priceWrapper}>
                <Text style={styles.price}>Rp. {product?.price}</Text>
              </View>
            </View>

            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Ionicons key={index} name="star" size={24} color="gold" />
                ))}
                <Text style={styles.ratingText}>
                  {"  "}(4.5){"  "}
                </Text>
              </View>
              <View style={styles.rating}>
                <TouchableOpacity onPress={() => handleIncrement()}>
                  <SimpleLineIcons name="plus" size={20} />
                </TouchableOpacity>
                <Text style={styles.ratingText}>
                  {"   "}
                  {count}
                  {"   "}
                </Text>
                <TouchableOpacity onPress={() => handleDecrement()}>
                  <SimpleLineIcons name="minus" size={20} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.descriptionWrapper}>
              <Text style={styles.description}>Description</Text>
              <ScrollView
                style={{ maxHeight: 200 }}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.descriptionText}>
                  {product?.desc_product}
                </Text>
              </ScrollView>
            </View>
            <View style={styles.cartRow}>
              {/* <TouchableOpacity onPress={handleBuyPress} style={styles.cartBtn}>
            <Text style={styles.cartTitle}>Buy Now</Text>
          </TouchableOpacity> */}
              <TouchableOpacity
                onPress={product?.stock === 0 ? null : handleBuyPress}
                style={
                  product?.stock === 0 ? styles.soldOutBtn : styles.cartBtn
                }
              >
                <Text style={styles.cartTitle}>
                  {product?.stock === 0 ? "Sold Out" : "Buy Now"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCartPress}
                style={styles.addCart}
              >
                <Fontisto
                  name="shopping-bag"
                  size={24}
                  color={COLORS.lightWhite}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChatPress}
                style={styles.sellerChat}
              >
                <Fontisto name="whatsapp" size={24} color={COLORS.lightWhite} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default ProductDetailsScreen;
