import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./productList.style";
import { BASE_URI } from "@env";
import { SIZES, COLORS } from "../../constants/theme";
import ProductCardView from "./ProductCardView";
import { useNavigation } from "@react-navigation/native";

const ALL_PRODUCT_URI = BASE_URI + "/api/product/guest/all";

const ProductList = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleGetAllProducts = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.get(ALL_PRODUCT_URI);
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={SIZES.xxLarge} color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCardView
            item={item}
            onSelect={(id) => navigation.navigate("ProductDetails", { id })}
          />
        )}
        contentContainerStyle={styles.container}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ProductList;
