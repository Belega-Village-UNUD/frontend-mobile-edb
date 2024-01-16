import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Carousel, Cart, Welcome } from "../components";
import Heading from "../components/home/Heading";
import ProductRow from "../components/products/ProductRow";
import styles from "./styles/home.style";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.appBarWrapper}>
          <View style={styles.appBar}>
            <Cart />
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
