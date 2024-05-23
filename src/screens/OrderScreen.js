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

    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      console.log("Fetched transactions successfully");
      return data.data;
    } else {
      console.log("Failed to fetch transactions");
    }
  } catch (e) {
    console.log("An error occurred while fetching transactions:", e);
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
        handleGetAllOrders={handleRefreshOrders}
        screen="OrderScreen"
      />
    </View>
  );
}
