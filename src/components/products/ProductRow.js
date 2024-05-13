import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../../constants/theme";
import ProductCardView from "./ProductCardView";
import { BASE_URI } from "@env";
import styles from "./productRow.style";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ALL_PRODUCT_URI = BASE_URI + "/api/product/guest/all";

const ProductRow = () => {
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

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size={SIZES.large} color={COLORS.primary} />
      ) : error ? (
        <>
          <Text>
            Gagal menampilkan produk, silahkan periksa koneksi anda!{" "}
            <TouchableOpacity onPress={handleGetAllProducts}>
              <Text style={styles.refreshLink}>Segarkan</Text>
            </TouchableOpacity>
          </Text>
        </>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ProductCardView
              item={item}
              onSelect={(id) => navigation.navigate("ProductDetails", { id })}
            />
          )}
          horizontal
          contentContainerStyle={{ columnGap: SIZES.medium }}
        />
      )}
    </View>
  );
};

export default ProductRow;
