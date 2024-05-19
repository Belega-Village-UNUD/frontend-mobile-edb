import { BASE_URI } from "@env";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TransactionNavigation from "../navigation/TransactionNavigation";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GET_ALL_URI = `${BASE_URI}/api/transaction/`;

export const handleGetAllTransactions = async () => {
  try {
    let token = await AsyncStorage.getItem("token");
    let store_id = await AsyncStorage.getItem("store_id");
    const response = await axios.get(`${GET_ALL_URI}?store_id=${store_id}`, {
      // include the store_id in the request
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    if (response.data.status === 200) {
      console.log("Fetched transactions successfully");
      return response.data.data;
    } else {
      console.error("Failed to fetch transactions");
    }
  } catch (e) {
    console.error("An error occurred while fetching transactions:", e);
  }
};

export default function SellerTransactionScreen() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    handleGetAllTransactions().then(setTransactions);
  }, []);

  const handleRefreshTransactions = async () => {
    const updatedTransactions = await handleGetAllTransactions();
    setTransactions(updatedTransactions);
  };

  return (
    <View style={{ flex: 1 }}>
      <TransactionNavigation
        transactions={transactions}
        handleGetAllTransactions={handleRefreshTransactions}
      />
    </View>
  );
}
