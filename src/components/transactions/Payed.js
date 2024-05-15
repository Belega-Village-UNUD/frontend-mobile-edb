import React from "react";
import { View, Text, Image, FlatList } from "react-native";
import styles from "./styles/transaction.styles";

const Payed = ({ transactions }) => {
  const payedTransactions = transactions.filter(
    (transaction) => transaction.status === "SUCCESS"
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        style={styles.image}
        source={{
          uri: item.cart.product.image_product || "../../assets/no-image.png",
        }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.cart.product.name_product}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.price}>Price: {item.cart.unit_price}</Text>
        <Text style={styles.qty}>Quantity: {item.cart.qty}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {payedTransactions.length > 0 ? (
        <FlatList
          data={payedTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Belum ada transaksi yang berhasil</Text>
        </View>
      )}
    </View>
  );
};

export default Payed;
