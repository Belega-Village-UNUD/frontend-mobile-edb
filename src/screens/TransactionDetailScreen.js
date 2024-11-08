import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Button,
  Alert,
} from "react-native";
import { BASE_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";

const TRANSACTION_DETAIL_URI = `${BASE_URI}/api/transaction/`;
const SEND_SHIPPING_URI = `${BASE_URI}/api/shipping/seller/send`;
const noImage = require("../assets/no-image-card.png");

export default function TransactionDetailScreen({ route }) {
  const { transactionId } = route.params;
  const [transaction, setTransaction] = useState(null);
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  ]);

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

  const handleSendShipping = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${SEND_SHIPPING_URI}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transaction_id: transactionId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Shipping status updated to 'Sent'.");
        handleGetTransactionDetail(); // Refresh transaction details
      } else {
        Alert.alert("Failure", "Failed to update shipping status.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong, please try again later.");
    }
  };

  useEffect(() => {
    handleGetTransactionDetail();
  }, [transactionId]);

  const date = new Date(transaction?.createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Transaction Detail Screen</Text>
        {transaction ? (
          <View>
            <Text style={styles.detail}>ID: {transaction.id}</Text>
            <Text style={styles.detail}>Status: {transaction.status}</Text>
            <Text style={styles.detail}>
              Total Amount:{" "}
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              })
                .format(transaction.total_amount)
                .replace(/IDR/g, "")}
            </Text>
            <Text style={styles.detail}>Created At: {formattedDate}</Text>
            <Text style={styles.detail}>
              User Email: {transaction.user.email || "Belum Tersedia"}
            </Text>
            <Text style={styles.sectionTitle}>Cart Details:</Text>
            <FlatList
              data={transaction.cart_details}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Image
                    style={styles.image}
                    source={
                      item.product.images && item.product.images.length > 0
                        ? { uri: item.product.images[0] }
                        : noImage
                    }
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.productName}>
                      {item.product.name_product || "Belum Tersedia"}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.description}>
                      {item.product.desc_product || "Belum Tersedia"}
                    </Text>
                    <Text style={styles.detail}>
                      {item.product.store.name || "Belum Tersedia"}
                    </Text>
                    <Text style={styles.qty}>
                      Qty: {item.qty || "Belum Tersedia"}
                    </Text>
                    <Text style={styles.price}>
                      Harga per unit :{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })
                        .format(item.unit_price)
                        .replace(/IDR\s?/, "") || "Belum Tersedia"}
                    </Text>
                    <Text style={styles.detail}>
                      Alamat Pengiriman: {item.address || "Belum Tersedia"}
                    </Text>
                    <Text style={styles.detail}>
                      Metode Pengiriman:{" "}
                      {item.shipping_method || "Belum Tersedia"}
                    </Text>
                    <Text style={styles.detail}>
                      Status Pengiriman:{" "}
                      {item.arrival_shipping_status === "UNCONFIRMED"
                        ? "Belum Dikirim"
                        : item.arrival_shipping_status || "Belum Tersedia"}
                    </Text>
                    <View style={styles.userContainer}>
                      <Text style={styles.userEmail}>
                        User Email: {item.user.email || "Belum Tersedia"}
                      </Text>
                      <Text style={styles.userName}>
                        User Name:{" "}
                        {item.user.userProfile?.name || "Belum Tersedia"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
            {transaction.cart_details.some(
              (item) => item.arrival_shipping_status === "PACKING"
            ) && (
              <Button
                title="Kirim"
                onPress={handleSendShipping}
                color="#018675"
              />
            )}
          </View>
        ) : (
          <Text>Loading transaction details...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Neutral background
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100, // Ensure space for the button
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#018675", // Tokopedia green for titles
    marginBottom: 20,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    color: "#333", // Darker for better readability
    marginBottom: 10,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#018675", // Tokopedia green for section titles
    marginTop: 30,
    marginBottom: 15,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 5,
  },
  userContainer: {
    marginTop: 2,
    padding: 10,
    backgroundColor: "#e8f5e9", // Light green background for user container
    borderRadius: 5,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
});
