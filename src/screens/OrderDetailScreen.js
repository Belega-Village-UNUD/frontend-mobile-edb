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
  TextInput,
} from "react-native";
import { BASE_URI } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
import { Rating } from "react-native-ratings";

const ORDER_DETAIL_URI = `${BASE_URI}/api/transaction/buyer/`;
const ORDER_RECEIVED_URI = `${BASE_URI}/api/shipping/arrived`;
const RATING_URI = `${BASE_URI}/api/rating`;
const noImage = require("../assets/no-image-card.png");

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0); // State for rating
  const [review, setReview] = useState(""); // State for review
  const [selectedProductId, setSelectedProductId] = useState(null); // State for selected product ID
  const [showRatingForm, setShowRatingForm] = useState(false); // State for showing rating form
  const [ratedProducts, setRatedProducts] = useState([]); // State for tracking rated products

  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
  ]);

  useEffect(() => {
    const loadRatedProducts = async () => {
      try {
        const storedRatedProducts = await AsyncStorage.getItem("ratedProducts");
        if (storedRatedProducts) {
          setRatedProducts(JSON.parse(storedRatedProducts));
        }
      } catch (error) {
        console.error("Failed to load rated products", error);
      }
    };

    loadRatedProducts();
    handleGetOrderDetail();
  }, [orderId]);

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

  const handleShippingCalculation = () => {
    navigation.navigate("CalculationShipping", {
      transactionId: order.id,
      totalAmount: order.total_amount,
      status: order.status,
    });
  };

  const handleCreateRating = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const payload = {
        transaction_id: order.id,
        product_id: selectedProductId,
        rate: rating,
        review: review,
      };

      console.log("Payload being sent to server:", payload);

      const response = await fetch(RATING_URI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        const errorData = JSON.parse(errorText);
        if (errorData.message === "Product has already been rated") {
          const updatedRatedProducts = [...ratedProducts, selectedProductId];
          setRatedProducts(updatedRatedProducts);
          await AsyncStorage.setItem(
            "ratedProducts",
            JSON.stringify(updatedRatedProducts)
          );
          setShowRatingForm(false);
        }
        throw new Error(`HTTP status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Rating submitted successfully.");
        setRating(0);
        setReview("");
        const updatedRatedProducts = [...ratedProducts, selectedProductId];
        setRatedProducts(updatedRatedProducts);
        await AsyncStorage.setItem(
          "ratedProducts",
          JSON.stringify(updatedRatedProducts)
        );
        setShowRatingForm(false);
      } else {
        Alert.alert("Failure", "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Failed to submit rating", error);
      Alert.alert("Error", "Failed to submit rating.");
    }
  };

  const handleOrderReceived = async (storeId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const payload = {
        store_id: storeId,
        transaction_id: order.id,
      };

      console.log("Payload being sent to server:", payload);

      const response = await fetch(ORDER_RECEIVED_URI, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Pesanan telah diterima.");
        handleGetOrderDetail(); // Refresh order details
      } else {
        Alert.alert("Failure", "Gagal mengonfirmasi pesanan diterima.");
      }
    } catch (error) {
      console.error("Gagal mengonfirmasi pesanan diterima", error);
      Alert.alert("Error", "Gagal mengonfirmasi pesanan diterima.");
    }
  };

  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating);
    setRating(rating);
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
                    {showRatingForm &&
                      selectedProductId === item.product.id && (
                        <View style={styles.ratingContainer}>
                          <Rating
                            showRating
                            onFinishRating={ratingCompleted}
                            style={{ paddingVertical: 10 }}
                          />
                          <TextInput
                            style={styles.reviewInput}
                            placeholder="Write a review"
                            value={review}
                            onChangeText={setReview}
                          />
                          <Button
                            title="Submit Rating"
                            onPress={handleCreateRating}
                            color="#018675"
                          />
                        </View>
                      )}
                    {item.arrival_shipping_status === "ARRIVED" &&
                      !ratedProducts.includes(item.product.id) && (
                        <Button
                          title="Rating"
                          onPress={() => {
                            setShowRatingForm(true);
                            setSelectedProductId(item.product.id); // Set the selected product ID
                          }}
                          color="#018675"
                        />
                      )}
                  </View>
                </View>
              )}
            />
          </View>
        ) : (
          <Text>Loading order details...</Text>
        )}
      </ScrollView>
      {order?.cart_details.some(
        (item) => item.arrival_shipping_status === "UNCONFIRMED"
      ) &&
        order.status === "PAYABLE" && (
          <View style={styles.buttonContainer}>
            <Button
              title="Kalkulasi Ongkir"
              onPress={handleShippingCalculation}
              color="#018675"
            />
          </View>
        )}
      {order?.cart_details.some(
        (item) => item.arrival_shipping_status === "SHIPPED"
      ) && (
        <View style={styles.buttonContainer}>
          <Button
            title="Pesanan Diterima"
            onPress={() =>
              handleOrderReceived(order.cart_details[0].product.store_id)
            }
            color="#018675"
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
    color: "#018675",
    marginBottom: 20,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#018675",
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
  ratingContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  reviewInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
  },
});
