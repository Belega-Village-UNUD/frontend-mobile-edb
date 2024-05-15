import { BASE_URI } from "@env";
import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, Button, Alert } from "react-native";
import styles from "./styles/transaction.styles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CONFIRM_URI = `${BASE_URI}/api/transaction/confirm/`;

const All = ({ transactions, handleGetAllTransactions }) => {
  const [transaction, setTransaction] = useState(transactions);
  const navigation = useNavigation();

  useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  const handleConfirm = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${CONFIRM_URI}${transactionId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedTransactions = transaction.map((item) => {
          if (item.id === transactionId) {
            return response.data.data;
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
        {item.status === "PENDING" && (
          <View style={styles.buttonContainer}>
            <Button
              title="Confirm"
              onPress={() => {
                handleConfirm(item.id);
              }}
            />
            <Button
              title="Decline"
              onPress={() =>
                navigation.navigate("DeclineReason", { transactionId: item.id })
              }
            />
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
