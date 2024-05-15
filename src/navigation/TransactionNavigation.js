import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import All from "../components/transactions/All";
import Confirmed from "../components/transactions/Confirmed";
import Declined from "../components/transactions/Declined";
import Pending from "../components/transactions/Pending";
import Payed from "../components/transactions/Payed";
import { StatusBar } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function TransactionNavigation({
  transactions,
  handleGetAllTransactions,
}) {
  return (
    <Tab.Navigator style={{ paddingTop: StatusBar.currentHeight }}>
      <Tab.Screen name="All">
        {() => (
          <All
            transactions={transactions}
            handleGetAllTransactions={handleGetAllTransactions}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Pending">
        {() => <Pending transactions={transactions} />}
      </Tab.Screen>
      <Tab.Screen name="Confirmed">
        {() => <Confirmed transactions={transactions} />}
      </Tab.Screen>
      <Tab.Screen name="Declined">
        {() => <Declined transactions={transactions} />}
      </Tab.Screen>
      <Tab.Screen name="Payed">
        {() => <Payed transactions={transactions} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
