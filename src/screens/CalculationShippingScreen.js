import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BASE_URI } from "@env";

const CALCULATING_URI = BASE_URI + "/api/shipping/costs/";
const CANCEL_TRANSACTION_URI = BASE_URI + "/api/transaction/cancel/";
const CONFIRM_TRANSACTION_URI = BASE_URI + "/api/transaction/buyer/final";

export default function CalculationShippingScreen({ route, navigation }) {
  const { transactionId, totalAmount, status } = route.params;
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingAgent, setSelectedShippingAgent] = useState("");
  const [selectedShippingDetails, setSelectedShippingDetails] = useState(null);
  const [totalWithShipping, setTotalWithShipping] = useState(totalAmount);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const navigateToOrderDetailsScreen = (transactionId) => {
    navigation.navigate("OrderDetail", { transactionId });
  };

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
        "Apakah anda yakin ingin kembali? jika iya, kalkulasi akan dibatalkan.",
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
          Alert.alert("Success", "Kalkulasi Berhasil");
          setIsButtonClicked(true); // Set button as clicked
          await AsyncStorage.setItem(
            `isButtonClicked_${transactionId}`,
            "true"
          );
          // navigation.navigate("OrderScreen");
          navigateToOrderDetailsScreen(transactionId);
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
      setSelectedShippingDetails({
        name: selectedOption.name,
        service: selectedOption.service,
        cost: shippingCost,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Transaction ID: {transactionId}</Text>
        <Text style={styles.label}>Total Amount: Rp. {totalAmount}</Text>
        <Text style={styles.label}>Status: {status}</Text>
        <Picker
          selectedValue={selectedShippingAgent}
          onValueChange={handleShippingAgentChange}
          style={styles.picker}
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
        {selectedShippingDetails && (
          <View style={styles.selectedShippingContainer}>
            <Text style={styles.selectedShippingText}>
              Selected Shipping Agent: {selectedShippingDetails.name}
            </Text>
            <Text style={styles.selectedShippingText}>
              Service: {selectedShippingDetails.service}
            </Text>
            <Text style={styles.selectedShippingText}>
              Cost: Rp. {selectedShippingDetails.cost}
            </Text>
          </View>
        )}
        <Text style={styles.label}>
          Total Amount with Shipping: Rp. {totalWithShipping}
        </Text>
        <Button
          title="Kalkulasi"
          onPress={handleConfirmCheckout}
          color={isButtonClicked ? "grey" : "#018675"} // Change color if clicked
          disabled={isButtonClicked} // Disable button if clicked
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    width: "90%",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
  },
  selectedShippingContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  selectedShippingText: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
});
