import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import styles from "./productCardView.style";

const ProductCardView = ({ item, onSelect }) => {
  const noImage = require("../../assets/no-image-card.png");
  return (
    <TouchableOpacity onPress={() => onSelect(item.id)}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {/* <Image
            source={{ uri: item.image_product || noImage }}
            style={styles.image}
          /> */}
          <Image
            source={item.image_product ? { uri: item.image_product } : noImage}
            style={styles.image}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name_product}
          </Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.store_id}
          </Text>
          <Text style={styles.price} numberOfLines={1}>
            Rp. {item.price}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={35} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardView;
