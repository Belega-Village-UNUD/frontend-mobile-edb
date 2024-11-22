import { Ionicons, SimpleLineIcons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Alert,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../constants/theme";
import styles from "./styles/productDetails.style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";
import { BASE_URI } from "@env";
import StoreInfoCard from "../components/StoreInfoCard";

const GUEST_DETAIL_PRODUCT_URI = BASE_URI + "/api/product/guest/";
const PRODUCT_CHECKOUT_URI = BASE_URI + "/api/cart/product/checkout";
const CHAT_SELLER_URI = BASE_URI + "/api/message/product";
const ADD_CART_URI = BASE_URI + "/api/cart";
const PRODUCT_RATING_URI = BASE_URI + "/api/rating?product_id=";
const STORE_RATINGS_URI = BASE_URI + "/api/rating/store?store_id=";

const ProductDetailsScreen = ({ navigation, route }) => {
  const [count, setCount] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionUrl, setTransactionUrl] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showFullName, setShowFullName] = useState(false);
  const [userId, setUserId] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null);
  const [storeAverageRating, setStoreAverageRating] = useState(null); // Add state for store average rating
  const [storeReviewCount, setStoreReviewCount] = useState(0); // Add state for store review count

  const { id } = route.params;
  const noImage = [require("../assets/no-image.png")];

  const handlePress = () => {
    setShowFullName(!showFullName);
  };

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

  const handleGetProductRatings = async () => {
    try {
      const response = await fetch(`${PRODUCT_RATING_URI}${id}`);
      const data = await response.json();
      // Sort the ratings by createdAt in descending order
      const sortedRatings = data.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRatings(sortedRatings);
      setAverageRating(data.data.average_rate_per_product);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStoreRatings = async (storeId) => {
    try {
      const response = await fetch(`${STORE_RATINGS_URI}${storeId}`);
      const data = await response.json();
      setStoreAverageRating(data.data.average_rate_store || 0); // Set the store average rating
      setStoreReviewCount(data.data.total_reviewers || 0); // Set the store review count
    } catch (error) {
      console.log(error);
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
        console.log("Adding to cart with count:", count); // Add this line to log the count
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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            product_id: id,
          }),
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

  const handleRatingFilterChange = (rating) => {
    setSelectedRatingFilter(rating);
  };

  useEffect(() => {
    handleGetProductDetails();
    handleGetProductRatings();
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("id");
      setUserId(userId);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (product?.store?.id) {
      handleGetStoreRatings(product.store.id); // Fetch store ratings
    }
  }, [product?.store?.id]);

  const images = product?.images?.length ? product.images : noImage;

  const filteredRatings = selectedRatingFilter
    ? ratings.filter((rating) => rating.rate === selectedRatingFilter)
    : ratings;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
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
          <Tooltip
            isVisible={tooltipVisible}
            content={<Text>{product?.name_product}</Text>}
            placement="bottom"
            onClose={() => setTooltipVisible(false)}
          >
            <TouchableOpacity
              onPress={handlePress}
              onPressIn={() => setTooltipVisible(true)}
              onPressOut={() => setTooltipVisible(false)}
            >
              <Text style={styles.title}>
                {showFullName
                  ? product?.name_product
                  : product?.name_product.split(" ").slice(0, 2).join(" ")}
              </Text>
            </TouchableOpacity>
          </Tooltip>
          {product?.is_preorder && (
            <Text style={{ color: "red", fontWeight: "bold" }}>(preorder)</Text>
          )}
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>Rp. {product?.price}</Text>
          </View>
        </View>
        <View style={styles.ratingRow}>
          <View style={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name="star"
                size={24}
                color={index < averageRating ? "gold" : "gray"}
              />
            ))}
            <Text style={styles.ratingText}>
              {"  "}({averageRating || 0}){"  "}
            </Text>
          </View>
          <View style={styles.count}>
            <TouchableOpacity onPress={() => handleIncrement()}>
              <SimpleLineIcons name="plus" size={20} />
            </TouchableOpacity>
            <Text style={styles.countText}>
              {"   "}
              {count}
              {"   "}
            </Text>
            <TouchableOpacity onPress={() => handleDecrement()}>
              <SimpleLineIcons name="minus" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        {product?.store && (
          <StoreInfoCard
            storeDetails={product.store}
            onPress={() =>
              navigation.navigate("StoreProducts", {
                storeId: product.store.id,
                storeName: product.store.name,
              })
            }
            style={{ marginTop: 25, marginRight: 20 }}
            averageRating={storeAverageRating} // Pass the store average rating
            reviewCount={storeReviewCount} // Pass the store review count
          />
        )}
        <View style={styles.descriptionWrapper}>
          <Text style={styles.description}>Deskripsi</Text>
          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.descriptionText}>{product?.desc_product}</Text>
          </ScrollView>
        </View>
        <TouchableOpacity onPress={() => setShowReviews(!showReviews)}>
          <Text style={styles.accordionTitle}>
            {showReviews ? "Sembunyikan Ulasan" : "Tampilkan Ulasan"}
          </Text>
        </TouchableOpacity>
        {showReviews && (
          <View>
            <View style={styles.filterContainer}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.filterButton,
                    selectedRatingFilter === rating &&
                      styles.selectedFilterButton,
                  ]}
                  onPress={() => handleRatingFilterChange(rating)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedRatingFilter === rating &&
                        styles.selectedFilterButtonText,
                    ]}
                  >
                    {rating} <Ionicons name="star" size={12} color="gold" />
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedRatingFilter === null && styles.selectedFilterButton,
                ]}
                onPress={() => handleRatingFilterChange(null)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedRatingFilter === null &&
                      styles.selectedFilterButtonText,
                  ]}
                >
                  Semua
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reviewsContainer}>
              {filteredRatings.length === 0 ? (
                <Text style={styles.noReview}>
                  Tidak ada review yang dapat ditampilkan
                </Text>
              ) : (
                filteredRatings.map((rating) => (
                  <View key={rating.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Image
                        source={{ uri: rating.user.userProfile.avatar_link }}
                        style={styles.avatar}
                      />
                      <Text style={styles.reviewerName}>
                        {rating.user.userProfile.name}
                      </Text>
                    </View>
                    <Text style={styles.reviewText}>{rating.review}</Text>
                    <View style={styles.ratingReview}>
                      {[...Array(5)].map((_, index) => (
                        <Ionicons
                          key={index}
                          name="star"
                          size={20}
                          color={index < rating.rate ? "gold" : "grey"}
                        />
                      ))}
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
        <View style={styles.cartRow}>
          {/* Conditional rendering based on user ID comparison */}
          {product?.user_id !== userId && (
            <>
              <TouchableOpacity
                onPress={product?.stock === 0 ? null : handleBuyPress}
                style={
                  product?.stock === 0 ? styles.soldOutBtn : styles.cartBtn
                }
              >
                <Text style={styles.cartTitle}>
                  {product?.stock === 0 ? "Stock Habis" : "Beli Sekarang"}
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
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetailsScreen;
