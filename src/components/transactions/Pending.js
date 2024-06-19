import { BASE_URI } from "@env";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./styles/transaction.styles";

const CONFIRM_URI = `${BASE_URI}/api/transaction/confirm/`;
const DECLINE_URI = `${BASE_URI}/api/transaction/decline/`;
const noImage = require("../../assets/no-image-card.png");

const Pending = ({ transactions, handleGetAllTransactions, screen }) => {
  const [transaction, setTransaction] = useState(transactions);
  const pendingTransactions = transactions
    ? transactions.filter((transaction) => transaction.status === "PENDING")
    : [];

  useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  const handleConfirmTransaction = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${CONFIRM_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("47: This is the data.redirect_url", data.data.redirect_url);
      console.log(data.data);
      if (data.success) {
        const updatedTransactions = transactions.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        const transactionData = {
          id: data.data.id,
          token: data.data.token,
          redirect_url: data.data.redirect_url,
          updatedAt: data.data.updatedAt,
        };

        await AsyncStorage.setItem(
          `transaction-${data.data.id}`,
          JSON.stringify(transactionData)
        );
        Alert.alert("Success", "Konfirmasi Pesanan Berhasil", [
          { text: "OK", onPress: () => console.log("Ok") },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Konfirmasi Pesanan", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      }
    } catch (error) {
      console.error("Failed to confirm transaction", error);
    }
  };

  const handleDeclineTransaction = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${DECLINE_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTransactions = transactions.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        Alert.alert("Success", "Berhasil Menolak Pesanan", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Menolak Pesanan", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Gagal Menolak Pesanan", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      {item.cart_details.map((cartDetail) => (
        <React.Fragment key={cartDetail.id}>
          {cartDetail.product ? (
            <>
              <Image
                style={styles.image}
                source={
                  cartDetail.product.image_product
                    ? { uri: cartDetail.product.image_product }
                    : noImage
                }
              />
              <View style={styles.infoContainer}>
                <Text style={styles.productName}>
                  {cartDetail.product.name_product}
                </Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                <Text style={styles.price}>
                  Price: {cartDetail.unit_price * cartDetail.qty}
                </Text>
                <Text style={styles.qty}>Quantity: {cartDetail.qty}</Text>
                {screen === "SellerTransactionScreen" && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.confirmButton}
                      title="Confirm"
                      onPress={() => {
                        handleConfirmTransaction(item.id);
                      }}
                    >
                      <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.declineButton}
                      title="Decline"
                      onPress={() => handleDeclineTransaction(item.id)}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text>No Product Details Available</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {pendingTransactions.length > 0 ? (
        <FlatList
          data={pendingTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>Belum ada transaksi yang dilakukan</Text>
        </View>
      )}
    </View>
  );
};

export default Pending;
