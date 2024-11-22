import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BASE_URI } from "@env";
import styles from "./styles/storeProducts.style";
import ProductCardView from "../components/products/ProductCardView";
import StoreInfoCard from "../components/StoreInfoCard"; // Import the new component
import { COLORS } from "../constants/theme";
import _ from "lodash";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import noImage from "../assets/no-image-card.png";

const STORE_PRODUCTS_URI = `${BASE_URI}/api/product/guest/all`;
const STORE_INFO_URI = `${BASE_URI}/api/store/guest/info`;
const STORE_RATINGS_URI = `${BASE_URI}/api/rating/store?store_id=`;

const StoreProductsScreen = ({ route }) => {
  const { storeId, storeName } = route.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [data, setData] = useState([]);
  const [storeDetails, setStoreDetails] = useState(null);
  const [averageRating, setAverageRating] = useState(null); // Add state for average rating
  const [reviewCount, setReviewCount] = useState(0); // Add state for review count
  const [reviews, setReviews] = useState([]); // Add state for reviews
  const [selectedRatingFilter, setSelectedRatingFilter] = useState(null); // Add state for selected rating filter
  const navigation = useNavigation();

  const handleGetStoreProducts = async () => {
    try {
      const response = await fetch(`${STORE_PRODUCTS_URI}?store_id=${storeId}`);
      const data = await response.json();
      setData(data.data);
      setSearchResults(data.data); // Initialize searchResults with all products
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetStoreDetails = async () => {
    try {
      const response = await fetch(`${STORE_INFO_URI}?store_id=${storeId}`);
      const data = await response.json();
      setStoreDetails(data.data.store);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetStoreRatings = async () => {
    try {
      const response = await fetch(`${STORE_RATINGS_URI}${storeId}`);
      const data = await response.json();
      setAverageRating(data.data.average_rate_store || 0); // Set the average rating
      setReviewCount(data.data.total_reviewers || 0); // Set the review count
      setReviews(data.data.data || []); // Set the reviews
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetStoreProducts();
    handleGetStoreDetails();
    handleGetStoreRatings(); // Fetch store ratings
  }, [storeId]);

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      let filteredProducts = data;

      if (query.trim()) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name_product &&
            product.name_product.toLowerCase().includes(query.toLowerCase())
        );
      }

      setSearchResults(filteredProducts);
    }, 300),
    [data]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleRatingFilterChange = (rating) => {
    setSelectedRatingFilter(rating);
  };

  const filteredReviews = selectedRatingFilter
    ? reviews.filter((review) => review.rate === selectedRatingFilter)
    : reviews;

  const renderProduct = ({ item }) => (
    <ProductCardView
      style={styles.productCardContainer}
      item={item}
      onSelect={() => navigation.navigate("ProductDetails", { id: item.id })}
    />
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: item.user.userProfile.avatar_link }}
          style={styles.avatar}
        />
        <Text style={styles.reviewerName}>{item.user.userProfile.name}</Text>
      </View>
      <Text style={styles.reviewText}>{item.review}</Text>
      <View style={styles.ratingReview}>
        {[...Array(5)].map((_, index) => (
          <Ionicons
            key={index}
            name="star"
            size={20}
            color={index < item.rate ? "gold" : "grey"}
          />
        ))}
      </View>
      <View style={styles.productReview}>
        <Image
          source={
            item.product &&
            item.product.images &&
            item.product.images.length > 0
              ? { uri: item.product.images[0] }
              : noImage
          }
          style={styles.productImage}
        />
        <Text style={styles.productName}>
          {item.product ? item.product.name_product : "N/A"}
        </Text>
      </View>
    </View>
  );

  const ProductsRoute = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => debouncedSearch(searchQuery)}>
          <Feather name="search" size={24} style={styles.searchIcon} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Search products..."
            returnKeyType="search"
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => debouncedSearch(searchQuery)}
          >
            <Feather name="arrow-right-circle" size={24} color={COLORS.gray3} />
          </TouchableOpacity>
        </View>
      </View>
      {searchResults.length === 0 ? (
        <Text style={styles.noDataText}>
          Tidak ada produk yang dapat ditampilkan
        </Text>
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={searchResults}
          numColumns={2}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 180 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );

  const ReviewsRoute = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.filterContainer}>
        {[5, 4, 3, 2, 1].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.filterButton,
              selectedRatingFilter === rating && styles.selectedFilterButton,
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
              selectedRatingFilter === null && styles.selectedFilterButtonText,
            ]}
          >
            Semua
          </Text>
        </TouchableOpacity>
      </View>
      {filteredReviews.length === 0 ? (
        <Text style={styles.noDataText}>
          Tidak ada ulasan yang dapat ditampilkan
        </Text>
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={filteredReviews}
          renderItem={renderReview}
          contentContainerStyle={{ paddingBottom: 180 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );

  const initialLayout = { width: Dimensions.get("window").width };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "products", title: "Produk" },
    { key: "reviews", title: "Ulasan" },
  ]);

  const renderScene = SceneMap({
    products: ProductsRoute,
    reviews: ReviewsRoute,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {storeDetails && (
        <StoreInfoCard
          storeDetails={storeDetails}
          averageRating={averageRating}
          reviewCount={reviewCount}
        />
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: COLORS.primary }}
            style={{ backgroundColor: COLORS.lightGray }}
            labelStyle={{ color: COLORS.primary }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default StoreProductsScreen;
