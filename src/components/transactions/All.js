import { BASE_URI } from "@env";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./styles/transaction.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CONFIRM_URI = `${BASE_URI}/api/transaction/confirm/`;
const DECLINE_URI = `${BASE_URI}/api/transaction/decline/`;
const CANCEL_URI = `${BASE_URI}/api/transaction/buyer/cancel/`;

const noImage = require("../../assets/no-image-card.png");

const All = ({ transactions, handleGetAllTransactions, screen }) => {
  const [transaction, setTransaction] = useState(transactions);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("price");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    setTransaction(transactions);
  }, [transactions]);

  const handleCancelTransaction = async (transactionId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${CANCEL_URI}${transactionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: cancelReason,
        }),
      });

      if (!response.ok) {
        throw new Error("HTTP status " + response.status);
      }

      const data = await response.json();
      console.log(data);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${CONFIRM_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTransactions = transaction.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        Alert.alert("Success", "Konfirmasi Pesanan Berhasil", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Konfirmasi Pesanan", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Failed to confirm transaction", error);
    }
  };

  const handleDecline = async (transactionId) => {
    try {
      let token = await AsyncStorage.getItem("token");
      const response = await fetch(`${DECLINE_URI}${transactionId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedTransactions = transaction.map((item) => {
          if (item.id === transactionId) {
            return data.data;
          } else {
            return item;
          }
        });

        setTransaction(updatedTransactions);
        Alert.alert("Success", "Berhasil Menolak Pesanan", [
          { text: "OK", onPress: () => handleGetAllTransactions() },
        ]);
      } else {
        Alert.alert("Failure", "Gagal Menolak Pesanan", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Gagal Menolak Pesanan", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image
        style={styles.image}
        source={
          item.cart.product.image_product
            ? { uri: item.cart.product.image_product }
            : noImage
        }
      />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.cart.product.name_product}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.price}>
          Price: {item.cart.unit_price * item.cart.qty}
        </Text>
        <Text style={styles.qty}>Quantity: {item.cart.qty}</Text>
        {item.status === "PENDING" && screen === "SellerTransactionScreen" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              title="Confirm"
              onPress={() => {
                handleConfirm(item.id);
              }}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              title="Decline"
              onPress={() => handleDecline(item.id)}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === "PAYABLE" && screen === "OrderScreen" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              title="Pay"
              onPress={() => {
                // handlePay(item.id);
              }}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              title="Cancel"
              onPress={() => {
                setSelectedTransaction(item.id);
                setModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Pilih alasan pembatalan:</Text>
            <RadioButton.Group
              onValueChange={(newValue) => setSelectedReason(newValue)}
              value={selectedReason}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton value="price" />
                <Text style={{ marginRight: 10 }}>Harga Terlalu Mahal</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton value="change" />
                <Text style={{ marginRight: 10 }}>Berubah Pikiran</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <RadioButton value="other" />
                <Text style={{ marginRight: 10 }}>Lainnya</Text>
              </View>
            </RadioButton.Group>
            {selectedReason === "other" && (
              <TextInput
                style={styles.modalInput}
                onChangeText={setCancelReason}
                value={cancelReason}
                placeholder="Enter reason"
              />
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                title="Submit"
                onPress={() => {
                  handleCancelTransaction(selectedTransaction);
                  // handleGetAllTransactions();
                }}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonClose}
                title="Close"
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default All;
