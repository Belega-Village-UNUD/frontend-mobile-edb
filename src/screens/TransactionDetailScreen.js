import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, FlatList } from "react-native";
import { BASE_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TRANSACTION_DETAIL_URI = `${BASE_URI}/api/transaction/`;

export default function TransactionDetailScreen({ route }) {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);

  const handleGetTransactionDetail = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        `${TRANSACTION_DETAIL_URI}${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setTransaction(data.data);
        console.log("Transaction Detail: ", data.data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetTransactionDetail();
  }, [transactionId]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction Detail Screen</Text>
      {transaction ? (
        <View>
          <Text style={styles.detail}>ID: {transaction.id}</Text>
          <Text style={styles.detail}>Status: {transaction.status}</Text>
          <Text style={styles.detail}>
            Total Amount: {transaction.total_amount}
          </Text>
          <Text style={styles.detail}>Created At: {transaction.createdAt}</Text>
          <Text style={styles.detail}>
            User Email: {transaction.user.email}
          </Text>
          <Text style={styles.sectionTitle}>Cart Details:</Text>
          <FlatList
            data={transaction.cart_details}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text>Product Name: {item.product.name_product}</Text>
                <Text>Description: {item.product.desc_product}</Text>
                <Text>Store: {item.product.store.name}</Text>
                <Text>Quantity: {item.qty}</Text>
                <Text>Unit Price: {item.unit_price}</Text>
                <Text>User Email: {item.user.email}</Text>
                <Text>User Name: {item.user.userProfile?.name}</Text>
              </View>
            )}
          />
        </View>
      ) : (
        <Text>Loading transaction details...</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
});
