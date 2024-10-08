import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import styles from "./styles/search.style";
import { COLORS } from "../constants/theme";
import ProductCardView from "../components/products/ProductCardView";
import { BASE_URI } from "@env";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash"; // Import lodash

const ALL_PRODUCT_URI = BASE_URI + "/api/product/guest/all";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [data, setData] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigation = useNavigation();

  const handleGetAllProducts = async () => {
    try {
      const response = await fetch(ALL_PRODUCT_URI);
      const data = await response.json();
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  // Debounce the search function to improve performance
  const debouncedSearch = useCallback(
    _.debounce((query, minPrice, maxPrice) => {
      let filteredProducts = data;

      if (query.trim()) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name_product.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= parseFloat(minPrice)
        );
      }

      if (maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseFloat(maxPrice)
        );
      }

      setSearchResults(filteredProducts);
    }, 300),
    [data]
  );

  useEffect(() => {
    debouncedSearch(searchQuery, minPrice, maxPrice);
  }, [searchQuery, minPrice, maxPrice, debouncedSearch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => debouncedSearch(searchQuery, minPrice, maxPrice)}
        >
          <Feather name="search" size={24} style={styles.searchIcon} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            onChangeText={setSearchQuery}
            value={searchQuery}
            placeholder="Apa yang sedang kamu cari?"
            returnKeyType="search"
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => debouncedSearch(searchQuery, minPrice, maxPrice)}
          >
            <Feather name="arrow-right-circle" size={24} color={COLORS.gray3} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.priceInput}
          onChangeText={setMinPrice}
          value={minPrice}
          placeholder="Min Price"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.priceInput}
          onChangeText={setMaxPrice}
          value={maxPrice}
          placeholder="Max Price"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.container}>
        <FlatList
          style={{ width: "100%" }}
          data={searchResults}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCardView
              item={item}
              onSelect={(id) => navigation.navigate("ProductDetails", { id })}
            />
          )}
          contentContainerStyle={[styles.container, { paddingBottom: 180 }]} // Adjust the padding as needed
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}
