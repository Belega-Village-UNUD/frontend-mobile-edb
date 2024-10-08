import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/transaction.styles";

const noImage = require("../../assets/no-image-card.png");

const Paid = ({ transactions, screen }) => {
  const payedTransactions = transactions
    ? transactions.filter((transaction) => transaction.status === "SUCCESS")
    : [];

  const navigation = useNavigation();

  const navigateToOrderDetailsScreen = (orderId) => {
    navigation.navigate("OrderDetail", { orderId });
  };

  const navigateToTransactionDetailsScreen = (transactionId) => {
    navigation.navigate("TransactionDetail", { transactionId });
  };

  const renderItem = ({ item }) => {
    // Check if there are any cart details with a product
    if (
      item.cart_details.filter((cartDetail) => cartDetail.product).length > 0
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (screen === "SellerTransactionScreen") {
              navigateToTransactionDetailsScreen(item.id);
            } else {
              navigateToOrderDetailsScreen(item.id);
            }
          }}
        >
          <View
            style={[
              styles.itemContainer,
              item.cart_details.length > 1 && styles.itemContainerColumn,
            ]}
          >
            {item.cart_details.map((cartDetail) => (
              <React.Fragment key={cartDetail.id}>
                {cartDetail.product && (
                  <>
                    <Image
                      style={styles.image}
                      source={
                        cartDetail.product.images &&
                        cartDetail.product.images.length > 0
                          ? { uri: cartDetail.product.images[0] }
                          : noImage
                      }
                    />
                    <View style={styles.infoContainer}>
                      <Text style={styles.productName}>
                        {cartDetail.product.name_product}
                      </Text>
                      <Text style={styles.status}>Status: {item.status}</Text>
                      <Text style={styles.price}>
                        Price: {item.total_amount}
                      </Text>
                      <Text style={styles.qty}>Quantity: {cartDetail.qty}</Text>
                    </View>
                  </>
                )}
              </React.Fragment>
            ))}
          </View>
        </TouchableOpacity>
      );
    } else {
      // Optionally, return null or a placeholder if there are no products
      return null;
    }
  };

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

export default Paid;
