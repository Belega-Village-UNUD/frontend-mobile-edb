import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import All from "../components/transactions/All";
import Confirmed from "../components/transactions/Confirmed";
import Declined from "../components/transactions/Declined";
import Pending from "../components/transactions/Pending";
import Paid from "../components/transactions/Paid";
import styles from "./style/topNavigation.styles";

const Tab = createMaterialTopTabNavigator();

export default function TransactionNavigation({
  transactions,
  handleGetAllTransactions,
  screen,
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.containerStyle,
        tabBarIndicatorStyle: styles.indicator,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tab.Screen name="All">
        {() => (
          <All
            transactions={transactions}
            handleGetAllTransactions={handleGetAllTransactions}
            screen={screen}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Pending">
        {() => (
          <Pending
            transactions={transactions}
            handleGetAllTransactions={handleGetAllTransactions}
            screen={screen}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Confirmed">
        {() => (
          <Confirmed
            transactions={transactions}
            screen={screen}
            handleGetAllTransactions={handleGetAllTransactions}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Declined">
        {() => <Declined transactions={transactions} />}
      </Tab.Screen>
      <Tab.Screen name="Paid">
        {() => <Paid transactions={transactions} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
