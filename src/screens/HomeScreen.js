import React, { useContext, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Carousel, Cart, Welcome } from "../components";
import { CartContext } from "../provider/CartProvider";
import Heading from "../components/home/Heading";
import ProductRow from "../components/products/ProductRow";
import styles from "./styles/home.style";

export default function HomeScreen() {
  const { cartData } = useContext(CartContext);
  const totalQty = cartData
    ? cartData.reduce(
        (total, store) =>
          total +
          store.carts.reduce((totalQty, item) => totalQty + item.qty, 0),
        0
      )
    : 0;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.appBarWrapper}>
          <View style={styles.appBar}>
            <Cart itemCount={totalQty} />
          </View>
        </View>
      </View>
      <ScrollView>
        <Welcome />
        <Carousel />
        <Heading />
        <ProductRow />
      </ScrollView>
    </SafeAreaView>
  );
}
