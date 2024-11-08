import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/transaction.styles";

const noImage = require("../../assets/no-image-card.png");

const Paid = ({ transactions, handleGetAllTransactions, screen }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [payedTransactions, setPayedTransactions] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const filteredTransactions = transactions
      ? transactions.filter((transaction) => transaction.status === "SUCCESS")
      : [];
    setPayedTransactions(filteredTransactions);
  }, [transactions]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleGetAllTransactions().then(() => setRefreshing(false));
  }, []);

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
      const isMultipleProducts = item.cart_details.length > 1;

      return (
        <TouchableOpacity
          onPress={() => {
            if (screen === "SellerTransactionScreen") {
              navigateToTransactionDetailsScreen(item.id);
            } else {
              navigateToOrderDetailsScreen(item.id);
            }
          }}
          delayPressIn={5000}
        >
          <View
            style={[
              styles.itemContainer,
              isMultipleProducts && styles.itemContainerColumn,
            ]}
          >
            {item.cart_details.map((cartDetail) => (
              <View key={cartDetail.id} style={styles.productContainer}>
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
                      <Text style={styles.shippingStatus}>
                        Shipping Status:{" "}
                        {cartDetail.arrival_shipping_status === "UNCONFIRMED"
                          ? "Belum Dikirim"
                          : cartDetail.arrival_shipping_status === "PACKING"
                          ? "Disiapkan"
                          : cartDetail.arrival_shipping_status === "SHIPPED"
                          ? "Dikirim"
                          : cartDetail.arrival_shipping_status === "ARRIVED"
                          ? "Sampai"
                          : "Belum Dikirim"}
                      </Text>
                      <Text style={styles.qty}>Quantity: {cartDetail.qty}</Text>
                    </View>
                  </>
                )}
              </View>
            ))}
            <Text style={[styles.price, styles.centerText]}>
              Total Price: {item.total_amount}
            </Text>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
