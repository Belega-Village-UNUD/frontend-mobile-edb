import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import noImage from "../assets/no-image-card.png";

const StoreInfoCard = ({
  storeDetails,
  onPress,
  style,
  averageRating,
  reviewCount,
}) => {
  const avatarSource = storeDetails.avatar_link
    ? { uri: storeDetails.avatar_link }
    : noImage;

  // Round up the average rating to one decimal place
  const roundedAverageRating = Math.ceil(averageRating * 10) / 10;

  const CardContent = (
    <View style={[styles.cardContainer, style]}>
      <Image source={avatarSource} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.storeName}>{storeDetails.name}</Text>
        <Text style={styles.storeAddress}>
          {storeDetails.address}, {storeDetails.city.city_name},{" "}
          {storeDetails.province.province}
        </Text>
        {averageRating !== null && averageRating !== undefined && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="gold" />
            <Text style={styles.ratingText}>
              {roundedAverageRating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>({reviewCount} Ulasan)</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{CardContent}</TouchableOpacity>;
  }

  return CardContent;
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    margin: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  storeAddress: {
    fontSize: 14,
    color: COLORS.gray,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.gray,
  },
  reviewCount: {
    marginLeft: 5,
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default StoreInfoCard;
