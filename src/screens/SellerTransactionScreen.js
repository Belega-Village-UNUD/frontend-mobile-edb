import { BASE_URI } from "@env";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import TransactionNavigation from "../navigation/TransactionNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GET_ALL_URI = `${BASE_URI}/api/transaction/`;

export const handleGetAllTransactions = async () => {
  try {
    let token = await AsyncStorage.getItem("token");
    let store_id = await AsyncStorage.getItem("store_id");
    const response = await fetch(`${GET_ALL_URI}?store_id=${store_id}`, {
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
