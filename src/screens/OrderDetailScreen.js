import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  Button,
} from "react-native";
import { BASE_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";

const ORDER_DETAIL_URI = `${BASE_URI}/api/transaction/buyer/`;
const noImage = require("../assets/no-image-card.png");

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [showButton, setShowButton] = useState(true);
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  ]);

  const handleGetOrderDetail = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${ORDER_DETAIL_URI}${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        console.log("Order Detail: ", data.data);
      } else {
        console.log("Failed to fetch data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const date = new Date(order?.createdAt);
  const formattedDate = date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  useEffect(() => {
    handleGetOrderDetail();
  }, [orderId]);

  const handleShippingCalculation = () => {
    navigation.navigate("CalculationShipping", {
      transactionId: order.id,
      totalAmount: order.total_amount,
      status: order.status,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Order Detail Screen</Text>
        {order ? (
          <View>
            <Text style={styles.detail}>Invoice : {order.id}</Text>
            <Text style={styles.detail}>Status Pemesanan: {order.status}</Text>
            <Text style={styles.detail}>
              Total Belanja:
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              })
                .format(order.total_amount)
                .replace(/IDR/g, "")}
            </Text>
            <Text style={styles.detail}>Waktu Pemesanan: {formattedDate}</Text>
            <Text style={styles.sectionTitle}>Detail Pemesanan:</Text>
            <FlatList
              data={order.cart_details}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Image
                    style={styles.image}
                    source={
                      item.product.image_product
                        ? { uri: item.product.image_product }
                        : noImage
                    }
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.productName}>
                      {item.product.name_product}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.description}>
                      {item.product.desc_product}
                    </Text>
                    <Text style={styles.detail}>{item.product.store.name}</Text>
                    <Text style={styles.qty}>Qty: {item.qty}</Text>
                    <Text style={styles.price}>
                      Harga per unit :{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })
                        .format(item.unit_price)
                        .replace(/IDR\s?/, "")}
                    </Text>
                    <View style={styles.userContainer}>
                      <Text style={styles.userEmail}>
                        User Email: {item.user.email}
                      </Text>
                      <Text style={styles.userName}>
                        User Name: {item.user.userProfile?.name || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <Text>Loading order details...</Text>
        )}
      </ScrollView>
      {showButton && (
        <View style={styles.buttonContainer}>
          <Button
            title="Kalkulasi Ongkir"
            onPress={handleShippingCalculation}
            color="#018675" // Tokopedia green color
          />
        </View>
      )}
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
