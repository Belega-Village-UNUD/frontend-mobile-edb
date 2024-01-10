import React from "react";
import { FlatList, View } from "react-native";
import { SIZES } from "../../constants/theme";
import ProductCardView from "./ProductCardView";

const ProductRow = () => {
  const products = [1, 2, 3, 4, 5, 6];
  return (
    <View style={{ marginTop: SIZES.xSmall / 2, marginLeft: 18 }}>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCardView />}
        horizontal
        contentContainerStyle={{ columnGap: SIZES.medium }}
      />
    </View>
  );
};

export default ProductRow;
