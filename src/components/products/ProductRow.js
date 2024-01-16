import React from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";
import ProductCardView from "./ProductCardView";
import { isLoading } from "expo-font";

const ProductRow = () => {
  const products = [1, 2, 3, 4, 5, 6];
  return (
    <View style={{ marginTop: SIZES.xSmall / 2, marginLeft: 18 }}>
      {isLoading ? (
        <ActivityIndicator size={SIZES.large} color={COLORS.primary} />
      ) : error ? (
        <Text>Gagal menampilkan produk, silahkan periksa koneksi anda!</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductCardView />}
          horizontal
          contentContainerStyle={{ columnGap: SIZES.medium }}
        />
      )}
    </View>
  );
};

export default ProductRow;
