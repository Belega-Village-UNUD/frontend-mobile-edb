import { Ionicons, SimpleLineIcons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert, Linking } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../constants/theme";
import styles from "./styles/productDetails.style";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URI } from "@env";

const GUEST_DETAIL_PRODUCT_URI = BASE_URI + "/api/product/guest/";
const PRODUCT_CHECKOUT_URI = BASE_URI + "/api/cart/product/checkout";
const CHAT_SELLER_URI = BASE_URI + "/api/message/product";
const ADD_CART_URI = BASE_URI + "/api/cart";

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
      const response = await fetch(`${GUEST_DETAIL_PRODUCT_URI}${id}`);
      const data = await response.json();
      console.log(data.data);
      setProduct(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

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
        const response = await fetch(`${PRODUCT_CHECKOUT_URI}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            product_id: id,
            qty: count,
          }),
        });
        if (!response.ok) {
          console.log(response);
        } else {
          Alert.alert("Success", "Checkout Berhasil.");
        }
      } catch (error) {
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
        const response = await fetch(`${ADD_CART_URI}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify([
            {
              product_id: id,
              qty: count,
            },
          ]),
        });

        if (!response.ok) {
          Alert.alert("Error", "Gagal Menambahkan Produk ke Keranjang.");
        }

        Alert.alert("Success", "Berhasil Menambahkan Produk ke Keranjang.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Cart"),
          },
        ]);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Something went wrong, please try again later.");
      }
    }
  };

  const handleChatPress = async () => {
    const userToken = await AsyncStorage.getItem("token");
    const productId = id;
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
        const response = await fetch(`${CHAT_SELLER_URI}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ product_id: productId }),
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          const canOpen = await Linking.canOpenURL(data.data);
          if (canOpen) {
            Linking.openURL(data.data);
          } else {
            Alert.alert("Error", "Failed to open chat.");
          }
        } else {
          throw new Error("Failed to open chat.");
        }
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
        <ScrollView
          style={styles.storeNameContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Text style={styles.storeName}>{product?.store.name}</Text>
        </ScrollView>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>Description</Text>
          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.descriptionText}>{product?.desc_product}</Text>
          </ScrollView>
        </View>
        <View style={styles.cartRow}>
          {/* <TouchableOpacity onPress={handleBuyPress} style={styles.cartBtn}>
            <Text style={styles.cartTitle}>Buy Now</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={product?.stock === 0 ? null : handleBuyPress}
            style={product?.stock === 0 ? styles.soldOutBtn : styles.cartBtn}
          >
            <Text style={styles.cartTitle}>
              {product?.stock === 0 ? "Sold Out" : "Buy Now"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCartPress} style={styles.addCart}>
            <Fontisto name="shopping-bag" size={24} color={COLORS.lightWhite} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChatPress} style={styles.sellerChat}>
            <Fontisto name="whatsapp" size={24} color={COLORS.lightWhite} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;
