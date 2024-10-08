import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URI } from "@env";

const CALCULATING_URI = BASE_URI + "/api/shipping/costs/";
const CANCEL_TRANSACTION_URI = BASE_URI + "/api/transaction/cancel/";
const CONFIRM_TRANSACTION_URI = BASE_URI + "/api/transaction/buyer/";

export default function CalculationShippingScreen({ route, navigation }) {
  const { transactionId, totalAmount, status } = route.params;
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingAgent, setSelectedShippingAgent] = useState("");
  const [totalWithShipping, setTotalWithShipping] = useState(totalAmount);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    const checkButtonState = async () => {
      const buttonState = await AsyncStorage.getItem(
        `isButtonClicked_${transactionId}`
      );
      if (buttonState === "true") {
        setIsButtonClicked(true);
      }
    };

    checkButtonState();
    handleShippingCost();

    const backAction = () => {
      Alert.alert(
        "Tunggu",
        "Apakah anda yakin ingin kembali? jika iya, transaksi akan dibatalkan.",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "OK", onPress: () => handleCancelTransaction() },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleShippingCost = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(CALCULATING_URI + transactionId, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setShippingOptions(data.data);
    } catch (error) {
      console.error("Error fetching shipping cost:", error);
    }
  };

  const handleCancelTransaction = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(CANCEL_TRANSACTION_URI + transactionId, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error cancelling transaction:", error);
    }
  };

  const handleConfirmCheckout = async () => {
    if (isButtonClicked) {
      Alert.alert("Anda sudah memilih jasa pengiriman");
      return;
    }

    if (status !== "PAYABLE") {
      Alert.alert(
        "Error",
        "Transaction not valid, please wait for the status to be PAYABLE."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const [shippingCode, service] = selectedShippingAgent.split("-");
      let shippingCostIndex = [];
      let shippingName = [];

      const selectedOption = shippingOptions
        .flatMap((option, optionIndex) =>
          option.shipping.flatMap((shipping, shippingIndex) =>
            shipping.costs.map((cost, costIndex) => {
              if (cost.service === service && shipping.code === shippingCode) {
                shippingCostIndex = [optionIndex, shippingIndex, costIndex];
                shippingName = [shippingCode, shipping.name];
                return cost;
              }
              return null;
            })
          )
        )
        .find((cost) => cost !== null);

      if (selectedOption) {
        const url = `${CONFIRM_TRANSACTION_URI}?transaction_id=${transactionId}&shipping_cost_index=${JSON.stringify(
          shippingCostIndex
        )}&shipping_name=${JSON.stringify(shippingName)}`;

        const response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseText = await response.text(); // Get raw response text
        console.log("Raw response:", responseText); // Log raw response

        let responseData;
        try {
          responseData = JSON.parse(responseText); // Parse response text as JSON
        } catch (jsonError) {
          Alert.alert("Error", "Anda Sudah Memilih Jasa Pengiriman");
          return;
        }

        if (response.ok) {
          Alert.alert("Success", "Checkout confirmed!");
          setIsButtonClicked(true); // Set button as clicked
          await AsyncStorage.setItem(
            `isButtonClicked_${transactionId}`,
            "true"
          ); // Persist button state
        } else {
          console.error("Failed to confirm checkout:", responseData);
          Alert.alert(
            "Error",
            `Failed to confirm checkout: ${
              responseData.message || response.statusText
            }`
          );
        }
      } else {
        Alert.alert("Error", "Selected shipping option is not valid.");
      }
    } catch (error) {
      console.error("Error confirming checkout:", error);
      Alert.alert("Error", `Error confirming checkout: ${error.message}`);
    }
  };

  const handleShippingAgentChange = (itemValue) => {
    setSelectedShippingAgent(itemValue);
    const [shippingCode, service] = itemValue.split("-");
    const selectedOption = shippingOptions
      .flatMap((option) => option.shipping)
      .flatMap((shipping) => shipping.costs)
      .find((cost) => cost.service === service);

    if (selectedOption) {
      const shippingCost = selectedOption.cost[0].value;
      setTotalWithShipping(totalAmount + shippingCost);
    }
  };

  return (
    <View>
      <Text>Transaction ID: {transactionId}</Text>
      <Text>Total Amount: Rp. {totalAmount}</Text>
      <Text>Status: {status}</Text>
      <Picker
        selectedValue={selectedShippingAgent}
        onValueChange={handleShippingAgentChange}
      >
        {shippingOptions.map((option, index) =>
          option.shipping.map((shipping, shippingIndex) =>
            shipping.costs.map((cost, costIndex) => (
              <Picker.Item
                key={`${index}-${shippingIndex}-${costIndex}`}
                label={`${shipping.name} - ${cost.service} - Rp. ${cost.cost[0].value}`}
                value={`${shipping.code}-${cost.service}`}
              />
            ))
          )
        )}
      </Picker>
      <Text>Selected Shipping Agent: {selectedShippingAgent}</Text>
      <Text>Total Amount with Shipping: Rp. {totalWithShipping}</Text>
      <Button
        title="Kalkulasi"
        onPress={handleConfirmCheckout}
        color={isButtonClicked ? "grey" : "#018675"} // Change color if clicked
        disabled={isButtonClicked} // Disable button if clicked
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here if needed
});
