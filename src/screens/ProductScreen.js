import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import styles from "./styles/product.style";
import ProductList from "../components/products/ProductList";

const ProductScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.upperRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.heading}>Produk</Text>
        </View>
        <ProductList />
      </View>
    </SafeAreaView>
  );
};

export default ProductScreen;
