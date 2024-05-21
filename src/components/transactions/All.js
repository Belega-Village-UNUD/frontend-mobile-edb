import { BASE_URI } from "@env";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import styles from "./styles/transaction.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CONFIRM_URI = `${BASE_URI}/api/transaction/confirm/`;
const DECLINE_URI = `${BASE_URI}/api/transaction/decline/`;
const noImage = require("../../assets/no-image-card.png");

const All = ({ transactions, handleGetAllTransactions }) => {
  const [transaction, setTransaction] = useState(transactions);

  useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  const handleConfirm = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${CONFIRM_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTransactions = transaction.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        Alert.alert("Success", "Konfirmasi Pesanan Berhasil", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Konfirmasi Pesanan", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Failed to confirm transaction", error);
    }
  };

  const handleDecline = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${DECLINE_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTransactions = transaction.map((item) => {
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
        {item.status === "PENDING" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              title="Confirm"
              onPress={() => {
                handleConfirm(item.id);
              }}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              title="Decline"
              onPress={() => handleDecline(item.id)}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default All;
