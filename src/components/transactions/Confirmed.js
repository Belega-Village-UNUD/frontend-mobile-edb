import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import styles from "./styles/transaction.styles";

const noImage = require("../../assets/no-image-card.png");

const Confirmed = ({ transactions }) => {
  const confirmedTransactions = transactions
    ? transactions.filter((transaction) => transaction.status === "PAYABLE")
    : [];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        style={styles.image}
        source={
          item.cart.product.image_product
            ? { uri: item.cart.product.image_product }
            : noImage
        }
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.cart.product.name_product}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.price}>
          Price: {item.cart.unit_price * item.cart.qty}
        </Text>
        <Text style={styles.qty}>Quantity: {item.cart.qty}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {confirmedTransactions.length > 0 ? (
        <FlatList
          data={confirmedTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Belum ada transaksi yang dikonfirmasi oleh anda
          </Text>
        </View>
      )}
    </View>
  );
};

export default Confirmed;
