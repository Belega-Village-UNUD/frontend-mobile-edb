import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import styles from "./productCardView.style";

const ProductCardView = ({ item, onSelect, style }) => {
  const noImage = require("../../assets/no-image-card.png");

  // Check if the store name is available
  if (!item.store || !item.store.name) {
    return null; // Do not render the product card if the store name is not available
  }

  return (
    <TouchableOpacity
      onPress={() => onSelect(item.id)}
      style={[styles.container, style]}
    >
      <View style={styles.imageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        ) : (
          <Image source={noImage} style={styles.image} />
        )}
      </View>
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name_product}
        </Text>
        <Text style={styles.storeName} numberOfLines={1}>
          {item.store.name}
        </Text>
        <Text style={styles.price} numberOfLines={1}>
          Rp. {item.price}
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add-circle" size={35} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ProductCardView;
