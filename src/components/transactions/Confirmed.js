import { BASE_URI } from "@env";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { RadioButton } from "react-native-paper";
import styles from "./styles/transaction.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CANCEL_URI = `${BASE_URI}/api/transaction/buyer/cancel/`;
const noImage = require("../../assets/no-image-card.png");

const Confirmed = ({ transactions, handleGetAllTransaction, screen }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("price");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const confirmedTransactions = transactions
    ? transactions.filter((transaction) => transaction.status === "PAYABLE")
    : [];

  const handlePayTransaction = async (transactionId) => {
    console.log("Pay transaction with id", transactionId);
  };

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

  const openCancelModal = (transactionId) => {
    setSelectedTransaction(transactionId);
    setModalVisible(true);
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
        {screen === "OrderScreen" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              title="Pay"
              onPress={() => {
                handlePayTransaction(item.id);
              }}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              title="Cancel"
              onPress={() => openCancelModal(item.id)}
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
      {confirmedTransactions.length > 0 ? (
        <FlatList
          data={confirmedTransactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Belum ada transaksi yang dikonfirmasi oleh anda
          </Text>
        </View>
      )}
    </View>
  );
};

export default Confirmed;
