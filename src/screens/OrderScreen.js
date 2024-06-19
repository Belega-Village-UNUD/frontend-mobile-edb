import { BASE_URI } from "@env";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TransactionNavigation from "../navigation/TransactionNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GET_ALL_URI = `${BASE_URI}/api/transaction/buyer/all`;

export const handleGetAllOrders = async () => {
  try {
    let token = await AsyncStorage.getItem("token");
    const response = await fetch(GET_ALL_URI, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log(`Failed to fetch orders: ${response.status}`);
      return;
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.log("Failed to parse JSON:", error);
      return;
    }

    if (response.status === 200) {
      console.log("Fetched orders successfully");
      return data.data;
    } else {
      console.log("Failed to fetch orders");
    }
  } catch (e) {
    console.log("An error occurred while fetching orders:", e);
  }
};

export default function OrderScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    handleGetAllOrders().then(setOrders);
  }, []);

  const handleRefreshOrders = async () => {
    const updatedOrders = await handleGetAllOrders();
    setOrders(updatedOrders);
  };

  return (
    <View style={{ flex: 1 }}>
      <TransactionNavigation
        transactions={orders}
        handleGetAllTransactions={handleRefreshOrders}
        screen="OrderScreen"
      />
    </View>
  );
}
