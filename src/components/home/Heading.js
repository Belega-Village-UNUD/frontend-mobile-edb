import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../constants/theme";
import styles from "./heading.style";
import { useNavigation } from "@react-navigation/native";

const Heading = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Product</Text>
        <TouchableOpacity
          style={{ marginEnd: 12 }}
          onPress={() => navigation.navigate("ProductList")}
        >
          <Ionicons name="ios-grid" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Heading;
